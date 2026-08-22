// Charts for the figure slots. Same language as the drawn figures: one blue series, muted context,
// mono tick labels, one baseline hairline, no gridlines, no legend boxes, no library chrome.
// All SVG on a viewBox so they scale with the reading column.
import type { ReactNode } from "react"

const ACC = "var(--figure-accent)"
const INK_ACC = "var(--figure-accent-ink)"
const SOFT = "var(--figure-accent-soft)"
const MUTED = "var(--muted-foreground)"
const BORDER = "var(--border)"
const INK = "currentColor"
const MONO: React.CSSProperties = { fontFamily: "var(--font-mono), ui-monospace, monospace", fontSize: 11, fill: MUTED, letterSpacing: ".06em" }

function Frame({ title, note, children }: { title?: string; note?: string; children: ReactNode }) {
  return (
    <div>
      {title && <p className="mb-3 font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">{title}</p>}
      {children}
      {note && <p className="mt-2 text-[12px] italic text-muted-foreground">{note}</p>}
    </div>
  )
}

/* ---------- Bars ---------- */

export type Bar = { label: string; value: number; accent?: boolean; display?: string }

/** Vertical bars. Values shown above each bar in mono; the accented bar is blue. */
export function Bars({ data, title, note, unit = "", max, height = 220 }: { data: Bar[]; title?: string; note?: string; unit?: string; max?: number; height?: number }) {
  const W = 720, H = height, padT = 28, padB = 34, padL = 8, padR = 8
  const m = max ?? Math.max(...data.map(d => d.value)) * 1.05
  const n = data.length, slot = (W - padL - padR) / n, bw = Math.min(72, slot * 0.56)
  const y = (v: number) => padT + (H - padT - padB) * (1 - v / m)
  return (
    <Frame title={title} note={note}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block", height: "auto" }} fill="none">
        <line x1={padL} x2={W - padR} y1={H - padB} y2={H - padB} stroke={BORDER} strokeWidth={1.5} />
        {data.map((d, i) => {
          const cx = padL + slot * i + slot / 2, top = y(d.value), h = H - padB - top
          return (
            <g key={i}>
              <rect x={cx - bw / 2} y={top} width={bw} height={h} rx={2} fill={d.accent ? ACC : MUTED} opacity={d.accent ? 1 : 0.35} />
              <text x={cx} y={top - 8} textAnchor="middle" style={{ ...MONO, fill: d.accent ? INK_ACC : MUTED }}>{d.display ?? `${d.value}${unit}`}</text>
              <text x={cx} y={H - padB + 20} textAnchor="middle" style={MONO}>{d.label}</text>
            </g>
          )
        })}
      </svg>
    </Frame>
  )
}

/* ---------- Line ---------- */

export type Series = { name?: string; points: number[]; accent?: boolean; dashed?: boolean }

function pathFor(pts: number[], x: (i: number) => number, y: (v: number) => number) {
  return pts.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ")
}

/** One or more lines on a shared axis. The accented series is blue with a soft area beneath. */
export function Line({ series, xLabels, title, note, cap, capLabel, yMax, yMin = 0, height = 240, unit = "" }: {
  series: Series[]; xLabels?: string[]; title?: string; note?: string; cap?: number; capLabel?: string; yMax?: number; yMin?: number; height?: number; unit?: string
}) {
  const named = series.some(s => s.name)
  const W = 720, H = height, padT = 24, padB = 34, padL = 44, padR = named ? 96 : 28
  const n = Math.max(...series.map(s => s.points.length))
  const m = yMax ?? Math.max(...series.flatMap(s => s.points), cap ?? 0) * 1.08
  const x = (i: number) => padL + (W - padL - padR) * (n === 1 ? 0 : i / (n - 1))
  const y = (v: number) => padT + (H - padT - padB) * (1 - (v - yMin) / (m - yMin))
  return (
    <Frame title={title} note={note}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block", height: "auto" }} fill="none">
        <line x1={padL} x2={W - padR} y1={H - padB} y2={H - padB} stroke={BORDER} strokeWidth={1.5} />
        <text x={padL - 8} y={y(m) + 4} textAnchor="end" style={MONO}>{`${Math.round(m)}${unit}`}</text>
        <text x={padL - 8} y={y(yMin) + 4} textAnchor="end" style={MONO}>{`${yMin}${unit}`}</text>
        {cap !== undefined && (
          <g>
            <line x1={padL} x2={W - padR} y1={y(cap)} y2={y(cap)} stroke={INK} strokeWidth={1.25} strokeDasharray="4 5" opacity={0.7} />
            {capLabel && <text x={W - padR} y={y(cap) - 6} textAnchor="end" style={{ ...MONO, fill: INK }}>{capLabel}</text>}
          </g>
        )}
        {series.map((s, k) => {
          const d = pathFor(s.points, x, y)
          const last = s.points.length - 1
          return (
            <g key={k}>
              {s.accent && <path d={`${d} L${x(last).toFixed(1)} ${y(yMin)} L${x(0).toFixed(1)} ${y(yMin)} Z`} fill={SOFT} />}
              <path d={d} stroke={s.accent ? ACC : MUTED} strokeWidth={s.accent ? 2.25 : 1.5} strokeDasharray={s.dashed ? "4 5" : undefined} opacity={s.accent ? 1 : 0.7} strokeLinejoin="round" strokeLinecap="round" />
              <circle cx={x(last)} cy={y(s.points[last])} r={3.5} fill={s.accent ? ACC : MUTED} />
              {s.name && <text x={x(last) + 9} y={y(s.points[last]) + 4} style={{ ...MONO, fill: s.accent ? INK_ACC : MUTED }}>{s.name}</text>}
            </g>
          )
        })}
        {xLabels?.map((l, i) => <text key={i} x={x(i)} y={H - padB + 20} textAnchor="middle" style={MONO}>{l}</text>)}
      </svg>
    </Frame>
  )
}

