"use client"

/**
 * Temperature, by hand. The same five buckets as Figure 3.1 (sleep 9%, cook, relax, read,
 * thousands more). Drag the slider and the shares re-weight the way real sampling does:
 * each token's log-probability is divided by the temperature, then the list is renormalised.
 * The long tail is modelled as two thousand tiny tokens, which is what makes it swell at
 * high temperature and vanish at low. Illustrative numbers, real arithmetic.
 */

import { useMemo, useState } from "react"

const ACC = "var(--figure-accent)"
const INK = "var(--figure-accent-ink)"

const HEAD = [
  { label: "sleep", p: 0.09 },
  { label: "cook", p: 0.06 },
  { label: "relax", p: 0.04 },
  { label: "read", p: 0.03 },
]
const TAIL_N = 2000
const TAIL_P = 1 - HEAD.reduce((s, h) => s + h.p, 0) // 0.78 spread over TAIL_N tokens

const PRESETS = [0, 0.3, 0.7, 1, 1.5, 2]

function shares(temp: number): number[] {
  if (temp <= 0.001) return [1, 0, 0, 0, 0]
  const w = HEAD.map((h) => Math.exp(Math.log(h.p) / temp))
  const tailEach = Math.exp(Math.log(TAIL_P / TAIL_N) / temp)
  const z = w.reduce((s, x) => s + x, 0) + tailEach * TAIL_N
  return [...w.map((x) => x / z), (tailEach * TAIL_N) / z]
}

function pick(s: number[]): number {
  let r = Math.random()
  for (let i = 0; i < s.length; i++) { r -= s[i]; if (r <= 0) return i }
  return s.length - 1
}

const LABELS = [...HEAD.map((h) => h.label), "thousands more"]
const TAIL_WORDS = ["pretend", "photosynthesis", "Tuesday", "uh", "paddle", "quietly", "7", "the", "ocean", "retire"]

function describe(t: number): string {
  if (t <= 0.001) return "Always the top bar. The same reply every time; good for lookup and code."
  if (t < 0.6) return "Mostly sleep, with the occasional second choice. Steady, slightly varied."
  if (t < 1.2) return "The model's own odds, more or less. Varied but still sensible."
  if (t < 1.7) return "The tail is taking over. Replies wander; this is where the odd word shows up."
  return "Nearly flat. Almost any token can come next, and most of them do not fit."
}

export function TemperatureDemo() {
  const [temp, setTemp] = useState(1)
  const [picks, setPicks] = useState<number[]>([])
  const s = useMemo(() => shares(temp), [temp])

  const W = 720, H = 190, padT = 28, padB = 34, padL = 8, padR = 8
  const slot = (W - padL - padR) / 5, bw = Math.min(72, slot * 0.56)
  const y = (v: number) => padT + (H - padT - padB) * (1 - v)

  const sample = () => {
    const next: number[] = []
    for (let i = 0; i < 20; i++) next.push(pick(s))
    setPicks(next)
  }

  return (
    <div className="border border-border bg-background">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-border px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-[.18em]" style={{ color: INK }}>Try it · temperature</p>
        <p className="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">Same list as Figure 3.1 · illustrative</p>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <label htmlFor="temp-slider" className="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">
            Temperature <span className="ml-2 font-display text-2xl normal-case tracking-normal text-foreground">{temp.toFixed(1)}</span>
          </label>
          <input id="temp-slider" type="range" min={0} max={2} step={0.1} value={temp}
            onChange={(e) => { setTemp(Number(e.target.value)); setPicks([]) }}
            className="h-1 min-w-[180px] flex-1 cursor-pointer appearance-none bg-border accent-[var(--figure-accent)]"
            style={{ accentColor: ACC }} />
          <div className="flex gap-1">
            {PRESETS.map((p) => (
              <button key={p} type="button" onClick={() => { setTemp(p); setPicks([]) }}
                className={`border px-2 py-1 font-mono text-[10px] transition-colors hover:border-foreground ${Math.abs(temp - p) < 0.05 ? "border-foreground text-foreground" : "border-border text-muted-foreground"}`}>
                {p}
              </button>
            ))}
          </div>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="mt-4 block" style={{ height: "auto" }} fill="none" role="img"
          aria-label={`Share of picks at temperature ${temp.toFixed(1)}: ${LABELS.map((l, i) => `${l} ${(s[i] * 100).toFixed(0)}%`).join(", ")}`}>
          <line x1={padL} x2={W - padR} y1={H - padB} y2={H - padB} stroke="var(--border)" strokeWidth={1.5} />
          {s.map((v, i) => {
            const cx = padL + slot * i + slot / 2, top = y(v), h = H - padB - top
            const accent = i === 0
            return (
              <g key={i}>
                <rect x={cx - bw / 2} y={top} width={bw} height={Math.max(h, 0)} rx={2}
                  fill={accent ? ACC : "var(--muted-foreground)"} opacity={accent ? 1 : 0.35}
                  style={{ transition: "y .35s cubic-bezier(.22,1,.36,1), height .35s cubic-bezier(.22,1,.36,1)" }} />
                <text x={cx} y={top - 8} textAnchor="middle"
                  style={{ fontFamily: "var(--font-mono), ui-monospace, monospace", fontSize: 11, fill: accent ? INK : "var(--muted-foreground)", letterSpacing: ".06em", transition: "y .35s" }}>
                  {v < 0.005 && v > 0 ? "<1%" : `${Math.round(v * 100)}%`}
                </text>
                <text x={cx} y={H - padB + 20} textAnchor="middle"
                  style={{ fontFamily: "var(--font-mono), ui-monospace, monospace", fontSize: 11, fill: "var(--muted-foreground)", letterSpacing: ".06em" }}>
                  {LABELS[i]}
                </text>
              </g>
            )
          })}
        </svg>
        <p className="mt-1 text-[12px] italic text-muted-foreground">{describe(temp)}</p>

        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4">
          <button type="button" onClick={sample} className="inline-flex bg-primary px-3 py-2 font-mono text-[10px] uppercase tracking-[.14em] text-primary-foreground">
            Pick 20 times
          </button>
          <div className="flex min-h-[28px] flex-1 flex-wrap gap-1.5" aria-live="polite">
            {picks.length === 0
              ? <span className="self-center font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">Each press samples the next token twenty times from this list</span>
              : picks.map((i, k) => (
                <span key={k} className="border px-1.5 py-0.5 font-mono text-[11px]"
                  style={i === 0 ? { borderColor: ACC, color: INK } : i === 4 ? { borderColor: "var(--border)", color: "var(--muted-foreground)", borderStyle: "dashed" } : { borderColor: "var(--border)" }}>
                  {i === 4 ? TAIL_WORDS[(k * 7 + Math.floor(temp * 10)) % TAIL_WORDS.length] : LABELS[i]}
                </span>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
