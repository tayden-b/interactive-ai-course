"use client"

/**
 * A real tokenizer, in the page. Type anything and watch it get chopped the way the model
 * sees it. Uses the o200k_base byte-pair encoding (GPT-4o, GPT-4.1, GPT-5 family), loaded
 * only when the box is first focused so the page itself stays light.
 */

import { useEffect, useRef, useState } from "react"

const ACC = "var(--figure-accent)"
const INK = "var(--figure-accent-ink)"

type Encoder = { encode: (s: string) => number[]; decode: (t: number[]) => string }

const SAMPLES = [
  "The quick brown fox jumps over the lazy dog",
  "How many r's are in strawberry?",
  "unbelievably",
  "def add(a, b):\n    return a + b",
]

// Six quiet tints so adjacent tokens read as separate pieces without shouting.
const TINTS = [0.16, 0.08, 0.22, 0.11, 0.19, 0.06]

let loading: Promise<Encoder> | null = null
function loadEncoder(): Promise<Encoder> {
  loading ??= import("gpt-tokenizer/encoding/o200k_base").then((m) => ({ encode: m.encode, decode: m.decode }))
  return loading
}

export function TokenizerDemo() {
  const [text, setText] = useState(SAMPLES[0])
  const [enc, setEnc] = useState<Encoder | null>(null)
  const [state, setState] = useState<"idle" | "loading" | "ready" | "failed">("idle")
  const [hover, setHover] = useState<number | null>(null)
  const wanted = useRef(false)

  const load = () => {
    if (wanted.current) return
    wanted.current = true
    setState("loading")
    loadEncoder().then((e) => { setEnc(() => e); setState("ready") }, () => setState("failed"))
  }

  // Load on first intent (focus, click, or a visible idle moment after mount).
  useEffect(() => {
    const id = window.setTimeout(load, 2500)
    return () => window.clearTimeout(id)
  }, [])

  const ids = enc ? enc.encode(text) : []
  const pieces = enc ? ids.map((id) => enc.decode([id])) : []
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const chars = text.length

  return (
    <div className="border border-border bg-background">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-border px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-[.18em]" style={{ color: INK }}>Try it · live tokenizer</p>
        <p className="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">o200k_base · the encoding behind GPT-4o and GPT-5</p>
      </div>

      <div className="grid gap-px bg-border md:grid-cols-2">
        <div className="bg-background p-4">
          <label htmlFor="tokenizer-input" className="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">Your text</label>
          <textarea
            id="tokenizer-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={load}
            rows={4}
            spellCheck={false}
            className="mt-2 block w-full resize-y border border-border bg-secondary/40 p-3 font-mono text-[13px] leading-6 text-foreground outline-none focus:border-foreground"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {SAMPLES.map((s) => (
              <button key={s} type="button" onClick={() => { setText(s); load() }}
                className={`border px-2 py-1 font-mono text-[10px] transition-colors hover:border-foreground ${text === s ? "border-foreground" : "border-border text-muted-foreground"}`}>
                {s.split("\n")[0].slice(0, 28)}{s.length > 28 ? "…" : ""}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-background p-4">
          <p className="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">What the model sees</p>
          <div className="mt-2 min-h-[7.5rem] border border-border bg-secondary/40 p-3 font-mono text-[13px] leading-7" aria-live="polite">
            {state === "ready" && pieces.length > 0 && pieces.map((p, i) => (
              <span key={i}
                onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
                title={`token ${i + 1} · id ${ids[i]}`}
                className="whitespace-pre-wrap rounded-[2px] px-[1px]"
                style={{
                  background: hover === i ? ACC : `oklch(0.57 0.23 259 / ${TINTS[i % TINTS.length]})`,
                  color: hover === i ? "var(--background)" : undefined,
                  boxShadow: "inset 0 0 0 1px var(--background)",
                }}>
                {p.replace(/\n/g, "↵\n")}
              </span>
            ))}
            {state === "ready" && pieces.length === 0 && <span className="text-muted-foreground">Type something on the left.</span>}
            {state === "loading" && <span className="text-muted-foreground">Loading the tokenizer (about 1 MB, once)…</span>}
            {state === "idle" && <span className="text-muted-foreground">Click into the box to load the tokenizer.</span>}
            {state === "failed" && <span className="text-muted-foreground">The tokenizer could not load. The table above still shows the idea.</span>}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <Stat label="tokens" value={state === "ready" ? String(ids.length) : "–"} accent />
            <Stat label="words" value={String(words)} />
            <Stat label="characters" value={String(chars)} />
          </div>
          <p className="mt-3 text-[12px] leading-5 text-muted-foreground">
            {hover !== null && pieces[hover] !== undefined
              ? <>Token {hover + 1} is <span className="font-mono text-foreground">{JSON.stringify(pieces[hover])}</span>, id {ids[hover]}. The model never sees the letters inside it, only this number.</>
              : <>Hover a piece to see its id. Common words are one token; rare words split; a leading space is part of the token.</>}
          </p>
        </div>
      </div>
    </div>
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
