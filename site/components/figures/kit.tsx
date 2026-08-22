// Typeset blocks for the figure slots that are not drawings: code, transcripts, comparisons,
// tables, steps, notes, flows, numbers. They sit inside the <Figure> frame and share the book's
// one accent (electric blue). Structure and weight do the work; colour points at the one idea.
import type { ReactNode } from "react"

const ACC = "var(--figure-accent)"
const INK = "var(--figure-accent-ink)"
const SOFT = "var(--figure-accent-soft)"

/* ---------- Code ---------- */

export type Lang = "json" | "python" | "bash" | "ts" | "http" | "text"

const KW: Record<Lang, string[]> = {
  python: ["def","return","if","elif","else","for","while","in","import","from","as","with","try","except","raise","class","not","and","or","True","False","None","lambda","yield","pass","break","continue","await","async","assert"],
  ts: ["const","let","var","function","return","if","else","for","while","await","async","import","from","export","new","true","false","null","undefined","type","interface","class","throw","try","catch"],
  http: ["GET","POST","PUT","PATCH","DELETE"],
  bash: [], json: [], text: [],
}

type Tok = { t: "key" | "kw" | "str" | "num" | "cmt" | "prompt" | "plain"; s: string }

function tokenizeLine(line: string, lang: Lang): Tok[] {
  if (lang === "text") return [{ t: "plain", s: line }]
  const out: Tok[] = []
  let rest = line
  if (lang === "bash" && /^\$\s/.test(rest)) { out.push({ t: "prompt", s: "$ " }); rest = rest.slice(2) }
  const cmt = lang === "ts" ? /^\/\/.*$/ : /^#.*$/
  const re = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')(\s*:)?|(\b\d+(?:\.\d+)?(?:%|ms|s|k|K|GB|TB|x)?\b)|([A-Za-z_][A-Za-z0-9_-]*)|(\s+|[^\sA-Za-z0-9_"']+)/y
  let i = 0
  while (i < rest.length) {
    const c = cmt.exec(rest.slice(i))
    if (c && (lang !== "ts" || true)) { out.push({ t: "cmt", s: c[0] }); break }
    re.lastIndex = i
    const m = re.exec(rest)
    if (!m) { out.push({ t: "plain", s: rest.slice(i) }); break }
    i = re.lastIndex
    if (m[1] !== undefined) {
      if (m[2] !== undefined) { out.push({ t: "key", s: m[1] }); out.push({ t: "plain", s: m[2] }) }
      else out.push({ t: "str", s: m[1] })
    } else if (m[3] !== undefined) out.push({ t: "num", s: m[3] })
    else if (m[4] !== undefined) out.push({ t: KW[lang].includes(m[4]) ? "kw" : "plain", s: m[4] })
    else out.push({ t: "plain", s: m[5] ?? m[0] })
  }
  return out
}

const TOK_STYLE: Record<Tok["t"], React.CSSProperties> = {
  key: { color: INK, fontWeight: 500 },
  kw: { color: INK, fontWeight: 500 },
  num: { color: INK },
  str: { color: "var(--foreground)" },
  cmt: { color: "var(--muted-foreground)", fontStyle: "italic" },
  prompt: { color: "var(--muted-foreground)" },
  plain: {},
}

/** A code listing. `mark` = 1-based lines to highlight. */
export function Code({ lang = "text", title, mark = [], children }: { lang?: Lang; title?: string; mark?: number[]; children: string }) {
  const lines = children.replace(/^\n/, "").replace(/\n\s*$/, "").split("\n")
  return (
    <div className="overflow-hidden rounded-[3px] border border-border bg-card">
      {(title || lang !== "text") && (
        <div className="flex items-center justify-between border-b border-border px-4 py-2 font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">
          <span>{title ?? ""}</span><span>{lang !== "text" ? lang : ""}</span>
        </div>
      )}
      <pre className="overflow-x-auto px-0 py-3 font-mono text-[12.5px] leading-6 text-foreground">
        {lines.map((ln, i) => {
          const hot = mark.includes(i + 1)
          return (
            <div key={i} className="px-4" style={hot ? { background: SOFT, boxShadow: `inset 2px 0 0 ${ACC}` } : undefined}>
              {tokenizeLine(ln, lang).map((tk, j) => <span key={j} style={TOK_STYLE[tk.t]}>{tk.s}</span>)}
              {ln === "" ? " " : null}
            </div>
          )
        })}
      </pre>
    </div>
  )
}

/* ---------- Transcript ---------- */

export type Turn = { role: "user" | "assistant" | "system" | "tool"; text: ReactNode; note?: string }

