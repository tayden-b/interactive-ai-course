import Link from "next/link"
import { AnimatedSphere } from "@/components/landing/animated-sphere"
import { TracedRun } from "@/components/landing/traced-run"
import { ReadingFrame, Eyebrow } from "@/components/book/reading-frame"
import { courseModules } from "@/components/book/course-data"
import { Fig01, Fig07 } from "@/components/figures/course-figures"
import { LabPrompt } from "@/components/lab/lab-prompt"

/** The hero particle globe. Flip to true to bring it back. */
const SHOW_SPHERE = false

const ACC = "var(--figure-accent)"
const INK = "var(--figure-accent-ink)"

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
    {/* Hero: the book's name sits in the header, so the H1 is the promise. Right column is the
        traced run — or the particle globe, when SHOW_SPHERE is turned back on. */}
    <section className="grid items-center gap-10 border-b border-border py-14 md:grid-cols-[1fr_minmax(0,520px)] md:py-20">
      <div className="dot-ground dot-ground--faint -mx-5 px-5 py-8 md:-mx-8 md:px-8">
        <Eyebrow>An interactive book</Eyebrow>
        <h1 className="mt-5 text-balance font-display text-5xl leading-[.98] tracking-tight md:text-6xl lg:text-7xl">Your guide to <span style={{ color: ACC }}>LLMs and agents</span></h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">Eight modules you read right here, with a diagram for every idea. Each one ends in a hands-on project you build on your own machine, with the coding agent you already use as your tutor.</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/m/1" className="inline-flex bg-primary px-5 py-3 text-sm text-primary-foreground">Start reading Module 1</Link>
          <a href="#how-it-works" className="inline-flex border border-border px-5 py-3 text-sm">How it works</a>
        </div>
      </div>
      {SHOW_SPHERE
        ? <div className="relative -mx-5 h-[520px] overflow-visible md:-mx-16 md:h-[700px]"><AnimatedSphere /></div>
        : <TracedRun />}
    </section>

    <section id="how-it-works" className="scroll-mt-20 border-b border-border py-12">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-14">
        <div>
          <Eyebrow>How it works</Eyebrow>
          <h2 className="mt-4 text-balance font-display text-3xl leading-tight md:text-4xl">Read it here, build it there</h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">The reading lives on this site. The projects live on your machine, and nothing you write is ever uploaded.</p>
        </div>

        <div>
          <ol className="grid gap-6 sm:grid-cols-3">
            {[
              { n: "01", t: "Read the module", d: "Sections, diagrams, and a check as you go. All of it here, in the browser." },
              { n: "02", t: "Reach the project", d: "Every module ends in one. Paste the line below into your coding agent." },
              { n: "03", t: "Build it locally", d: "Your agent sets up a folder on your machine and teaches you through it, hinting instead of solving." },
            ].map((s2) => (
              <li key={s2.n}>
                <span className="font-mono text-[10px] tracking-[.18em]" style={{ color: INK }}>{s2.n}</span>
                <h3 className="mt-1.5 font-display text-lg leading-tight">{s2.t}</h3>
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{s2.d}</p>
              </li>
            ))}
          </ol>

          <div className="mt-8">
            <LabPrompt module={1} eyebrow="The line you paste when you reach a project" />
          </div>
        </div>
      </div>
    </section>

    {/* The modules, as a bento: 01 a double with its figure beside the text, 08 a 2x2 with the Deep Research Agent inside. */}
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

    <section className="border-b border-border py-12">
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <Eyebrow>Before Module 01</Eyebrow>
          <h2 className="mt-4 max-w-2xl text-balance font-display text-3xl leading-tight md:text-4xl">Start with the orientation</h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">Covers the foundations: what AI, machine learning, LLMs, agents, workflows, and orchestration each mean, and where each one sits in the space.</p>
        </div>
        <Link href="/orientation" className="inline-flex border border-border px-5 py-3 text-sm">Open orientation →</Link>
      </div>
    </section>
  </main></ReadingFrame>
}
