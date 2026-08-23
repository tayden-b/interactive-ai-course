"use client"

import Link from "next/link"
import { useState } from "react"
import { Check, Eyebrow, Figure, LessonHeader, Prose } from "./reading-frame"
import { GoDeeper } from "@/components/figures/resource"
import { Code, Compare, Flow, KV, Stack, Steps, Table } from "@/components/figures/kit"
import { Bars, Timeline } from "@/components/figures/charts"
import { Orchestration } from "@/components/reference/orchestration"

const lessons = [
  {
    title: "Workflows first",
    time: "~7 min",
    line: "If you can write down the steps, write a workflow; reach for an agent only when the path cannot be known in advance.",
    figure: `WORKFLOW  classify → look up → draft → check → send
AGENT     plan → tool → observe → plan → reply

answer a support ticket       debug a failing build
workflow: fixed path          workflow: no path matches
                               agent: proceeds`,
    node: (
      <Compare
        left={{
          title: "Workflow",
          accent: true,
          children: (
            <>
              <Flow items={["classify", "look up", "draft", "check", "send"]} />
              <p className="mt-3 text-[13px] leading-5 text-muted-foreground">A fixed sequence of steps, some of which call a model. The model does the parts that need language; your code does the order.</p>
            </>
          ),
          note: "answer a support ticket — the path is fixed",
        }}
        right={{
          title: "Agent",
          children: (
            <>
              <Flow items={["plan", "tool", "observe", "plan", "reply"]} />
              <p className="mt-3 text-[13px] leading-5 text-muted-foreground">Decides its own path. Every decision is a model call, every call can be wrong, and errors compound.</p>
            </>
          ),
          note: "debug a failing build — no path matches, so the agent proceeds",
        }}
      />
    ),
    caption: "FIGURE 7.1.1 — Known steps: workflow. Unknown steps: agent.",
    library: "learnaivisually — DAG-vs-loop comparison.",
    paragraphs: [
      "An agent decides its own path. That's powerful and expensive: every decision is a model call, every call can be wrong, and errors compound (Module 5). If you already know the path, don't make the model find it.",
      "A workflow is a fixed sequence of steps, some of which call a model. Classify the ticket, look up the account, draft a reply, check it, send. The model does the parts that need language; your code does the order. It's cheaper, faster, more testable, and it fails in predictable places.",
      "The rule: start with a workflow. Promote a step to an agent only when the step itself can't be written down — when the number of tool calls, or which tools, depends on what's found along the way. Most production systems are a workflow with one or two agentic steps inside it.",
    ],
    key: "Default to a workflow; use an agent where, and only where, the path can't be known.",
    question: "A task has the same four steps every time, with a model drafting step three. What is it?",
    options: ["An agent.", "A workflow with a model call inside.", "Not AI."],
    feedback: ["Nothing decides its own path here.", "Yes.", "It uses a model — it's just not an agent."],
    deeper: 'Anthropic, "Building effective agents" — the workflows-versus-agents distinction and the five patterns.',
    url: "https://www.anthropic.com/research/building-effective-agents",
  },
  {
    title: "Chaining and routing", time: "~7 min",
    line: "Chaining breaks a task into fixed steps with a check between them; routing classifies the input first and sends it down the right path.",
    figure: "CHAIN: In → step 1 → gate (valid?) → step 2 → step 3 → Out\nROUTE: In → classifier → billing / bugs / general → Out",
    node: (
      <Stack>
        <KV rows={[
          { k: "chain", v: <Flow items={["in", "step 1", { label: "gate", accent: true, sub: "valid?" }, "step 2", "step 3", "out"]} /> },
          { k: "route", v: <Flow items={["in", "classifier", "billing / bugs / general", "out"]} /> },
        ]} />
        <Table head={["pattern", "shape", "fits when", "cost and payoff"]} rows={[
          ["Chain", "one call's output is the next call's input, with a check between", "steps are fixed and checkable", "latency, since the steps are sequential; each step is small enough to eval on its own, and each gate catches a failure before it compounds"],
          ["Route", "classify first, then choose the path", "different inputs need different handling", "one prompt per kind of input; easy cases go to a cheap model, hard ones to an expensive one"],
        ]} />
      </Stack>
    ),
    caption: "FIGURE 7.2.1 — Steps with gates; paths with a switch.",
    library: 'Anthropic, "Building effective agents" — prompt chaining and routing diagrams.',
    paragraphs: [
      "The two simplest shapes cover a surprising amount.",
      "Chaining: one model call's output is the next call's input, with a check in between. Draft an outline, check it has the required sections, write each section, check the length. Each call does one narrow thing it's good at; each gate catches a failure before it compounds. The cost is latency — the steps are sequential — and the payoff is that each step is small enough to eval on its own.",
      "Routing: classify first, then choose the path. A support system that sends billing questions to one prompt and bug reports to another does better than one prompt trying to do both. Routing also lets you send easy cases to a cheap model and hard ones to an expensive one — the cost lever from Module 6.",
      "Both are workflows. Neither needs an agent.",
    ],
    key: "Chain when steps are fixed and checkable; route when different inputs need different handling.",
    question: "Easy questions go to a cheap model and hard ones to an expensive model. Which pattern?",
    options: ["Chaining.", "Routing.", "An agent."],
    feedback: ["That's steps in sequence.", "Yes — classify, then choose.", "No decisions beyond the first."],
    deeper: 'Anthropic, "Building effective agents" — prompt chaining and routing diagrams.',
    url: "https://www.anthropic.com/research/building-effective-agents",
  },
  {
    title: "Parallel: fan out, fan in", time: "~6 min",
    line: "When steps don't depend on each other, run them at the same time and combine the results; it's faster, and voting improves accuracy.",
    figure: "In → summarize A | summarize B | summarize C → aggregate → Out\n\nsectioning: each box does a different part\nvoting: each box does the same task; majority wins\nsequential: 3 × 2 s    parallel: 2 s",
    node: (
      <Stack>
        <Flow items={[
          "in",
          { label: "summarize A | summarize B | summarize C", sub: "at the same time" },
          { label: "aggregate", sub: "the step to eval" },
          "out",
        ]} />
        <KV rows={[
          { k: "sectioning", v: "each box does a different part — split the work, run it at once, combine" },
          { k: "voting", v: "each box does the same task; the majority wins — costs more tokens, buys reliability" },
        ]} />
        <Timeline
          title="sequential vs parallel · seconds"
          total={6}
          ticks={3}
          rows={[
            { label: "summarize A", start: 0, end: 2 },
            { label: "summarize B", start: 2, end: 4 },
            { label: "summarize C", start: 4, end: 6 },
            { label: "A · B · C at once", start: 0, end: 2, accent: true },
          ]}
          note="Three calls at two seconds each: six seconds in sequence, two at once. Same total tokens."
        />
      </Stack>
    ),
    caption: "FIGURE 7.3.1 — Independent work doesn't have to wait.",
    library: 'Anthropic, "Building effective agents" — parallelization.',
    paragraphs: [
      "Module 6 noted that ten sequential calls at two seconds is twenty seconds. Often the calls don't need to be sequential.",
      "Sectioning: split the work into independent parts — summarize each of five documents — run them at once, and combine. Same total tokens, a fifth of the wall time. Voting: run the same judgment several times — \"is this output safe?\" — and take the majority. Costs more tokens, buys reliability on the calls that matter most.",
      "The discipline is in the aggregator. It has to combine results honestly — concatenate, vote, or hand them to one more model call that synthesizes — and it's the step to eval, because it's where a bad result can hide among good ones.",
    ],
    key: "Fan out independent work, fan it back in through an aggregator you've tested.",
    question: "Five documents need summarizing and none depends on another. Best shape?",
    options: ["Chain them.", "Run them in parallel, then combine.", "One call with all five."],
    feedback: ["Five times slower for no reason.", "Yes.", "Attention thins; Module 4."],
    deeper: 'Anthropic, "Building effective agents" — parallelization.',
    url: "https://www.anthropic.com/research/building-effective-agents",
  },
  {
    title: "Orchestrator and workers", time: "~8 min",
    line: "A lead agent plans and delegates; worker agents each do one part in their own small window; the lead synthesizes — and the point is context isolation.",
    figure: "              ORCHESTRATOR\n             /       |       \\\n        WORKER A  WORKER B  WORKER C\n             \\       |       /\n                SYNTHESIZE\n\nno worker sees another's window",
    node: (
      <Stack>
        <Flow items={[
          { label: "orchestrator", sub: "reads the task, breaks it into parts" },
          { label: "worker A | worker B | worker C", sub: "no worker sees another's window" },
          { label: "synthesize", sub: "from compact results" },
        ]} />
        <Bars
          title="window per agent · tokens"
          data={[
            { label: "orchestrator", value: 300, display: "300", accent: true },
            { label: "worker A", value: 30000, display: "30k" },
            { label: "worker B", value: 30000, display: "30k" },
            { label: "worker C", value: 30000, display: "30k" },
          ]}
          note="Each worker reads a 30,000-token document; the orchestrator sees only the 300-token summaries. Isolation is the win; parallelism is the bonus."
        />
      </Stack>
    ),
    caption: "FIGURE 7.4.1 — One plan, several small windows.",
    library: "Anthropic, How we built our multi-agent research system.",
    paragraphs: [
      "When a task is too big for one window — research that touches twenty sources, a change across many files — the answer isn't a bigger window. It's several.",
      "An orchestrator agent reads the task, breaks it into parts, and hands each part to a worker agent. Each worker has its own context window, its own narrow instructions, and only the tools it needs. It does its part and returns a compact result. The orchestrator collects the results and synthesizes.",
      "The benefit people expect is parallelism, and it's real. The benefit that matters more is isolation. A worker reading a 30,000-token document doesn't pollute the orchestrator's window; the orchestrator sees only the worker's 300-token summary. That's context engineering (Module 4) at the architecture level.",
      "The cost is coordination. The orchestrator's plan can be wrong, results can conflict, and debugging means reading several traces instead of one. Keep workers narrow and results small, and the trace stays readable.",
    ],
    key: "Orchestrator–workers is about small windows, not many brains; isolation is the win.",
    question: "The main reason to split a task across worker agents is…",
    options: ["More intelligence.", "Each worker gets a small, clean window.", "It looks impressive."],
    feedback: ["Same model, same intelligence.", "Yes.", "It also costs more; do it for the window."],
    deeper: 'Anthropic, "How we built our multi-agent research system."',
    url: "https://www.anthropic.com/engineering/built-multi-agent-research-system",
  },
  {
    title: "A critic in the loop", time: "~6 min",
    line: "Pair a generator with an evaluator: one produces, the other grades against a rubric, and the generator revises until the grade passes or a cap is hit.",
    figure: "generator → solution → evaluator\n                 ├─ accepted → Out\n                 └─ rejected + feedback → generator\n\nround 2 of 3",
    node: (
      <Stack>
        <Flow items={["generator", "solution", { label: "evaluator", sub: "rubric in hand, no stake in the output" }, { label: "rejected + feedback", sub: "round 2 of 3" }]} loop />
        <Steps accent={1} items={[
          { title: "Produce", body: "One call generates a solution." },
          { title: "Grade", body: "A second call, with a concrete rubric — \"every claim cites a source\", \"under 200 words\", \"valid JSON matching the schema\" — grades it and returns specific feedback. A vague rubric gives vague feedback, and the generator has nothing to act on." },
          { title: "Revise", body: "The generator revises with that feedback in its window. Accepted goes out; rejected loops, until the grade passes or the cap is hit." },
        ]} />
      </Stack>
    ),
    caption: "FIGURE 7.5.1 — Produce, grade, revise.",
    library: 'Anthropic, "Building effective agents" — evaluator-optimizer.',
    paragraphs: [
      "A model is better at judging an answer than producing it in one shot — the same reason editing is easier than writing. The evaluator–optimizer pattern uses that.",
      "One call generates. A second call, with a clear rubric and no stake in the output, grades it and returns specific feedback. The first call revises with that feedback in its window. Loop until the grade passes or you hit a cap.",
      "It works when the rubric is concrete — \"every claim cites a source,\" \"under 200 words,\" \"valid JSON matching the schema.\" It wastes money when the rubric is vague, because the critic's feedback is vague and the generator has nothing to act on. It's also the Module 5 judge, moved from test time into the workflow.",
    ],
    key: "A critic with a concrete rubric makes a generator reliable; a vague critic makes it expensive.",
    question: 'An evaluator keeps rejecting with "could be better." What\'s wrong?',
    options: ["The generator is weak.", "The rubric is vague.", "The cap is too low."],
    feedback: ["It has nothing to act on.", "Yes — make it concrete.", "More rounds of vague feedback won't help."],
    deeper: 'Anthropic, "Building effective agents" — evaluator-optimizer.',
    url: "https://www.anthropic.com/research/building-effective-agents",
  },
  {
    title: "Humans in the loop", time: "~6 min",
    line: "Put a person at the points where being wrong is expensive — approving risky actions, resolving ambiguity, verifying the final result — and design the pause so it's cheap to answer.",
    figure: "loop → PAUSE: approve send_email? → approve / edit / reject → loop\n\nevery step approved ───── most real systems live here ───── fully autonomous",
    node: (
      <Stack>
        <Flow items={["loop", { label: "pause", accent: true, sub: "approve send_email?" }, { label: "approve / edit / reject", sub: "one screen, exactly what is about to happen" }]} loop />
        <Table head={["put a person", "when", "because"]} rows={[
          ["Before risky actions", "anything that sends, deletes, pays, or can't be undone", "it's the action gate from Module 6, with a person behind it"],
          ["On ambiguity", "the plan depends on a choice the user would have an opinion about", "ask, don't guess"],
          ["At the end", "anything that will be shown to someone else", "a quick human verification beats a perfect-looking hallucination"],
        ]} />
        <Flow items={[{ label: "every step approved", sub: "nobody will use it" }, "most real systems live here", { label: "fully autonomous", sub: "a slider, not a goal" }]} />
      </Stack>
    ),
    caption: "FIGURE 7.6.1 — Autonomy is a dial, and the pause is a feature.",
    library: 'Karpathy, "Software 3.0" — the autonomy slider and generation–verification loop.',
    paragraphs: [
      "Full autonomy is a slider, not a goal. The useful question is where a person should be, and the answer is wherever a mistake is expensive and a human judgment is cheap.",
      "Three places. Before risky actions: anything that sends, deletes, pays, or can't be undone gets an approval step (the action gate from Module 6, with a person behind it). On ambiguity: when the agent's plan depends on a choice the user would have an opinion about, ask, don't guess. At the end: for anything that will be shown to someone else, a quick human verification beats a perfect-looking hallucination.",
      "The design work is making the pause cheap. Show the person exactly what's about to happen, in one screen, with approve / edit / reject. An agent that asks well is one people trust with more.",
    ],
    key: "Put people where mistakes are expensive, and make the pause a one-screen decision.",
    question: "Where is a human approval step most valuable?",
    options: ["Before every model call.", "Before actions that can't be undone.", "Never — it defeats the purpose."],
    feedback: ["Nobody will use it.", "Yes.", "Trust is earned by asking at the right moments."],
    deeper: 'Karpathy, "Software 3.0" — the autonomy slider and the generation–verification loop.',
    url: "https://www.ycombinator.com/library/MW-andrej-karpathy-software-is-changing-again",
  },
]

