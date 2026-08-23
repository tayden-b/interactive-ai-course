import Link from "next/link"
import { AnimatedSphere } from "@/components/landing/animated-sphere"
import { TracedRun } from "@/components/landing/traced-run"
import { ReadingFrame, Eyebrow } from "@/components/book/reading-frame"
import { courseModules, courseTotals } from "@/components/book/course-data"
import { Fig01, Fig04, Fig07 } from "@/components/figures/course-figures"

/** The hero particle globe. Flip to true to bring it back. */
const SHOW_SPHERE = false

const ACC = "var(--figure-accent)"
const INK = "var(--figure-accent-ink)"

const previews = [
  { Fig: Fig01, n: "01", title: "Text in, text out", where: "Module 1 · Section 4" },
  { Fig: Fig04, n: "04", title: "The agent loop", where: "Module 3 · Section 4" },
  { Fig: Fig07, n: "07", title: "Many loops — the Desk", where: "Module 8 · Section 1" },
]

/** The text a module card carries: mark, numeral, title, blurb, what you build, open. */
function CardBody({ index, title, description, build }: { index: number; title: string; description: string; build: string }) {
  return <>
    <span className="mt-5 block font-mono text-[10px]" style={{ color: INK }}>{String(index).padStart(2, "0")}</span>
    <h2 className="mt-2 font-display text-2xl leading-tight md:text-[26px]">{title}</h2>
    <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
    <p className="mt-4 font-mono text-[10px] uppercase tracking-[.12em] text-muted-foreground">You build — <span className="text-foreground">{build}</span></p>
    <span className="mt-5 block font-mono text-[10px] uppercase tracking-[.16em]" style={{ color: INK }}>Open</span>
  </>
}

export default function Home() {
  return <ReadingFrame><main>
    {/* Hero: the text column on a faint dot ground; the particle globe rides SHOW_SPHERE. */}
    <section className={SHOW_SPHERE
      ? "grid min-h-[min(calc(100vh-90px),820px)] items-center gap-10 border-b border-border py-14 md:grid-cols-2 md:py-20"
      : "border-b border-border py-16 md:py-24"}>
      <div className="dot-ground dot-ground--faint -mx-5 px-5 py-8 md:-mx-8 md:px-8">
        <Eyebrow>An interactive book</Eyebrow>
        <h1 className="mt-5 text-balance font-display text-6xl leading-[.95] tracking-tight md:text-7xl lg:text-8xl">The Model and the <span style={{ color: ACC }}>Loop</span></h1>
        <p className="mt-6 max-w-xl font-display text-2xl leading-snug md:text-3xl">Your guide to LLMs and agents.</p>
        <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">Eight modules. Each one explains a building block in plain language, with a diagram for every idea, and ends with something you build.</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/orientation" className="inline-flex bg-primary px-5 py-3 text-sm text-primary-foreground">Read the orientation</Link>
          <Link href="/m/1" className="inline-flex border border-border px-5 py-3 text-sm">Go straight to Module 1</Link>
        </div>
        <p className="mt-10 font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground">Works with any coding agent — <span className="text-foreground">Claude Code · Cursor · Codex CLI · Gemini CLI</span></p>
      </div>
      {SHOW_SPHERE && <div className="relative -mx-5 h-[520px] overflow-visible md:-mx-16 md:h-[700px]"><AnimatedSphere /></div>}
    </section>

    <section className="border-b border-border py-12">
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <Eyebrow>New to the field?</Eyebrow>
          <h2 className="mt-4 max-w-2xl text-balance font-display text-3xl leading-tight md:text-4xl">Start with the map, not the jargon.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">The orientation separates AI, machine learning, language models, agents, workflows, and orchestration before the numbered course begins. It uses the original IBM Carbon diagrams from the field guide.</p>
        </div>
        <Link href="/orientation" className="inline-flex border border-border px-5 py-3 text-sm">Open orientation →</Link>
      </div>
    </section>

    {/* What a run looks like when it's traced: the thing the capstone ends in, typed out once. */}
    <section className="border-b border-border py-16">
      <div className="grid gap-8 md:grid-cols-[1fr_minmax(0,560px)] md:items-center">
        <div><Eyebrow>Where it ends</Eyebrow><p className="mt-4 max-w-md font-display text-3xl leading-tight md:text-4xl">By the last module, every run you make is a trace you can read.</p><p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">A plan, three researchers in parallel, a checker, a writer — and a span for each, with the time it took. That's the Desk, and it's where the book is going.</p></div>
        <TracedRun />
      </div>
    </section>

    {/* The modules, as a bento: 01 a double with its figure beside the text, 08 a 2×2 with the Desk inside. */}
    <section className="border-b border-border py-16"><Eyebrow>The modules</Eyebrow>
      <div className="mt-6 grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {courseModules.map((item, i) => {
          const n = i + 1
          const base = "bg-background p-5 transition-colors hover:bg-secondary"
          if (n === 1) return <Link key={item.title} href="/m/1" className={`${base} sm:col-span-2 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-center md:gap-6`}>
            <div><CardBody index={n} title={item.title} description={item.description} build={item.build} /></div>
            <div className="mt-6 md:mt-0"><Fig01 /></div>
          </Link>
          if (n === 8) return <Link key={item.title} href="/m/8" className={`${base} flex flex-col sm:col-span-2 lg:col-start-3 lg:row-start-2 lg:row-span-2`}>
            <div className="mb-6 flex flex-1 items-center"><div className="w-full"><Fig07 /></div></div>
            <div><CardBody index={n} title={item.title} description={item.description} build={item.build} /></div>
          </Link>
          return <Link key={item.title} href={`/m/${n}`} className={`${base} min-h-64`}><CardBody index={n} title={item.title} description={item.description} build={item.build} /></Link>
        })}
      </div>
    </section>

    {/* Three of the figures, at a third of their size, in the frame the book uses. */}
    <section className="border-b border-border py-16">
      <div className="flex flex-wrap items-baseline justify-between gap-4"><Eyebrow>A diagram for every idea</Eyebrow><p className="font-mono text-[10px] text-muted-foreground">{courseTotals.figures} figures · one geometry · <Link href="/graphics" className="underline underline-offset-4" style={{ color: INK }}>see them all →</Link></p></div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">{previews.map((p) => <figure key={p.n} className="flex flex-col border border-border bg-secondary/30 p-3"><div className="flex flex-1 items-center"><div className="w-full"><p.Fig /></div></div><figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground"><span style={{ color: INK }}>Fig. {p.n}</span> — {p.title}<span className="mt-1 block normal-case tracking-normal">{p.where}</span></figcaption></figure>)}</div>
    </section>

    <section className="py-20"><p className="max-w-4xl text-balance font-display text-4xl leading-[1.02] tracking-tight md:text-6xl">Read a section, look at its figure, build the thing. Eight times.</p><Link href="/m/1" className="mt-10 inline-flex bg-primary px-5 py-3 text-sm text-primary-foreground">Start with Module 1</Link></section>
  </main></ReadingFrame>
}