/** A conversation or run, one row per message. Tool rows are data: mono, tinted, ruled. */
export function Transcript({ turns, title }: { turns: Turn[]; title?: string }) {
  return (
    <div>
      {title && <p className="mb-3 font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">{title}</p>}
      <div className="space-y-2.5">
        {turns.map((t, i) => {
          const tool = t.role === "tool"
          return (
            <div key={i} className="grid grid-cols-[68px_1fr] gap-3">
              <span className="pt-[3px] font-mono text-[10px] uppercase tracking-[.14em]" style={{ color: tool ? INK : "var(--muted-foreground)" }}>{t.role}</span>
              <div>
                <div className={tool ? "rounded-[3px] px-3 py-1.5 font-mono text-[12px] leading-5" : "text-[14px] leading-6 text-foreground"}
                     style={tool ? { background: SOFT, boxShadow: `inset 2px 0 0 ${ACC}` } : undefined}>{t.text}</div>
                {t.note && <p className="mt-1 text-[12px] italic text-muted-foreground">{t.note}</p>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ---------- Compare ---------- */

export type Panel = { title: string; children: ReactNode; accent?: boolean; note?: string }

/** Two things side by side. The accented one carries a blue rule on top. */
export function Compare({ left, right }: { left: Panel; right: Panel }) {
  const P = ({ p }: { p: Panel }) => (
    <div className="pt-3" style={{ borderTop: `2px solid ${p.accent ? ACC : "var(--border)"}` }}>
      <p className="font-mono text-[10px] uppercase tracking-[.16em]" style={{ color: p.accent ? INK : "var(--muted-foreground)" }}>{p.title}</p>
      <div className="mt-3 text-[14px] leading-6">{p.children}</div>
      {p.note && <p className="mt-3 text-[12px] italic text-muted-foreground">{p.note}</p>}
    </div>
  )
  return <div className="grid gap-8 md:grid-cols-2"><P p={left} /><P p={right} /></div>
}

/* ---------- Table ---------- */

/** An honest table: mono header, hairlines, bold first column, one accented column if asked. */
export function Table({ head, rows, accentCol }: { head: string[]; rows: ReactNode[][]; accentCol?: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[13px] leading-5">
        <thead>
          <tr>{head.map((h, i) => <th key={i} className="border-b border-foreground/30 pb-2 pr-4 text-left font-mono text-[10px] font-normal uppercase tracking-[.14em]" style={{ color: i === accentCol ? INK : "var(--muted-foreground)" }}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => <td key={j} className={`border-b border-border py-2.5 pr-4 align-top ${j === 0 ? "font-medium text-foreground" : "text-muted-foreground"}`} style={j === accentCol ? { color: INK, fontWeight: 500 } : undefined}>{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ---------- Steps ---------- */

/** Numbered steps. `accent` = the index that is the point. */
export function Steps({ items, accent }: { items: { title: string; body?: ReactNode }[]; accent?: number }) {
  return (
    <ol className="space-y-3">
      {items.map((it, i) => (
        <li key={i} className="grid grid-cols-[36px_1fr] gap-2">
          <span className="pt-[3px] font-mono text-[11px]" style={{ color: i === accent ? INK : "var(--muted-foreground)" }}>{String(i + 1).padStart(2, "0")}</span>
          <div>
            <p className="text-[14px] font-medium leading-6" style={i === accent ? { color: INK } : undefined}>{it.title}</p>
            {it.body && <p className="mt-0.5 text-[13px] leading-5 text-muted-foreground">{it.body}</p>}
          </div>
        </li>
      ))}
    </ol>
  )
}

/* ---------- Note ---------- */

/** A callout with a blue rule. Use for the one sentence the figure exists to deliver. */
export function Note({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="pl-4" style={{ borderLeft: `2px solid ${ACC}` }}>
      {label && <p className="font-mono text-[10px] uppercase tracking-[.16em]" style={{ color: INK }}>{label}</p>}
      <div className="mt-1 text-[14px] leading-6 text-foreground">{children}</div>
    </div>
  )
}

/* ---------- Flow ---------- */

export type FlowItem = string | { label: string; accent?: boolean; sub?: string }

/** A left-to-right sequence set as text — no pills, no boxes. The accented item is the point. */
export function Flow({ items, loop }: { items: FlowItem[]; loop?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px]">
      {items.map((it, i) => {
        const o = typeof it === "string" ? { label: it } : it
        return (
          <span key={i} className="flex items-center gap-x-3">
            <span className="flex flex-col">
              <span className="font-medium" style={o.accent ? { color: INK, boxShadow: `inset 0 -2px 0 ${ACC}` } : undefined}>{o.label}</span>
              {o.sub && <span className="text-[11px] text-muted-foreground">{o.sub}</span>}
            </span>
            {i < items.length - 1 && <span className="text-muted-foreground">→</span>}
          </span>
        )
      })}
      {loop && <span className="text-muted-foreground">↺</span>}
    </div>
  )
}

/* ---------- Numbers ---------- */

/** Big numbers with small labels. Use when the magnitude IS the message. */
export function Numbers({ items }: { items: { value: string; label: string; accent?: boolean }[] }) {
  return (
    <div className="flex flex-wrap gap-x-12 gap-y-6">
      {items.map((it, i) => (
        <div key={i}>
          <p className="font-display text-5xl leading-none tracking-tight" style={it.accent ? { color: ACC } : undefined}>{it.value}</p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">{it.label}</p>
        </div>
      ))}
    </div>
  )
}

/* ---------- KV ---------- */

/** Label / value rows. For "what's in a request", "what a trace records", and the like. */
export function KV({ rows }: { rows: { k: string; v: ReactNode; accent?: boolean }[] }) {
  return (
    <dl className="divide-y divide-border">
      {rows.map((r, i) => (
        <div key={i} className="grid grid-cols-[120px_1fr] gap-4 py-2.5">
          <dt className="font-mono text-[11px] uppercase tracking-[.12em]" style={{ color: r.accent ? INK : "var(--muted-foreground)" }}>{r.k}</dt>
          <dd className="text-[14px] leading-6" style={r.accent ? { color: INK, fontWeight: 500 } : undefined}>{r.v}</dd>
        </div>
      ))}
    </dl>
  )
}

/** Inline emphasis inside any block: the phrase to notice. */
export function Mark({ children }: { children: ReactNode }) {
  return <span className="font-medium" style={{ color: INK }}>{children}</span>
}

/** Stack blocks vertically with the frame's rhythm. */
export function Stack({ children }: { children: ReactNode }) {
  return <div className="space-y-6">{children}</div>
}
