import Link from "next/link"
import { AnimatedSphere } from "@/components/landing/animated-sphere"
import { ReadingFrame, Eyebrow } from "@/components/book/reading-frame"
import { courseModules, courseTotals } from "@/components/book/course-data"
import { Numbers } from "@/components/figures/kit"
import { Fig01, Fig04, Fig07 } from "@/components/figures/course-figures"

const INK = "var(--figure-accent-ink)"

const previews = [
  { Fig: Fig01, n: "01", title: "Text in, text out", where: "Module 1 · Section 4" },
  { Fig: Fig04, n: "04", title: "The agent loop", where: "Module 3 · Section 4" },
  { Fig: Fig07, n: "07", title: "Many loops — the Desk", where: "Module 8 · Section 1" },
]

export default function Home() {
  return <ReadingFrame><main>
    {/* Hero: the particle globe stays. */}
    <section className="grid min-h-[min(calc(100vh-90px),820px)] items-center gap-10 border-b border-border py-14 md:grid-cols-2 md:py-20"><div><Eyebrow>A visual, hands-on guide to AI — from the model up</Eyebrow><h1 className="mt-5 max-w-xl text-balance font-display text-6xl leading-[.95] tracking-tight md:text-8xl">Understand AI by <span className="text-muted-foreground">building</span> with it</h1><p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground">Eight modules. Each one explains a building block in plain language, with a diagram for every idea, and ends with something you build.</p><Link href="/m/1" className="mt-9 inline-flex bg-primary px-5 py-3 text-sm text-primary-foreground">Start with Module 1</Link><p className="mt-10 font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground">Works with any coding agent — <span className="text-foreground">Claude Code · Cursor · Codex CLI · Gemini CLI</span></p></div><div className="relative -mx-5 h-[520px] overflow-visible md:-mx-16 md:h-[700px]"><AnimatedSphere /></div></section>

    {/* By the numbers: one row, one blue. */}
    <section className="border-b border-border py-10">
      <Numbers items={[{ value: String(courseTotals.modules), label: "modules" }, { value: String(courseTotals.sections), label: "sections" }, { value: String(courseTotals.figures), label: "figures" }, { value: String(courseTotals.capstones), label: "capstone", accent: true }]} />
    </section>

    {/* The modules: blue mono numerals, and the one thing each leaves you with. */}
    <section className="border-b border-border py-16"><Eyebrow>The modules</Eyebrow><div className="mt-6 grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">{courseModules.map((item, i) => <Link key={item.title} href={`/m/${i + 1}`} className="min-h-56 bg-background p-5 transition-colors hover:bg-secondary"><span className="font-mono text-[10px]" style={{ color: INK }}>{String(i + 1).padStart(2, "0")}</span><h2 className="mt-9 font-display text-2xl">{item.title}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p><p className="mt-4 font-mono text-[10px] uppercase tracking-[.12em] text-muted-foreground">You build — <span className="text-foreground">{item.build}</span></p><span className="mt-5 block font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">Open</span></Link>)}</div></section>

    {/* Three of the figures, at a third of their size, in the frame the book uses. */}
    <section className="border-b border-border py-16">
      <div className="flex flex-wrap items-baseline justify-between gap-4"><Eyebrow>A diagram for every idea</Eyebrow><p className="font-mono text-[10px] text-muted-foreground">{courseTotals.figures} figures · one geometry · <Link href="/graphics" className="underline underline-offset-4">see them all →</Link></p></div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">{previews.map((p) => <figure key={p.n} className="flex flex-col border border-border bg-secondary/30 p-3"><div className="flex flex-1 items-center"><div className="w-full"><p.Fig /></div></div><figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground"><span style={{ color: INK }}>Fig. {p.n}</span> — {p.title}<span className="mt-1 block normal-case tracking-normal">{p.where}</span></figcaption></figure>)}</div>
    </section>

    <section className="py-16"><p className="max-w-xl font-display text-3xl leading-tight">Read a section, look at its figure, build the thing. Eight times.</p><Link href="/m/1" className="mt-8 inline-flex bg-primary px-5 py-3 text-sm text-primary-foreground">Start with Module 1</Link></section>
  </main></ReadingFrame>
}