/* ---------- Timeline ---------- */

export type Span = { label: string; start: number; end: number; accent?: boolean; depth?: number }

/** Spans on a shared time axis. Overlap is concurrency; the accented span is where the time went. */
export function Timeline({ rows, total, unit = "s", title, note, ticks = 4 }: { rows: Span[]; total: number; unit?: string; title?: string; note?: string; ticks?: number }) {
  const W = 720, rowH = 30, padT = 12, padB = 30, padL = 150, padR = 20
  const H = padT + rows.length * rowH + padB
  const x = (t: number) => padL + (W - padL - padR) * (t / total)
  return (
    <Frame title={title} note={note}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block", height: "auto" }} fill="none">
        {rows.map((r, i) => {
          const cy = padT + rowH * i + rowH / 2
          return (
            <g key={i}>
              <text x={padL - 14 + (r.depth ?? 0) * 16} y={cy + 4} textAnchor="end" style={{ ...MONO, fill: r.accent ? INK_ACC : (r.depth ? MUTED : INK), letterSpacing: 0, fontSize: 12 }}>{r.label}</text>
              <rect x={x(r.start)} y={cy - 8} width={Math.max(2, x(r.end) - x(r.start))} height={16} rx={3} fill={r.accent ? ACC : MUTED} opacity={r.accent ? 1 : 0.35} />
            </g>
          )
        })}
        <line x1={padL} x2={W - padR} y1={H - padB + 6} y2={H - padB + 6} stroke={BORDER} strokeWidth={1.5} />
        {Array.from({ length: ticks + 1 }, (_, i) => (total * i) / ticks).map((t, i) => (
          <text key={i} x={x(t)} y={H - padB + 24} textAnchor={i === 0 ? "start" : i === ticks ? "end" : "middle"} style={MONO}>{`${Number.isInteger(t) ? t : t.toFixed(1)}${unit}`}</text>
        ))}
      </svg>
    </Frame>
  )
}

/* ---------- Spark ---------- */

/** An inline sparkline for a sentence like "pass rate, last 12 runs". */
export function Spark({ points, accent = true, width = 140, height = 32 }: { points: number[]; accent?: boolean; width?: number; height?: number }) {
  const m = Math.max(...points), lo = Math.min(...points)
  const x = (i: number) => 2 + (width - 4) * (i / (points.length - 1))
  const y = (v: number) => 2 + (height - 4) * (1 - (v - lo) / ((m - lo) || 1))
  const d = pathFor(points, x, y)
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} fill="none" style={{ display: "inline-block", verticalAlign: "middle" }}>
      <path d={d} stroke={accent ? ACC : MUTED} strokeWidth={1.75} strokeLinejoin="round" />
      <circle cx={x(points.length - 1)} cy={y(points[points.length - 1])} r={2.5} fill={accent ? ACC : MUTED} />
    </svg>
  )
}

/* ---------- Stacked bar ---------- */

export type Seg = { label: string; value: number; accent?: boolean }

/** One horizontal bar split into segments — "where the money went". */
export function Stacked({ segments, title, note, unit = "" }: { segments: Seg[]; title?: string; note?: string; unit?: string }) {
  const W = 720, H = 96, padL = 8, padR = 8, barY = 18, barH = 22
  const total = segments.reduce((a, s) => a + s.value, 0)
  let acc = 0
  return (
    <Frame title={title} note={note}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block", height: "auto" }} fill="none">
        {segments.map((s, i) => {
          const x0 = padL + (W - padL - padR) * (acc / total); acc += s.value
          const w = (W - padL - padR) * (s.value / total)
          const mid = x0 + w / 2
          return (
            <g key={i}>
              <rect x={x0 + 1} y={barY} width={Math.max(0, w - 2)} height={barH} rx={2} fill={s.accent ? ACC : MUTED} opacity={s.accent ? 1 : 0.22 + 0.08 * (i % 3)} />
              <text x={mid} y={barY + barH + 20} textAnchor="middle" style={{ ...MONO, fill: s.accent ? INK_ACC : MUTED }}>{s.label}</text>
              <text x={mid} y={barY + barH + 36} textAnchor="middle" style={MONO}>{`${Math.round((s.value / total) * 100)}%${unit ? ` · ${s.value}${unit}` : ""}`}</text>
            </g>
          )
        })}
      </svg>
    </Frame>
  )
}
