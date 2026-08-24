"use client"

/**
 * "Your run" — the panel that makes the site an X-ray of the learner's own build.
 *
 * Every module diagram on this site is drawn from example data. This panel draws the same
 * shape from the trace their agent just wrote. When the bridge is off it shows the demo
 * trace, labelled as such, so the page is never empty and never lies about whose run it is.
 */

import { useLab, type Span, type Trace } from "@/lib/lab"

const ACC = "var(--figure-accent)"
const INK = "var(--figure-accent-ink)"

/**
 * Stand-in data so the panel reads correctly before anyone has run anything. It is
 * per-module on purpose: Module 1's project is a single call, and showing it a loop would
 * promise the wrong thing.
 */
function demoFor(module: number): Trace {
  const span = (id: string, kind: Span["kind"], name: string, ms: number, attrs: Record<string, unknown>): Span =>
    ({ id, parent_id: null, kind, name, started_at: "", duration_ms: ms, attributes: attrs })

  if (module <= 2) {
    return {
      schema: "modelandloop.trace/v1", trace_id: "demo", module, agent: "my-agent",
      started_at: "", ended_at: "",
      totals: { llm_calls: 1, tool_calls: 0, errors: 0, input_tokens: 24, output_tokens: 96, usd_estimate: 0.0000616, duration_ms: 940 },
      spans: [span("a", "llm", "chat gpt-4o-mini", 940, {
        "gen_ai.request.model": "gpt-4o-mini", "gen_ai.request.temperature": 0.7,
        "gen_ai.usage.input_tokens": 24, "gen_ai.usage.output_tokens": 96,
        "gen_ai.response.finish_reasons": ["stop"],
      })],
    }
  }
  return {
    schema: "modelandloop.trace/v1", trace_id: "demo", module, agent: "my-agent",
    started_at: "", ended_at: "",
    totals: { llm_calls: 2, tool_calls: 1, errors: 0, input_tokens: 932, output_tokens: 152, usd_estimate: 0.000231, duration_ms: 1840 },
    spans: [
      span("a", "llm", "chat gpt-4o-mini", 812, { "gen_ai.request.model": "gpt-4o-mini", "gen_ai.usage.input_tokens": 412, "gen_ai.usage.output_tokens": 88, "gen_ai.response.finish_reasons": ["tool_calls"] }),
      span("b", "tool", "get_time", 41, { "gen_ai.tool.name": "get_time" }),
      span("c", "llm", "chat gpt-4o-mini", 987, { "gen_ai.request.model": "gpt-4o-mini", "gen_ai.usage.input_tokens": 520, "gen_ai.usage.output_tokens": 64, "gen_ai.response.finish_reasons": ["stop"] }),
    ],
  }
}

const KIND_LABEL: Record<Span["kind"], string> = { llm: "model", tool: "tool", step: "step" }

function num(v: unknown): number { return typeof v === "number" ? v : 0 }

/** model → tool → model, the shape Module 3's check looks for. */
function loopClosed(spans: Span[]): boolean {
  const k = spans.filter((s) => s.kind === "llm" || s.kind === "tool").map((s) => s.kind)
  return k.some((x, i) => x === "tool" && k.slice(0, i).includes("llm") && k.slice(i + 1).includes("llm"))
}

function Waterfall({ spans }: { spans: Span[] }) {
  const total = Math.max(1, spans.reduce((n, s) => n + s.duration_ms, 0))
  let elapsed = 0
  return (
    <ol className="mt-4 space-y-1.5">
      {spans.map((s) => {
        const left = (elapsed / total) * 100
        const width = Math.max(1.5, (s.duration_ms / total) * 100)
        elapsed += s.duration_ms
        const isTool = s.kind === "tool"
        const wide = width >= 18
        const tokens = num(s.attributes["gen_ai.usage.input_tokens"]) + num(s.attributes["gen_ai.usage.output_tokens"])
        return (
          <li key={s.id} className="grid grid-cols-[64px_minmax(0,1fr)_72px] items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">
              {KIND_LABEL[s.kind]}
            </span>
            <span className="relative block h-5 rounded-none bg-secondary/50">
              <span
                className="absolute top-0 h-5"
                style={{
                  left: `${left}%`, width: `${width}%`, minWidth: 4,
                  background: s.error ? "var(--destructive)" : isTool ? ACC : "var(--foreground)",
                }}
              />
              {/* Below ~18% the bar cannot hold its own label, so the label sits beside it. */}
              <span
                className={`absolute top-0 flex h-5 items-center whitespace-nowrap font-mono text-[10px] ${wide ? "text-background" : "text-muted-foreground"}`}
                style={wide ? { left: `${left}%`, paddingLeft: 6 } : { left: `min(${left + width}%, 78%)`, paddingLeft: 6 }}
              >
                {s.name}
              </span>
            </span>
            <span className="text-right font-mono text-[10px] text-muted-foreground">
              {s.duration_ms}ms{tokens ? ` · ${tokens}t` : ""}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="font-display text-2xl leading-none" style={accent ? { color: ACC } : undefined}>{value}</p>
      <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[.16em] text-muted-foreground">{label}</p>
    </div>
  )
}

export function YourRun({ module = 3 }: { module?: number }) {
  const { status, trace, traceCount } = useLab()
  const live = status === "on" && !!trace
  const shown = live ? (trace as Trace) : demoFor(module ?? 3)
  const t = shown.totals
  const closed = loopClosed(shown.spans)

  return (
    <figure className="border border-border bg-secondary/30 p-4 md:p-5">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border pb-3">
        <span className="font-mono text-[10px] uppercase tracking-[.18em]" style={{ color: INK }}>
          Your run
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">
          {live
            ? <>Live · module {shown.module} · {traceCount} run{traceCount === 1 ? "" : "s"} recorded</>
            : status === "probing" ? "Looking for your lab…"
            : status === "on" ? "Example data — your lab is connected, but you have not run anything yet"
            : "Example data — your lab is not connected"}
        </span>
      </figcaption>

      <Waterfall spans={shown.spans} />

      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-4 sm:grid-cols-4">
        <Stat label="model calls" value={String(t.llm_calls)} />
        <Stat label="tool calls" value={String(t.tool_calls)} accent={t.tool_calls > 0} />
        <Stat label="tokens" value={(t.input_tokens + t.output_tokens).toLocaleString()} />
        <Stat label="est. cost" value={`$${t.usd_estimate.toFixed(4)}`} />
      </div>

      <p className="mt-4 border-t border-border pt-3 text-sm leading-6 text-muted-foreground">
        {shown.totals.tool_calls === 0 ? (
          <>One call: {t.input_tokens} tokens in, {t.output_tokens} back. Everything the model
            knew for that reply was in the {t.input_tokens} — there is no memory between calls.</>
        ) : closed ? (
          <>The loop closed: the model asked for <span className="text-foreground">{shown.spans.find((s) => s.kind === "tool")?.name ?? "a tool"}</span>,
            your code ran it, and the result went back for another turn. That second model call is
            what makes this an agent rather than a single call.</>
        ) : (
          <>This run has a tool call, but the result never went back to the model — so it is not
            yet a loop.</>
        )}
      </p>

    </figure>
  )
}
