"use client"

import Link from "next/link"
import { createContext, useContext, useEffect, useRef, useState } from "react"
import { courseModules } from "./course-data"
import { BRAND } from "@/lib/brand"

// Re-exported so older imports keep working; the data lives in course-data.ts.
export { courseModules }

// The book's one accent. Rules and marks use ACC; small text on paper uses INK.
const ACC = "var(--figure-accent)"
const INK = "var(--figure-accent-ink)"

const FrameContext = createContext<{ module: number; lesson: number; total: number }>({ module: 0, lesson: 0, total: 0 })

export function ReadingFrame({ children, lesson = 0, module = 0, title = "What is an LLM?" }: { children: React.ReactNode, lesson?: number, module?: number, title?: string }) {
  const [saved, setSaved] = useState(false); const [drawer, setDrawer] = useState(false);
  const mainRef = useRef<HTMLElement>(null)
  const total = module > 0 ? courseModules[module - 1]?.sections.length ?? 0 : 0
  useEffect(() => { setSaved(Boolean(localStorage.getItem("optimus-place"))); }, [])
  // The forward link at the foot of every section is authored inside each module file.
  // Tint it here so the whole book gets the accent without touching those files.
  useEffect(() => {
    const main = mainRef.current; if (!main) return
    main.querySelectorAll("a").forEach((a) => { const t = (a.textContent ?? "").trim(); if (/^(next\b.*|module \d+|back to module)\s*→$/i.test(t)) a.classList.add("accent-ink") })
  }, [module, lesson])
  const inBook = module > 0 && lesson > 0
  return <FrameContext.Provider value={{ module, lesson, total }}><div className="min-h-screen bg-background text-foreground noise-overlay"><header className="sticky top-0 z-30 border-b border-border/70 bg-background/90 px-5 py-4 backdrop-blur-md md:px-8"><div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 text-xs"><Link href="/" className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.14em]">{BRAND}</Link><nav className="hidden items-center gap-6 text-muted-foreground md:flex"><Link href="/">Contents</Link><Link href="/orientation">Orientation</Link><Link href="/about">About</Link></nav><div className="flex items-center gap-4 text-muted-foreground">{inBook && <button onClick={() => setDrawer(!drawer)} aria-expanded={drawer} aria-controls="course-rail" className="font-mono text-[10px] uppercase tracking-[.16em] md:hidden">{drawer ? "Close" : "Contents"}</button>}<button className="hidden sm:inline" onClick={() => { localStorage.setItem("optimus-place", title); setSaved(true) }}>Save your place</button>{inBook && <span className="hidden font-mono text-[10px] md:inline">Lesson {lesson} of {total} · Module {module}</span>}</div></div></header><div className={`mx-auto grid max-w-[1440px] grid-cols-1 gap-8 px-5 py-8 md:px-8 ${inBook ? "md:grid-cols-[220px_minmax(0,860px)] lg:grid-cols-[260px_minmax(0,860px)] lg:gap-16" : ""}`}>{inBook && <aside id="course-rail" className={`${drawer ? "block" : "hidden"} md:block`}><div className="sticky top-24"><Link href="/" className="mb-4 block font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground hover:text-foreground">All modules</Link><div className="border-l border-border pl-4">{courseModules.map((item, i) => { const current = i === module - 1; return <div className="relative mb-5" key={item.title}>{current && <span aria-hidden className="absolute -left-[17px] top-[5px] h-3 w-[2px]" style={{ background: ACC }} />}<Link href={`/m/${i + 1}`} className={`block text-sm ${current ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}><span>Module {String(i + 1).padStart(2, "0")} — {item.title}</span></Link>{current && <div className="mt-2 space-y-1.5 pl-6">{item.sections.map((name, j) => { const on = j === lesson - 1; return <Link key={name} onClick={() => setDrawer(false)} href={`/m/${module}/s/${j + 1}`} className={`grid grid-cols-[10px_1fr] items-start gap-2 text-xs leading-5 ${on ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"}`}><span aria-hidden className="mt-[7px] inline-block h-[6px] w-[6px] rounded-full border" style={on ? { background: ACC, borderColor: ACC } : { borderColor: "var(--border)" }} /><span>{j + 1}. {name}</span></Link> })}</div>}</div> })}</div></div></aside>}<main ref={mainRef} className="min-w-0">{children}<footer className="mt-24 flex flex-wrap items-center gap-x-1 gap-y-2 border-t border-border pt-6 pb-10 font-mono text-[10px] text-muted-foreground"><span>{BRAND}</span><span className="mx-2">·</span><Link href="/orientation">Orientation</Link><span className="mx-2">·</span><Link href="/">Contents</Link><span className="mx-2">·</span><Link href="/graphics">Graphics</Link><span className="mx-2">·</span>© 2026 {BRAND}</footer></main></div>{saved && <div className="fixed bottom-5 right-5 z-40 border border-border bg-card px-4 py-3 text-xs shadow-sm">Your place is saved on this device.</div>}</div></FrameContext.Provider>
}
export function Figure({ caption, children, library = "" }: { caption: string, children?: React.ReactNode, library?: string }) { return <figure className="my-10 border border-border bg-secondary/30 p-4"><div className="flex min-h-52 flex-col justify-center overflow-hidden">{children ?? <div className="flex h-52 items-center justify-center font-mono text-xs text-muted-foreground">{caption}</div>}</div>{library && <div className="mt-3 font-mono text-[10px] text-muted-foreground">LIBRARY — {library}</div>}<figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">{caption}</figcaption></figure>}

// Labels that are always set in the accent: the one line a block exists to deliver.
const ACCENT_LABELS = new Set(["key idea", "the point", "why this matters"])
/** A tracked mono label. String children are stamped as `data-eyebrow="<slug>"` so a parent block can be styled by what it is labelled. */
export function Eyebrow({ children, accent }: { children: React.ReactNode, accent?: boolean }) {
  const text = typeof children === "string" ? children : undefined
  const slug = text ? text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : undefined
  const blue = accent ?? (text ? ACCENT_LABELS.has(text.toLowerCase()) : false)
  return <p data-eyebrow={slug} className="font-mono text-[10px] uppercase tracking-[.18em]" style={{ color: blue ? INK : "var(--muted-foreground)" }}>{children}</p>
}

/** N hairline segments; the ones already read are blue. Position set as type, not a widget. */
export function ProgressRail({ current, total }: { current: number, total: number }) {
  if (!(total > 0)) return null
  return <div aria-hidden className="mt-3 flex max-w-[260px] gap-[3px]">{Array.from({ length: total }, (_, i) => <span key={i} className="h-px flex-1" style={{ background: i < current ? ACC : "var(--border)" }} />)}</div>
}

/** Section header. Inside a module, the eyebrow row opens with the module's mark in blue. */
export function LessonHeader({ eyebrow, children, meta }: { eyebrow: string, children: React.ReactNode, meta: string }) {
  const ctx = useContext(FrameContext)
  const m = /section\s+(\d+)\s+of\s+(\d+)/i.exec(eyebrow)
  const current = m ? Number(m[1]) : ctx.lesson; const total = m ? Number(m[2]) : ctx.total
  return <header className="border-b border-border pb-8"><div className="flex items-center gap-2.5"><Eyebrow>{eyebrow}</Eyebrow></div><ProgressRail current={current} total={total} /><h1 className="mt-4 text-balance font-display text-5xl leading-[.98] tracking-tight md:text-6xl">{children}</h1><p className="mt-5 font-mono text-xs text-muted-foreground">{meta}</p></header>
}
export function Prose({ children }: { children: React.ReactNode }) { return <div className="prose prose-neutral max-w-none text-[15px] leading-7 text-muted-foreground">{children}</div> }
export function ProjectBlocks({ project }: { project: string }) { return <><section className="mt-8 border border-border p-5"><Eyebrow>What you'll build</Eyebrow><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground"><li>A small working system around the module's core idea.</li><li>A traceable interface you can inspect and change.</li><li>A useful artifact you can show to someone else.</li></ul></section><p className="mt-6 text-sm leading-6 text-muted-foreground"><span className="font-mono text-[10px] uppercase tracking-[.16em]">What you'll have at the end — </span>{project}</p></>}
export function Check({ children }: { children: React.ReactNode }) { return <section className="mt-12 border border-border p-5"><Eyebrow>Check</Eyebrow><div className="mt-3 text-sm leading-6">{children}</div></section> }

/* Accent blocks a section can adopt directly (the CSS bridge above covers the older markup). */
/** The one-sentence summary under the header: hairline box, 2px blue rule on the left. */
export function OneLine({ children }: { children: React.ReactNode }) { return <div className="mt-10 border border-border px-4 py-3" style={{ borderLeft: `2px solid ${ACC}` }}><Eyebrow>In one line</Eyebrow><p className="mt-2 text-lg leading-7">{children}</p></div> }
/** The idea to carry forward: label in blue ink, body in the normal face. */
export function KeyIdea({ children }: { children: React.ReactNode }) { return <aside className="mt-10 border border-border p-5"><Eyebrow>Key idea</Eyebrow><p className="mt-2 text-sm leading-6">{children}</p></aside> }
/** Previous / Next row. The forward link is the page's one blue word. */
/** Resolve "/m/3/s/5" or "/m/4" to a human label, so a pager never says just "Previous". */
function destinationLabel(href: string): string | null {
  const m = /^\/m\/(\d+)(?:\/s\/(\d+))?\/?$/.exec(href)
  if (!m) return null
  const mod = Number(m[1]); const sec = m[2] ? Number(m[2]) : 0
  const item = courseModules[mod - 1]; if (!item) return null
  if (!sec) return `Module ${String(mod).padStart(2, "0")} — ${item.title}`
  const name = item.sections[sec - 1]
  return name ? `${String(sec).padStart(2, "0")} · ${name}` : null
}

export function PrevNext({ prev, next, nextLabel }: { prev: string, next: string, nextLabel?: string }) {
  const clean = (t: string) => t.replace(/^next:\s*/i, "").replace(/\s*→\s*$/, "").trim()
  const pLabel = destinationLabel(prev)
  const nLabel = nextLabel ? clean(nextLabel) : destinationLabel(next)
  return <nav className="mt-12 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
    <Link href={prev} className="group min-w-0">
      <span className="block font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">← Previous</span>
      <span className="mt-1 block truncate text-sm text-muted-foreground group-hover:text-foreground">{pLabel ?? "Back"}</span>
    </Link>
    <Link href={next} className="group min-w-0 sm:text-right">
      <span className="block font-mono text-[10px] uppercase tracking-[.16em]" style={{ color: INK }}>Next →</span>
      <span className="mt-1 block truncate text-sm text-foreground">{nLabel ?? "Continue"}</span>
    </Link>
  </nav>
}
export function GateSheet() { return null }
