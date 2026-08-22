"use client"

import Link from "next/link"
import { createContext, useContext, useEffect, useState } from "react"
import { courseModules } from "./course-data"

export { courseModules }

const ACC = "var(--figure-accent)"
const INK = "var(--figure-accent-ink)"
const FrameContext = createContext<{ module: number; lesson: number; total: number }>({ module: 0, lesson: 0, total: 0 })

function CourseMenu({ module, lesson, close }: { module: number; lesson: number; close?: () => void }) {
  const item = courseModules[module - 1]
  if (!item) return null
  const previous = courseModules[module - 2]
  const next = courseModules[module]
  return <nav aria-label="Course navigation" className="flex flex-col gap-7">
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground">Module {String(module).padStart(2, "0")}</p>
      <Link onClick={close} href={`/m/${module}`} className="mt-2 block text-base font-medium leading-6">{item.title}</Link>
      {lesson > 0 && <ProgressRail current={lesson} total={item.sections.length} />}
    </div>
    <div className="border-t border-border">
      {item.sections.map((section, index) => {
        const number = index + 1
        const active = lesson === number
        return <Link key={section} onClick={close} href={`/m/${module}/s/${number}`} aria-current={active ? "page" : undefined} className={`grid grid-cols-[28px_1fr] gap-2 border-b border-border py-3 text-sm leading-5 ${active ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`} style={active ? { boxShadow: `inset 2px 0 0 ${ACC}`, paddingLeft: 10 } : undefined}>
          <span className="font-mono text-[10px]" style={{ color: active ? INK : undefined }}>{String(number).padStart(2, "0")}</span><span>{section}</span>
        </Link>
      })}
    </div>
    <div className="flex flex-col gap-3 font-mono text-[10px] uppercase tracking-[.12em]">
      <Link onClick={close} href="/">All modules</Link>
      {previous && <Link onClick={close} href={`/m/${module - 1}`} className="text-muted-foreground">← {String(module - 1).padStart(2, "0")} {previous.title}</Link>}
      {next && <Link onClick={close} href={`/m/${module + 1}`} className="text-muted-foreground">{String(module + 1).padStart(2, "0")} {next.title} →</Link>}
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-4 text-muted-foreground"><Link onClick={close} href="/orientation">Orientation</Link><Link onClick={close} href="/preface">Preface</Link><Link onClick={close} href="/about">About</Link></div>
    </div>
  </nav>
}

export function ReadingFrame({ children, lesson = 0, module = 0, title = "What is an LLM?" }: { children: React.ReactNode; lesson?: number; module?: number; title?: string }) {
  const [saved, setSaved] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const total = module > 0 ? courseModules[module - 1]?.sections.length ?? 0 : 0
  const inLesson = module > 0 && lesson > 0
  useEffect(() => { setSaved(Boolean(localStorage.getItem("optimus-place"))) }, [])
  useEffect(() => { setDrawer(false) }, [module, lesson])
  useEffect(() => {
    if (!drawer) return
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setDrawer(false) }
    document.addEventListener("keydown", close)
    return () => document.removeEventListener("keydown", close)
  }, [drawer])

  const location = module > 0 ? `Module ${String(module).padStart(2, "0")}${lesson > 0 ? ` / ${String(lesson).padStart(2, "0")}` : ""}` : "Course"
  return <FrameContext.Provider value={{ module, lesson, total }}><div className="min-h-screen bg-background text-foreground noise-overlay">
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/90 px-5 py-3 backdrop-blur-md md:px-8">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 text-xs">
        <div className="flex min-w-0 items-center gap-3"><Link href="/" className="shrink-0 font-mono tracking-[.18em]">COURSE</Link><span aria-hidden className="text-border">/</span><span className="truncate font-mono text-[10px] uppercase tracking-[.12em] text-muted-foreground">{location} · {title}</span></div>
        <div className="flex shrink-0 items-center gap-4">
          <button type="button" onClick={() => { localStorage.setItem("optimus-place", title); setSaved(true) }} className="hidden text-muted-foreground hover:text-foreground sm:block">{saved ? "Place saved" : "Save place"}</button>
          {module > 0 && <button type="button" onClick={() => setDrawer(true)} aria-expanded={drawer} aria-controls="course-menu" className="border border-border px-3 py-2 font-mono text-[10px] uppercase tracking-[.14em] md:hidden">Course menu</button>}
        </div>
      </div>
    </header>

    {drawer && <div className="fixed inset-0 z-50 md:hidden"><button aria-label="Close course menu" className="absolute inset-0 bg-foreground/20" onClick={() => setDrawer(false)} /><aside id="course-menu" role="dialog" aria-modal="true" aria-label="Course menu" className="absolute inset-y-0 right-0 w-[min(88vw,360px)] overflow-y-auto border-l border-border bg-background p-5 shadow-xl"><div className="mb-7 flex items-center justify-between"><span className="font-mono text-[10px] uppercase tracking-[.18em]">Course menu</span><button type="button" onClick={() => setDrawer(false)} className="border border-border px-3 py-2 text-xs">Close</button></div><CourseMenu module={module} lesson={lesson} close={() => setDrawer(false)} /></aside></div>}

    <div className={`mx-auto grid max-w-[1440px] grid-cols-1 gap-8 px-5 py-8 md:px-8 ${inLesson ? "md:grid-cols-[220px_minmax(0,860px)] lg:grid-cols-[260px_minmax(0,860px)] lg:gap-16" : ""}`}>
      {inLesson && <aside className="hidden md:block"><div className="sticky top-24"><CourseMenu module={module} lesson={lesson} /></div></aside>}
      <main className="min-w-0" id="lesson-content">{children}</main>
    </div>
  </div></FrameContext.Provider>
}

