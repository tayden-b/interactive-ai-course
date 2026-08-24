"use client"

import { useEffect, useRef, useState } from "react"

// What happens after you paste the one line into your own coding agent, typed out once.
// Labelled DEMO in the eyebrow; the timings are illustrative. Starts when it scrolls into
// view, runs once, and renders the finished state immediately for reduced motion.
const LINES = [
  "▸ agent reads setup.md      0.4s",
  "▸ course cloned locally     1.2s",
  "▸ tutor ready · module 1    0.3s",
  "▸ your agent makes a call   0.9s",
  "✓ trace received · now on this page",
]
const CHAR_MS = 40
const LINE_GAP_MS = 500

export function TracedRun() {
  const ref = useRef<HTMLDivElement>(null)
  const [typed, setTyped] = useState<number[]>(() => LINES.map(() => 0))
  const [done, setDone] = useState(false)
  const [active, setActive] = useState(-1)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(LINES.map((l) => l.length)); setDone(true); return
    }
    let timer = 0
    let started = false
    // FALLBACK: if the observer never fires, type anyway rather than showing an empty box.
    const fallback = window.setTimeout(() => run(), 1200)
    const run = () => {
      if (started) return; started = true
      let line = 0, ch = 0
      setActive(0)
      const step = () => {
        if (line >= LINES.length) { setDone(true); setActive(-1); return }
        ch += 1
        setTyped((t) => { const n = t.slice(); n[line] = ch; return n })
        if (ch >= LINES[line].length) {
          line += 1; ch = 0; setActive(line < LINES.length ? line : -1)
          timer = window.setTimeout(step, LINE_GAP_MS)
        } else {
          timer = window.setTimeout(step, CHAR_MS)
        }
      }
      timer = window.setTimeout(step, 300)
    }
    if (typeof IntersectionObserver === "undefined") { run(); return () => window.clearTimeout(timer) }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); run() } }, { rootMargin: "0px 0px -20% 0px" })
    io.observe(el)
    return () => { window.clearTimeout(fallback); io.disconnect(); window.clearTimeout(timer) }
  }, [])

  const last = LINES.length - 1
  return (
    <div ref={ref} className="border border-border bg-card p-5 md:p-6">
      <p className="font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground">Your agent, setting up · <span className="text-foreground">Demo</span></p>
      <pre className="mt-4 overflow-x-auto font-mono text-[13px] leading-7 text-foreground md:text-sm" aria-label={LINES.join("\n")}>
        {LINES.map((l, i) => {
          const text = l.slice(0, typed[i])
          const isLast = i === last
          return <span key={i} className="block whitespace-pre" style={isLast ? { color: "var(--figure-accent-ink)" } : undefined}>{text || " "}{!done && active === i && <span aria-hidden className="inline-block h-[1em] w-[.55em] translate-y-[.15em]" style={{ background: isLast ? "var(--figure-accent)" : "var(--foreground)" }} />}</span>
        })}
      </pre>
    </div>
  )
}
