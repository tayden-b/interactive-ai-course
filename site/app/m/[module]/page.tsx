import type { ComponentType } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ReadingFrame, Eyebrow } from "@/components/book/reading-frame"
import { courseModules } from "@/components/book/course-data"
import { AnimatedWave } from "@/components/landing/animated-wave"
import { Fig01, Fig03, Fig06, Fig07, Fig09, Fig13 } from "@/components/figures/course-figures"

const ACC = "var(--figure-accent)"
const INK = "var(--figure-accent-ink)"

// The first real figure of each module, shown as the module's hero. Modules 2 and 7 have none yet.
const HERO: Record<number, { Fig: ComponentType; n: string; title: string; section: number }> = {
  1: { Fig: Fig01, n: "01", title: "Text in, text out", section: 4 },
  3: { Fig: Fig03, n: "03", title: "Model, your code, tools", section: 1 },
  4: { Fig: Fig13, n: "13", title: "Folding the transcript", section: 2 },
  5: { Fig: Fig09, n: "09", title: "Ninety percent, ten times", section: 5 },
  6: { Fig: Fig06, n: "06", title: "Gates around the loop", section: 6 },
  8: { Fig: Fig07, n: "07", title: "Many loops — the Deep Research Agent", section: 1 },
}

const BRIDGES = [
  { from: "The orientation map", to: "the model itself", text: "Now that the field and the software layers are separate, start with the one component everything else calls." },
  { from: "a model call", to: "a useful program", text: "You know what the model does. Now make its output predictable enough for ordinary code to trust." },
  { from: "structured output", to: "tool use", text: "A tool call is structured output with consequences: your code receives the model's request and does the work." },
  { from: "one agent loop", to: "managed context", text: "The loop works by replaying its transcript. This module keeps that working memory useful as it grows." },
  { from: "an agent that remembers", to: "evidence", text: "Once behavior persists across runs, intuition is not enough. Define success and measure it." },
  { from: "measured behavior", to: "safe behavior", text: "Evals reveal failures; guardrails constrain what can happen when those failures occur." },
  { from: "one guarded loop", to: "systems of loops", text: "Most tasks need a fixed workflow, not more autonomy. Learn the small set of shapes that scale." },
  { from: "orchestration patterns", to: "one complete system", text: "The capstone combines every prior artifact into a research service you can trace, test, and explain." },
] as const

const RUNNING_EXAMPLE = [
  "Ask a model to turn one messy note into a useful sentence.",
  "Turn that note into validated action items your code can consume.",
  "Let the assistant look up missing facts with tools, recording each step.",
  "Remember prior notes and retrieve only the context this request needs.",
  "Write golden cases and grade whether the assistant found the right answer.",
  "Add limits, action checks, and injection tests around the same loop.",
  "Split independent research across workers and synthesize their results.",
  "Ship the Deep Research Agent: plan, research, verify, write, trace, and deploy.",
] as const

export function generateStaticParams() { return courseModules.map((_, i) => ({ module: String(i + 1) })) }

