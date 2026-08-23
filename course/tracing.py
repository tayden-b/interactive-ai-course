"""The trace library. Wire this into the agent you build; the site reads what it writes.

Named tracing.py, not trace.py, because Python's standard library already owns `trace`
and a sibling file of that name shadows it.

The contract this file defines is the one thing the local folder and the website must
agree on, so it is deliberately small and boring:

    run = Run(module=3)
    with run.llm("gpt-4o-mini", temperature=0.7) as span:
        ...
        span.usage(input_tokens=412, output_tokens=88, finish_reason="tool_calls")
    with run.tool("get_weather") as span:
        ...
    run.save()

Shape follows the OpenTelemetry GenAI semantic conventions closely enough that these
traces can be exported to a real observability backend later without a rewrite.

PRIVACY: metadata only by default. Prompts, completions, and tool arguments are NOT
recorded unless you pass content=True to Run(). The site can fetch a trace over
localhost, so the default has to be the safe one.
"""

from __future__ import annotations

import json
import os
import time
import uuid
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path

SCHEMA = "modelandloop.trace/v1"
TRACE_DIR = Path(__file__).parent / "traces"

# Rough USD per 1M tokens. Only used for the estimate shown in the trace and the
# spend cap; it is not billing. Update when you change models.
PRICES = {
    "gpt-4o-mini": (0.15, 0.60),
    "gpt-4o": (2.50, 10.00),
    "claude-haiku-4-5": (1.00, 5.00),
    "claude-sonnet-5": (3.00, 15.00),
}


def _now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def _estimate_usd(model: str, input_tokens: int, output_tokens: int) -> float:
    for name, (pin, pout) in PRICES.items():
        if model and name in model:
            return round(input_tokens / 1e6 * pin + output_tokens / 1e6 * pout, 6)
    return 0.0


class Span:
    """One unit of work: a model call, a tool call, or a step you name yourself."""

    def __init__(self, run: "Run", kind: str, name: str, parent: str | None):
        self.run = run
        self.id = uuid.uuid4().hex[:16]
        self.parent_id = parent
        self.kind = kind          # llm | tool | step
        self.name = name
        self.started_at = _now()
        self._t0 = time.perf_counter()
        self.attributes: dict = {}
        self.error: dict | None = None
        self.duration_ms = 0

    def usage(self, input_tokens: int = 0, output_tokens: int = 0, finish_reason: str | None = None):
        """Record token usage on a model call. Call this before the `with` block exits."""
        self.attributes["gen_ai.usage.input_tokens"] = int(input_tokens)
        self.attributes["gen_ai.usage.output_tokens"] = int(output_tokens)
        if finish_reason:
            self.attributes["gen_ai.response.finish_reasons"] = [finish_reason]
        model = self.attributes.get("gen_ai.request.model", "")
        self.attributes["cost.usd_estimate"] = _estimate_usd(model, input_tokens, output_tokens)
        return self

    def set(self, **attrs):
        """Attach any extra attribute. Keep it to metadata, not content."""
        self.attributes.update(attrs)
        return self

    def to_dict(self) -> dict:
        d = {
            "id": self.id,
            "parent_id": self.parent_id,
            "kind": self.kind,
            "name": self.name,
            "started_at": self.started_at,
            "duration_ms": self.duration_ms,
            "attributes": self.attributes,
        }
        if self.error:
            d["error"] = self.error
        return d