function MiniCheck({ lesson }: { lesson: (typeof lessons)[number] }) {
  const [selected, setSelected] = useState<number | null>(null)
  return <Check><span className="block">{lesson.question}</span><div className="mt-3 grid gap-2">{lesson.options.map((option, index) => <button key={option} onClick={() => setSelected(index)} className={`border px-3 py-3 text-left text-sm ${selected === index ? "border-foreground" : "border-border"}`}><span className="mr-2 font-mono text-[10px]">{String.fromCharCode(65 + index)}</span>{option}</button>)}</div>{selected !== null && <span className="mt-4 block border-t border-border pt-4 text-muted-foreground">{lesson.feedback[selected]}</span>}</Check>
}

export function ModuleSevenHome() {
  return <article><Eyebrow>Modules / 07</Eyebrow><h1 className="mt-5 font-display text-6xl">Workflows and orchestration</h1><p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground">One agent in one loop is the right shape for some jobs and the wrong shape for most. This module is the catalog of other shapes: fixed workflows when the steps are known, routing, running things in parallel, a lead agent directing specialists, a critic checking a generator, and a person in the loop where it matters. By the end you&apos;ll have built a two-agent system and know why it&apos;s two.</p><section className="mt-10 border-t border-border pt-6"><Eyebrow>What you&apos;ll be able to do</Eyebrow><ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground"><li>Decide whether a task needs an agent at all.</li><li>Draw the five workflow patterns and say when each fits.</li><li>Explain why splitting work across agents is a context decision, not a cleverness decision.</li></ul></section><section className="mt-12 border border-border p-5"><Eyebrow>Project</Eyebrow><h2 className="mt-3 font-display text-3xl">A two-agent system</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">An orchestrator that routes requests, fans out independent work to a worker in parallel, and synthesizes — with the trace showing both agents.</p><Link href="/m/7/s/7" className="mt-5 inline-block font-mono text-[10px] uppercase tracking-[.16em] underline underline-offset-4">Open project →</Link></section></article>
}

