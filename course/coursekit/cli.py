"""`course` — the small program that stands between the folder and the website.

Stdlib only, on purpose: you already need Python for the course, and nothing here should
require a second install before the first lesson.
"""

from __future__ import annotations

import argparse
import importlib.util
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from coursekit import detect, server  # noqa: E402

B, D, R = "\033[1m", "\033[2m", "\033[0m"
OK, NO, DOT = "\033[32m✓\033[0m", "\033[31m✗\033[0m", "\033[2m·\033[0m"

MODULES = {
    1: "What is an LLM?", 2: "Working with a model", 3: "Tools and the agent loop",
    4: "Memory and context", 5: "Evals", 6: "Failure modes and guardrails",
    7: "Workflows and orchestration", 8: "Capstone: The Deep Research Agent",
}

ADAPTER_BODY = """# {label} — course adapter

Read `TUTOR.md` in this folder and follow it exactly. It defines how you teach here:
hint-first, never hand over a whole solution, and never edit anything under `checks/`.

The learner is on **Module {module}**. Start by reading `modules/m{module}/BUILD.md`.
"""


# ---------------------------------------------------------------- helpers
def state_path() -> Path:
    return ROOT / ".course" / "progress.json"


def load_state() -> dict:
    p = state_path()
    return json.loads(p.read_text()) if p.exists() else {"module": 1, "modules": {}}


def save_state(state: dict):
    state_path().parent.mkdir(parents=True, exist_ok=True)
    state_path().write_text(json.dumps(state, indent=2))


def load_trace():
    import tracing
    return tracing.load_latest()


def load_check_module(module: int):
    f = ROOT / "checks" / f"m{module}.py"
    if not f.exists():
        return None
    spec = importlib.util.spec_from_file_location(f"checks_m{module}", f)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


# ---------------------------------------------------------------- commands
def cmd_doctor(args) -> int:
    print(f"\n{B}Environment{R}\n")
    problems = []

    major, minor = sys.version_info[:2]
    if (major, minor) >= (3, 9):
        print(f"  {OK} Python {major}.{minor}")
    else:
        print(f"  {NO} Python {major}.{minor} — this course needs 3.9 or newer")
        problems.append("Install Python 3.9+ from python.org, then run this again.")

    env = ROOT / ".env"
    if env.exists():
        text = env.read_text()
        keys = [k for k in ("OPENAI_API_KEY", "ANTHROPIC_API_KEY")
                if any(line.startswith(k + "=") and len(line.split("=", 1)[1].strip()) > 8
                       for line in text.splitlines())]
        if keys:
            print(f"  {OK} .env has {', '.join(keys)}")
        else:
            print(f"  {NO} .env exists but has no usable API key")
            problems.append("Put a real key in .env — it is git-ignored and never leaves this machine.")
    else:
        print(f"  {NO} No .env file")
        problems.append("Run `./course init`, or copy .env.example to .env and add your key.")

    cap = os.getenv("MAX_USD", "1.00")
    print(f"  {OK} Spend cap ${float(cap):.2f} per run {D}(MAX_USD in .env){R}")

    agents = detect.installed()
    if agents:
        print(f"  {OK} Coding agent: {', '.join(detect.AGENTS[a][2] for a in agents)}")
    else:
        print(f"  {DOT} No coding agent detected on PATH {D}(fine — any agent that reads files works){R}")

    traces = sorted((ROOT / "traces").glob("*.json")) if (ROOT / "traces").exists() else []
    n = len([t for t in traces if t.name != "latest.json"])
    print(f"  {OK} {n} trace(s) recorded" if n else f"  {DOT} No traces yet {D}(you have not run your agent){R}")

    if problems:
        print(f"\n{B}Fix these{R}\n")
        for p in problems:
            print(f"  → {p}")
        print()
        return 1
    print(f"\n{OK} Ready.\n")
    return 0


def cmd_init(args) -> int:
    state = load_state()
    module = args.module or state.get("module", 1)

    print(f"\n{B}The Model and the Loop{R} {D}· setting up your lab{R}\n")

    # 1. .env
    env, example = ROOT / ".env", ROOT / ".env.example"
    if not env.exists() and example.exists():
        env.write_text(example.read_text())
        print(f"  {OK} Created .env {D}(add your API key — it is git-ignored){R}")
    else:
        print(f"  {OK} .env already present")

    # 2. adapter for whichever agent they actually have
    chosen = args.agent or detect.env_hint() or (detect.installed() or ["codex"])[0]
    if chosen not in detect.AGENTS:
        print(f"  {NO} Unknown agent '{chosen}'. Options: {', '.join(detect.AGENTS)}")
        return 1
    _, rel, label = detect.AGENTS[chosen]
    target = ROOT / rel
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(ADAPTER_BODY.format(label=label, module=module))
    print(f"  {OK} Wrote {rel} for {label}")

    # 3. folders the learner writes into
    for d in ("traces", "my-agent", ".course"):
        (ROOT / d).mkdir(parents=True, exist_ok=True)
    state["module"] = module
    save_state(state)
    print(f"  {OK} Set you to Module {module} — {MODULES[module]}")

    print(f"\n{B}Next{R}\n")
    print(f"  1. Put your API key in {B}.env{R}")
    print(f"  2. Open this folder in {label}")
    print(f"  3. Paste this to it:\n")
    print(f"     {B}Read TUTOR.md and start Module {module}. Do not write the solution for me.{R}\n")
    return 0


