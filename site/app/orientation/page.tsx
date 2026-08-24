import Link from "next/link"
import { ReadingFrame, Eyebrow } from "@/components/book/reading-frame"
import { Foundations } from "@/components/reference/foundations"
import { Stack } from "@/components/reference/stack"

const vocabulary = [
  ["Model", "A trained probability system that turns an input sequence into a likely output sequence."],
  ["LLM", "A language model trained at large scale. It predicts tokens; it does not execute actions."],
  ["Prompt", "The instructions and context sent to a model for one call."],
  ["Context window", "Everything the model can see for the current call: instructions, messages, and tool results."],
  ["Tool", "A description and schema the model reads, paired with a function your code runs."],
  ["Agent", "A model inside a loop that can choose tools and decide what to do next."],
  ["Workflow", "A path your code fixes in advance, even when some steps call a model."],
  ["Orchestration", "The code that assembles context, calls models, runs tools, stores state, and controls the path."],
] as const

export default function OrientationPage() {
  return (
    <ReadingFrame title="Orientation: a map of the field">
      <main>
        <header className="border-b border-border pb-10">
          <Eyebrow>Orientation · Read this first</Eyebrow>
          <h1 className="mt-5 max-w-4xl text-balance font-display text-5xl leading-[.96] tracking-tight md:text-7xl">
            A map of the field before you build
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground">
            AI vocabulary gets flattened into one blurry idea. This chapter separates the field, the model, and the software around it so every module that follows has a stable map.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/m/1" className="bg-primary px-5 py-3 text-sm text-primary-foreground">Start Module 1</Link>
            <a href="#vocabulary" className="border border-border px-5 py-3 text-sm">Jump to vocabulary</a>
          </div>
        </header>

        <div className="carbon-scope -mx-5 mt-12 overflow-hidden border-y border-border bg-background px-5 md:-mx-8 md:px-8">
          <Foundations />
          <Stack />
        </div>

        <section id="vocabulary" className="scroll-mt-24 py-16">
          <Eyebrow>The working vocabulary</Eyebrow>
          <h2 className="mt-4 max-w-2xl text-balance font-display text-4xl leading-tight md:text-5xl">Eight words, kept separate</h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">Use these definitions throughout the course. The distinction that matters most: the model produces tokens; orchestration code turns those tokens into a system.</p>
          <dl className="mt-8 grid gap-px border border-border bg-border md:grid-cols-2">
            {vocabulary.map(([term, definition]) => (
              <div key={term} className="bg-background p-5">
                <dt className="font-mono text-xs uppercase tracking-[.14em] text-foreground">{term}</dt>
                <dd className="mt-3 text-sm leading-6 text-muted-foreground">{definition}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="border-y border-border py-10">
          <Eyebrow accent>The sentence to keep</Eyebrow>
          <p className="mt-4 max-w-4xl text-balance font-display text-3xl leading-tight md:text-4xl">A model predicts. Your orchestration code decides what the prediction can see, what it may call, and what happens next.</p>
        </section>

        <nav aria-label="Continue course" className="flex items-center justify-between py-10 font-mono text-[10px] uppercase tracking-[.16em]">
          <Link href="/">← Course home</Link>
          <Link href="/m/1" className="accent-ink">Module 01: What is an LLM? →</Link>
        </nav>
      </main>
    </ReadingFrame>
  )
}