export function ModuleSevenLesson({ section = 1 }: { section?: number }) {
  const project = section === 7
  const lesson = lessons[Math.max(0, Math.min(5, section - 1))]
  if (project) return <article><LessonHeader eyebrow="Module 07 · Section 7 of 7" meta="~45 min">Project: a two-agent system</LessonHeader><div className="mt-10 border border-border px-4 py-3"><Eyebrow>In one line</Eyebrow><p className="mt-2 text-lg leading-7">Build an orchestrator that routes requests, fans independent work out to a worker in parallel, and synthesizes — and read the trace that shows both agents.</p></div><Figure caption="FIGURE 7.7.1 — Two agents, one task, every window visible."><Stack><Flow items={[{ label: "orchestrator", sub: "short window" }, { label: "worker A | worker B | worker C", sub: "own windows + tool calls" }, "synthesis"]} /><Code title="trace tree — nested spans" mark={[1]}>{`
orchestrator          short window
  ├─ worker A         own window + tool calls
  ├─ worker B         own window + tool calls
  └─ worker C         own window + tool calls`}</Code></Stack></Figure><section className="border border-border p-5"><Eyebrow>What you&apos;ll build</Eyebrow><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground"><li>A router that classifies incoming requests into two or three types.</li><li>An orchestrator that breaks a research-style request into parts.</li><li>A worker agent (your Module 6 agent, narrowed) that takes one part, with its own window and tools.</li><li>A parallel fan-out of three workers and an aggregator that synthesizes.</li><li>One human-approval pause on the risky action.</li><li>Traces with nested spans so you can see each worker inside the orchestrator&apos;s run.</li></ul><p className="mt-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">What you&apos;ll have at the end —</strong> A small multi-agent system whose trace you can explain — and the shape of the capstone.</p></section><Prose><p>This is the first time you&apos;ll see two context windows in one trace. That&apos;s the thing to look at: how small each one stays.</p><p>Build the router first; it&apos;s a workflow. Then the orchestrator with one worker. Then three in parallel.</p><p>Build steps arriving with the lab.</p></Prose><aside className="mt-10 border border-border p-5"><Eyebrow>Key idea</Eyebrow><p className="mt-2 text-sm leading-6">You&apos;ve built the pattern the capstone scales up: a plan, small windows, a synthesis.</p></aside><GoDeeper title="Anthropic — How we built our multi-agent research system" url="https://www.anthropic.com/engineering/built-multi-agent-research-system" /></article>
  return <article><LessonHeader eyebrow={`Module 07 · Section ${section} of 7`} meta={lesson.time}>{lesson.title}</LessonHeader><div className="mt-10 border border-border px-4 py-3"><Eyebrow>In one line</Eyebrow><p className="mt-2 text-lg leading-7">{lesson.line}</p></div><Figure caption={lesson.caption} library={lesson.node ? undefined : (lesson.library)}>{lesson.node ?? <pre className="whitespace-pre-wrap p-5 font-mono text-xs leading-6 text-muted-foreground">{lesson.figure}</pre>}</Figure>{section === 2 && <div className="carbon-scope -mx-5 mt-12 overflow-hidden border-y border-border bg-background px-5 md:-mx-8 md:px-8"><Orchestration /></div>}<Prose>{lesson.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</Prose><aside className="mt-10 border border-border p-5"><Eyebrow>Key idea</Eyebrow><p className="mt-2 text-sm leading-6">{lesson.key}</p></aside><MiniCheck lesson={lesson}/><GoDeeper title={lesson.deeper} url={lesson.url} /></article>
}

export { ModuleSevenLesson as ModuleSeven }