def cmd_check(args) -> int:
    state = load_state()
    module = args.module or state.get("module", 1)
    mod = load_check_module(module)
    if mod is None:
        print(f"\n  {DOT} No checks for Module {module} yet.\n")
        return 0

    trace = load_trace()
    print(f"\n{B}{mod.TITLE}{R}\n")
    results, failed = [], []
    for fn in mod.CHECKS:
        try:
            ok, message = fn(trace, ROOT)
        except Exception as exc:
            ok, message = False, f"check errored: {type(exc).__name__}: {exc}"
        results.append({"check": fn.__name__, "ok": bool(ok), "message": message})
        print(f"  {OK if ok else NO} {message}")
        if not ok:
            failed.append(fn.__name__)
            break  # one problem at a time reads better than a wall of red

    passed = not failed
    state.setdefault("modules", {})[str(module)] = {
        "passed": passed,
        "checked_at": datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z"),
        "results": results,
    }
    if passed and module < 8:
        state["module"] = module + 1
    save_state(state)

    if passed:
        print(f"\n{OK} Module {module} passed.")
        if module < 8:
            print(f"  Next: Module {module + 1} — {MODULES[module + 1]}\n")
        else:
            print()
    else:
        print(f"\n  {D}Ask your agent: \"the {failed[0]} check is failing — what am I missing?\"{R}\n")
    return 0 if passed else 1


def cmd_serve(args) -> int:
    origins = server.DEFAULT_ORIGINS + (args.origin or [])
    httpd, port = server.serve(ROOT, origins)
    print(f"\n{B}Bridge running{R} {D}on http://localhost:{port}{R}\n")
    print(f"  The course site can now read your traces. Nothing is uploaded —")
    print(f"  your browser reads this port directly and the data stays here.\n")
    print(f"  {D}Leave this running while you work. Ctrl-C to stop.{R}\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("  Bridge stopped.\n")
    return 0


def cmd_status(args) -> int:
    state = load_state()
    current = state.get("module", 1)
    trace = load_trace()
    print(f"\n{B}Where you are{R}\n")
    for n, title in MODULES.items():
        rec = state.get("modules", {}).get(str(n))
        mark = OK if rec and rec["passed"] else (f"{B}▸{R}" if n == current else DOT)
        style = B if n == current else (D if not (rec and rec["passed"]) else "")
        print(f"  {mark} {style}{n:02d}  {title}{R if style else ''}")
    if trace:
        t = trace["totals"]
        print(f"\n{D}Last run · module {trace['module']} · {t['llm_calls']} model calls, "
              f"{t['tool_calls']} tool calls, {t['input_tokens'] + t['output_tokens']} tokens, "
              f"~${t['usd_estimate']:.4f}{R}\n")
    else:
        print(f"\n{D}No runs yet.{R}\n")
    return 0


def main(argv=None) -> int:
    p = argparse.ArgumentParser(prog="course", description="The Model and the Loop — local lab.")
    sub = p.add_subparsers(dest="cmd")

    i = sub.add_parser("init", help="set up the lab for your coding agent")
    i.add_argument("--agent", choices=list(detect.AGENTS), help="force a specific agent")
    i.add_argument("--module", type=int, choices=range(1, 9), help="start at this module")
    i.set_defaults(fn=cmd_init)

    d = sub.add_parser("doctor", help="check your environment and say exactly what is wrong")
    d.set_defaults(fn=cmd_doctor)

    c = sub.add_parser("check", help="grade a module against your trace")
    c.add_argument("module", nargs="?", type=int, choices=range(1, 9))
    c.set_defaults(fn=cmd_check)

    s = sub.add_parser("serve", help="expose your traces to the course site on localhost")
    s.add_argument("--origin", action="append", help="allow an extra origin (repeatable)")
    s.set_defaults(fn=cmd_serve)

    t = sub.add_parser("status", help="show where you are")
    t.set_defaults(fn=cmd_status)

    args = p.parse_args(argv)
    if not args.cmd:
        p.print_help()
        return 0
    return args.fn(args)