class Run:
    """One end-to-end run of your agent. Produces exactly one trace file."""

    def __init__(self, module: int, agent: str = "my-agent", content: bool = False,
                 max_usd: float | None = None):
        self.trace_id = uuid.uuid4().hex
        self.module = module
        self.agent = agent
        self.content = content            # opt in to recording prompts/outputs
        self.max_usd = max_usd            # hard local spend cap; None = use $MAX_USD
        self.started_at = _now()
        self._t0 = time.perf_counter()
        self.spans: list[Span] = []
        self._stack: list[str] = []

    # -- span helpers ----------------------------------------------------------
    @contextmanager
    def _span(self, kind: str, name: str, **attrs):
        span = Span(self, kind, name, self._stack[-1] if self._stack else None)
        span.attributes.update(attrs)
        self.spans.append(span)
        self._stack.append(span.id)
        try:
            yield span
        except Exception as exc:                       # record, then re-raise
            span.error = {"type": type(exc).__name__, "message": str(exc)[:500]}
            raise
        finally:
            span.duration_ms = int((time.perf_counter() - span._t0) * 1000)
            self._stack.pop()
            self._enforce_cap()

    def llm(self, model: str, temperature: float | None = None, system: str | None = None, **attrs):
        """A model call. `system` is the provider (openai, anthropic), not the system prompt."""
        a = {"gen_ai.system": system or _provider_of(model), "gen_ai.request.model": model}
        if temperature is not None:
            a["gen_ai.request.temperature"] = temperature
        a.update(attrs)
        return self._span("llm", f"chat {model}", **a)

    def tool(self, name: str, **attrs):
        """A tool call your code executes on the model's behalf."""
        return self._span("tool", name, **{"gen_ai.tool.name": name, **attrs})

    def step(self, name: str, **attrs):
        """Any other step worth seeing in the trace — planning, retrieval, validation."""
        return self._span("step", name, **attrs)

    # -- spend cap -------------------------------------------------------------
    def _enforce_cap(self):
        cap = self.max_usd if self.max_usd is not None else float(os.getenv("MAX_USD", "1.00"))
        if cap and self.usd() > cap:
            raise BudgetExceeded(
                f"This run has spent about ${self.usd():.4f}, over the ${cap:.2f} cap. "
                f"Raise MAX_USD in .env if that is genuinely what you meant to spend."
            )

    # -- totals ----------------------------------------------------------------
    def usd(self) -> float:
        return round(sum(s.attributes.get("cost.usd_estimate", 0.0) for s in self.spans), 6)

    def totals(self) -> dict:
        llm = [s for s in self.spans if s.kind == "llm"]
        tool = [s for s in self.spans if s.kind == "tool"]
        return {
            "llm_calls": len(llm),
            "tool_calls": len(tool),
            "errors": sum(1 for s in self.spans if s.error),
            "input_tokens": sum(s.attributes.get("gen_ai.usage.input_tokens", 0) for s in llm),
            "output_tokens": sum(s.attributes.get("gen_ai.usage.output_tokens", 0) for s in llm),
            "usd_estimate": self.usd(),
            "duration_ms": int((time.perf_counter() - self._t0) * 1000),
        }

    def to_dict(self) -> dict:
        return {
            "schema": SCHEMA,
            "trace_id": self.trace_id,
            "module": self.module,
            "agent": self.agent,
            "started_at": self.started_at,
            "ended_at": _now(),
            "records_content": self.content,
            "totals": self.totals(),
            "spans": [s.to_dict() for s in self.spans],
        }

    def save(self, directory: Path | None = None) -> Path:
        """Write the trace and update latest.json. Returns the path written."""
        d = directory or TRACE_DIR
        d.mkdir(parents=True, exist_ok=True)
        stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S")
        path = d / f"{stamp}-m{self.module}-{self.trace_id[:8]}.json"
        payload = self.to_dict()
        path.write_text(json.dumps(payload, indent=2))
        (d / "latest.json").write_text(json.dumps(payload, indent=2))
        return path

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        self.save()
        return False


class BudgetExceeded(RuntimeError):
    """Raised when a run passes its local spend cap. This is a feature."""


def _provider_of(model: str) -> str:
    m = (model or "").lower()
    if m.startswith("gpt") or m.startswith("o1") or m.startswith("o3"):
        return "openai"
    if "claude" in m:
        return "anthropic"
    if "gemini" in m:
        return "gcp.gemini"
    return "unknown"


def load_latest(directory: Path | None = None) -> dict | None:
    """Read the most recent trace, or None if the learner has not run anything yet."""
    d = directory or TRACE_DIR
    latest = d / "latest.json"
    if latest.exists():
        return json.loads(latest.read_text())
    files = sorted(d.glob("*.json")) if d.exists() else []
    return json.loads(files[-1].read_text()) if files else None