export function LessonPager({ module, lesson }: { module: number; lesson: number }) {
  const item = courseModules[module - 1]
  if (!item) return null
  const previous = lesson > 1 ? { href: `/m/${module}/s/${lesson - 1}`, label: item.sections[lesson - 2] } : { href: `/m/${module}`, label: `${item.title} overview` }
  const next = lesson < item.sections.length ? { href: `/m/${module}/s/${lesson + 1}`, label: item.sections[lesson] } : courseModules[module] ? { href: `/m/${module + 1}`, label: `Module ${String(module + 1).padStart(2, "0")}: ${courseModules[module].title}` } : { href: "/", label: "Course complete · All modules" }
  return <nav aria-label="Lesson navigation" className="mt-12 grid gap-px border border-border bg-border sm:grid-cols-2"><Link href={previous.href} className="bg-background p-4"><span className="block font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">Previous</span><span className="mt-2 block text-sm">← {previous.label}</span></Link><Link href={next.href} className="bg-background p-4 sm:text-right"><span className="block font-mono text-[10px] uppercase tracking-[.14em]" style={{ color: INK }}>Next</span><span className="mt-2 block text-sm">{next.label} →</span></Link></nav>
}

export function Figure({ caption, children, library = "" }: { caption: string; children?: React.ReactNode; library?: string }) { return <figure className="my-10 border border-border bg-secondary/30 p-4"><div className="flex min-h-52 flex-col justify-center overflow-hidden">{children ?? <div className="flex h-52 items-center justify-center font-mono text-xs text-muted-foreground">{caption}</div>}</div>{library && <div className="mt-3 font-mono text-[10px] text-muted-foreground">LIBRARY — {library}</div>}<figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">{caption}</figcaption></figure> }
const ACCENT_LABELS = new Set(["key idea", "the point", "why this matters"])
export function Eyebrow({ children, accent }: { children: React.ReactNode; accent?: boolean }) { const text = typeof children === "string" ? children : undefined; const slug = text ? text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : undefined; const blue = accent ?? (text ? ACCENT_LABELS.has(text.toLowerCase()) : false); return <p data-eyebrow={slug} className="font-mono text-[10px] uppercase tracking-[.18em]" style={{ color: blue ? INK : "var(--muted-foreground)" }}>{children}</p> }
export function ProgressRail({ current, total }: { current: number; total: number }) { if (!(total > 0)) return null; return <div aria-label={`Lesson ${current} of ${total}`} className="mt-3 flex max-w-[260px] gap-[3px]">{Array.from({ length: total }, (_, i) => <span key={i} className="h-px flex-1" style={{ background: i < current ? ACC : "var(--border)" }} />)}</div> }
export function LessonHeader({ eyebrow, children, meta }: { eyebrow: string; children: React.ReactNode; meta: string }) { const ctx = useContext(FrameContext); const m = /section\s+(\d+)\s+of\s+(\d+)/i.exec(eyebrow); const current = m ? Number(m[1]) : ctx.lesson; const total = m ? Number(m[2]) : ctx.total; return <header className="border-b border-border pb-8"><Eyebrow>{eyebrow}</Eyebrow><ProgressRail current={current} total={total} /><h1 className="mt-4 text-balance font-display text-5xl leading-[.98] tracking-tight md:text-6xl">{children}</h1><p className="mt-5 font-mono text-xs text-muted-foreground">{meta}</p></header> }
export function Prose({ children }: { children: React.ReactNode }) { return <div className="prose prose-neutral max-w-none text-[15px] leading-7 text-muted-foreground">{children}</div> }
export function ProjectBlocks({ project }: { project: string }) { return <><section className="mt-8 border border-border p-5"><Eyebrow>What you&apos;ll build</Eyebrow><ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-sm leading-6 text-muted-foreground"><li>A small working system around the module&apos;s core idea.</li><li>A traceable interface you can inspect and change.</li><li>A useful artifact you can show to someone else.</li></ul></section><p className="mt-6 text-sm leading-6 text-muted-foreground"><span className="font-mono text-[10px] uppercase tracking-[.16em]">What you&apos;ll have at the end — </span>{project}</p></> }
export function Check({ children }: { children: React.ReactNode }) { return <section className="mt-12 border border-border p-5"><Eyebrow>Check</Eyebrow><div className="mt-3 text-sm leading-6">{children}</div></section> }
export function OneLine({ children }: { children: React.ReactNode }) { return <div className="mt-10 border border-border px-4 py-3" style={{ borderLeft: `2px solid ${ACC}` }}><Eyebrow>In one line</Eyebrow><p className="mt-2 text-lg leading-7">{children}</p></div> }
export function KeyIdea({ children }: { children: React.ReactNode }) { return <aside className="mt-10 border border-border p-5"><Eyebrow>Key idea</Eyebrow><p className="mt-2 text-sm leading-6">{children}</p></aside> }
export function PrevNext({ prev, next, nextLabel = "Next →" }: { prev: string; next: string; nextLabel?: string }) { return <div className="mt-12 flex items-center justify-between border-t border-border pt-6 font-mono text-[10px]"><Link href={prev}>← Previous</Link><Link href={next} style={{ color: INK }}>{nextLabel}</Link></div> }
export function GateSheet() { return null }