export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module: raw } = await params; const index = Number(raw); const item = courseModules[index - 1]; if (!item) notFound()
  const nn = String(index).padStart(2, "0")
  const hero = HERO[index]
  const minutes = item.minutes.reduce((a, b) => a + b, 0)
  const projectHref = item.projectSection > 0 ? `/m/${index}/s/${item.projectSection}` : `/m/${index}/s/1`
  const next = courseModules[index]

  return <ReadingFrame module={index} lesson={0} title={item.title}><article>
    {/* Opening, on a dot ground: the module number large in blue; its mark, title and intro beside it. */}
    <div className="dot-ground -mx-5 px-5 pb-10 pt-2 md:-mx-8 md:px-8">
      <Eyebrow>Modules / {nn}</Eyebrow>
      <div className="mt-6 grid items-start gap-6 md:grid-cols-[auto_auto_1fr] md:gap-x-10">
        <p aria-hidden className="font-display text-[128px] leading-[.82] tracking-tight md:text-[184px]" style={{ color: ACC }}>{nn}</p>
        <div className="md:pt-2">
          <h1 className="text-balance font-display text-5xl leading-[.96] tracking-tight md:text-7xl">{item.title}</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground">{item.intro}</p>
        </div>
      </div>
    </div>

    <section className="mt-8 grid gap-px border border-border bg-border md:grid-cols-[1fr_1.35fr]">
      <div className="bg-background p-5">
        <Eyebrow>Bridge</Eyebrow>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">{BRIDGES[index - 1].from} → {BRIDGES[index - 1].to}</p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{BRIDGES[index - 1].text}</p>
      </div>
      <div className="bg-background p-5" style={{ boxShadow: `inset 2px 0 0 ${ACC}` }}>
        <Eyebrow accent>The running example</Eyebrow>
        <p className="mt-3 text-sm leading-6">{RUNNING_EXAMPLE[index - 1]}</p>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">Stage {index} of {courseModules.length} · The Deep Research Agent</p>
      </div>
    </section>

    {/* Hero figure, when the module has one: same frame as a section figure. */}
    {hero && <figure className="mt-4 border border-border bg-secondary/30 p-4">
      <div className="mx-auto max-w-[880px]"><hero.Fig /></div>
      <figcaption className="mt-3 flex flex-wrap justify-between gap-x-6 gap-y-1 font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground"><span>Figure {hero.n} — {hero.title}</span><span>Section {hero.section}</span></figcaption>
    </figure>}

    <section className="mt-12"><Eyebrow>What you'll be able to do</Eyebrow><ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">{item.outcomes.map((o) => <li key={o}>{o}</li>)}</ul></section>

    {/* Project: a callout on the paper — 2px blue rule, label in blue ink, no box. */}
    <section className="mt-12 pl-5" style={{ borderLeft: `2px solid ${ACC}` }}>
      <Eyebrow accent>Project</Eyebrow>
      <h2 className="mt-3 font-display text-3xl">{item.projectTitle}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{item.projectBlurb}</p>
      <Link className="mt-4 inline-block font-mono text-[10px] uppercase tracking-[.16em] underline underline-offset-4" href={projectHref}>{item.projectCta}</Link>
    </section>

    {/* Sections: blue mono numerals; the project row carries the rule; the verb at the end is blue. */}
    <section className="mt-12"><Eyebrow>Sections</Eyebrow><div className="mt-4 border-t border-border">{item.sections.map((name, i) => { const isProject = i + 1 === item.projectSection; return <Link key={name} href={`/m/${index}/s/${i + 1}`} className="grid grid-cols-[40px_1fr_auto] items-center gap-3 border-b border-border py-4 text-sm hover:bg-secondary" style={isProject ? { boxShadow: `inset 2px 0 0 ${ACC}`, paddingLeft: 12 } : undefined}><span className="font-mono text-[10px]" style={{ color: INK }}>{String(i + 1).padStart(2, "0")}</span><span>{name}{isProject && <span className="ml-3 font-mono text-[10px] uppercase tracking-[.16em]" style={{ color: INK }}>Project</span>}</span><span className="font-mono text-[10px] text-muted-foreground">~{item.minutes[i]} min · <span style={{ color: INK }}>{i === 0 ? "Start" : "Open"}</span></span></Link> })}</div></section>

    {next && <p className="mt-8 font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">Then — <Link href={`/m/${index + 1}`} style={{ color: INK }}>Module {String(index + 1).padStart(2, "0")}: {next.title} →</Link></p>}

    {/* A quiet field of glyphs above the footer: the template wave, tinted to the paper. */}
    <div aria-hidden className="mt-20 h-24 md:h-32"><AnimatedWave color="96, 88, 78" alpha={[0.03, 0.22]} fontSize={10} cell={14} /></div>
  </article></ReadingFrame>
}
