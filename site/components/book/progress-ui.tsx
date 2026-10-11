"use client"

/** Small client islands that read the reader's progress, for server-rendered pages. */

import Link from "next/link"
import { courseModules } from "./course-data"
import { seenCount, sectionKey, useProgress } from "@/lib/progress"

const ACC = "var(--figure-accent)"
const INK = "var(--figure-accent-ink)"

/** Where they left off, as a sentence with a link. Renders nothing for a first visit. */
export function ContinueCta({ className = "" }: { className?: string }) {
  const p = useProgress()
  const last = p.last
  if (!last) return null
  const item = courseModules[last.module - 1]
  const name = item?.sections[last.section - 1]
  if (!item || !name) return null
  return (
    <Link href={`/m/${last.module}/s/${last.section}`} className={`group inline-flex min-w-0 items-center gap-3 border border-border px-4 py-2.5 text-sm transition-colors hover:bg-secondary ${className}`}>
      <span aria-hidden className="h-[7px] w-[7px] shrink-0 rounded-full" style={{ background: ACC }} />
      <span className="min-w-0">
        <span className="block font-mono text-[10px] uppercase tracking-[.16em]" style={{ color: INK }}>Continue where you left off</span>
        <span className="mt-0.5 block truncate text-foreground">Module {String(last.module).padStart(2, "0")} · {last.section}. {name}</span>
      </span>
    </Link>
  )
}

/** Hero buttons: a first visit sees "Start reading"; a return visit sees "Continue" first. */
export function HeroActions() {
  const p = useProgress()
  const returning = Boolean(p.last)
  return (
    <div className="mt-9 flex flex-wrap items-stretch gap-3">
      {returning && <ContinueCta />}
      <Link href="/m/1" className={`inline-flex items-center px-5 py-3 text-sm ${returning ? "border border-border" : "bg-primary text-primary-foreground"}`}>
        {returning ? "Start from Module 1" : "Start reading Module 1"}
      </Link>
      {!returning && <a href="#how-it-works" className="inline-flex items-center border border-border px-5 py-3 text-sm">How it works</a>}
    </div>
  )
}

/** "4 of 11 read" under a module card, with a hairline rail. Nothing until something is read. */
export function CardProgress({ module }: { module: number }) {
  const p = useProgress()
  const total = courseModules[module - 1]?.sections.length ?? 0
  const n = seenCount(p, module, total)
  if (!n) return null
  return (
    <span className="mt-4 block">
      <span aria-hidden className="flex max-w-[160px] gap-[3px]">{Array.from({ length: total }, (_, i) => <span key={i} className="h-px flex-1" style={{ background: p.seen[sectionKey(module, i + 1)] ? ACC : "var(--border)" }} />)}</span>
      <span className="mt-2 block font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">{n === total ? "All read" : `${n} of ${total} read`}</span>
    </span>
  )
}

/** A filled dot beside a section that has been opened. */
export function SeenMark({ module, section }: { module: number; section: number }) {
  const p = useProgress()
  const seen = Boolean(p.seen[sectionKey(module, section)])
  return <span aria-label={seen ? "Read" : undefined} className="inline-block h-[6px] w-[6px] rounded-full border" style={seen ? { background: ACC, borderColor: ACC } : { borderColor: "var(--border)" }} />
}
