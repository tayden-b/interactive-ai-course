"use client"

import Link from "next/link"
import { useState } from "react"
import { Check, Eyebrow, Figure, LessonHeader, Prose, PrevNext} from "./reading-frame"
import { GoDeeper } from "@/components/figures/resource"
import { Fig09 } from "@/components/figures/course-figures"
import { Code, Compare, KV, Numbers, Stack, Table } from "@/components/figures/kit"
import { Bars, Line } from "@/components/figures/charts"

type Lesson = { node?: React.ReactNode; title: string; time: string; line: string; figure: string; caption: string; paragraphs: string[]; idea: string; question?: string; options?: string[]; feedback?: string[]; deeper: string; url: string; project?: boolean; build?: string[]; end?: string }

// s3 — the three graders, and what each costs per case (illustrative).
const MONO_CELL = "whitespace-nowrap font-mono text-[12px] text-foreground"
const GRADE_NOTE =
  "Use the strictest grader that fits. " +
  "Reach for a judge only when nothing mechanical will do."
const CODE_USE =
  "one property that matters — " +
  "three items, owners non-empty, the JSON parses"

// s6 — pass rate per CI run. Only #41 (91%) and #42 (80%) are stated;
// the runs before them are drawn to show the shape.
const PASS_RATES = [90, 91, 89, 91, 90, 91, 80]
const RUN_LABELS = ["#36", "#37", "#38", "#39", "#40", "#41", "#42"]
const CI_NOTE =
  "#42 is a prompt change. " +
  "The change is the suspect; the traces are the evidence."
const CI_ROWS = [
  { k: "when", v: "every change to the prompt, the tools, or the model" },
  { k: "record", v: "the pass rate, next to the change that produced it" },
  { k: "on a drop", v: "the change is the suspect; the traces are the evidence" },
  { k: "wobble", v: "outputs vary — run the suite a few times, or the average" },
  { k: "speed", v: "fast enough that people actually run it" },
]

const lessons: Lesson[] = [
  {
    node: (
      <Compare
        left={{
          title: "Tried by hand",
          children: (
            <Stack>
              <Numbers items={[{ value: "3", label: "cases tried · all worked" }, { value: "?", label: "the rest" }]} />
              <p className="text-[13px] leading-5 text-muted-foreground">Three passed. The hundred you didn't try look exactly like them until you check.</p>
            </Stack>
          ),
          note: "“seemed fine”",
        }}
        right={{
          title: "After an eval run",
          accent: true,
          children: (
            <Stack>
              <Numbers items={[{ value: "87 / 100", label: "cases pass · failures scattered" }]} />
              <p className="text-[13px] leading-5 text-muted-foreground">Every case, run automatically, counted. Change something and run it again.</p>
            </Stack>
          ),
          note: "a number",
        }}
      />
    ),
    title: "It seemed fine is not a test", time: "~5 min", line: "A model that works on the three examples you tried tells you almost nothing about the hundred you didn't.", figure: "TRIED — WORKED   ✓ ✓ ✓   · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · ·\nUNKNOWN          grey cases\n\nAFTER EVAL RUN    green-grey cases · scattered failures · 87 / 100", caption: "FIGURE 5.1.1 — What you tried, and what you didn't.", paragraphs: ["Everything a model does is a probability. That means it can be right ninety times and wrong ten, and the ten look exactly like the ninety until you check. Trying a few examples by hand and nodding is how most AI features ship, and it's why so many of them quietly don't work.", "An eval is the habit of replacing \"seemed fine\" with a number. You collect cases. You decide what correct looks like for each one. You run the system on all of them, automatically, and count. Then you change something and run it again.", "This module is short on theory because evals are mostly discipline. The one idea to carry is that you don't know how well your agent works until you've measured it on cases you didn't cherry-pick."], idea: "If you haven't measured it, you don't know; evals turn \"seems fine\" into a number.", question: "You tested your agent on five questions and it got all five. What do you know?", options: ["It works.", "It works on those five; the rest is unknown.", "It's about 95% accurate."], feedback: ["You know only that it works on five.", "Yes.", "Five tells you nothing about the distribution."], deeper: "Hamel Husain, Your AI product needs evals.", url: "https://hamel.dev/blog/posts/evals/" },
  {
    node: (
      <Table
        head={["input", "expected", "what matters", "grader"]}
        accentCol={2}
        rows={[
          ["easy note", "3 actions", "owners + dates", "code"],
          ["no actions", <code key="v" className="font-mono text-[12px]">[]</code>, "empty is valid", "exact"],
          ["ambiguous owner", "owner?", "flag uncertainty", "judge"],
          ["date in words", "ISO date", "normalize", "code"],
          ["distractor", "ignore", "relevance", "judge"],
        ]}
      />
    ),
    title: "Golden cases", time: "~7 min", line: "Write the cases — input, expected output, and what matters about it — before you build; they're the spec.", figure: "input | expected | what matters | grader\n----- | -------- | ------------- | ------\neasy note | 3 actions | owners + dates | code\nno actions | [] | empty is valid | exact\nambiguous owner | owner? | flag uncertainty | judge\ndate in words | ISO date | normalize | code\ndistractor | ignore | relevance | judge", caption: "FIGURE 5.2.1 — The spec, as a table.", paragraphs: ["A golden case is one input with the answer you'd accept, plus a note on why. Twenty of them, chosen to cover the easy path, the edge cases, and the failures you fear, are worth more than any amount of prompt tweaking.", "Write them before you build. It forces the question every feature avoids: what does correct mean here? For the note-to-actions tool, is a missing due date a failure or an empty field? Is \"Priya\" the owner if the notes say \"P will handle it\"? Deciding that in a table is cheaper than deciding it in production.", "Where do cases come from? Your own usage. Real inputs people sent. The last three times it was wrong. Keep adding — every production failure becomes a golden case, so it can never quietly return."], idea: "Golden cases are the spec; write them first, and add every real failure to them.", question: "The best source of new golden cases is…", options: ["Made-up inputs that cover the spec.", "Real inputs, especially ones that failed.", "The model generating cases."], feedback: ["Useful to start — but real failures are better.", "Yes.", "Fine for volume; it won't find the cases you fear."], deeper: "Hamel Husain & Shreya Shankar's evals course outline — the most-taken course in this space, and why.", url: "https://maven.com/parlance-labs/evals" },
  {
    node: (
      <Stack>
        <Table
          head={["grader", "passes when", "use it for", "cost"]}
          rows={[
            [
              <span key="g" className="whitespace-nowrap">Exact match</span>,
              <code key="v" className={MONO_CELL}>expected == got</code>,
              "structured fields — a date is either right or it isn't",
              "cheap, strict",
            ],
            [
              <span key="g" className="whitespace-nowrap">Code check</span>,
              <code key="v" className={MONO_CELL}>len(actions) == 3</code>,
              CODE_USE,
              "cheap, strict",
            ],
            [
              <span key="g" className="whitespace-nowrap">Model as judge</span>,
              <code key="v" className={MONO_CELL}>rubric → score 0–2 + reason</code>,
              "prose, summaries, “is this action really in the notes?”",
              "expensive, flexible, least trustworthy",
            ],
          ]}
        />
        <Bars
          title="cost per case · illustrative"
          note={GRADE_NOTE}
          height={200}
          data={[
            { label: "exact match", value: 1, display: "a string compare" },
            { label: "code check", value: 2, display: "a small function" },
            {
              label: "model as judge",
              value: 100,
              display: "a model call",
              accent: true,
            },
          ]}
        />
      </Stack>
    ),
    title: "Three ways to grade", time: "~8 min", line: "Grade with exact match when there's one right answer, with code when a property can be checked, and with a model as judge when only judgment will do.", figure: "EXACT MATCH        CODE CHECK             MODEL AS JUDGE\nexpected = got ✓    len(actions) == 3 ✓    rubric: every action in notes?\n                                             score 0–2 + reason", caption: "FIGURE 5.3.1 — Cheap and strict, to expensive and flexible.", paragraphs: ["Once you have cases, you need a way to say pass or fail without reading each one. There are three, and most suites use all of them.", "Exact match: the output must equal the expected output. Cheap, strict, perfect for structured fields — a date is either right or it isn't. Code check: a small function asserts a property — the list has three items, every owner is non-empty, the JSON parses. You're not checking the whole answer, you're checking what matters. Model as judge: for prose, summaries, or \"is this action really in the notes,\" ask a second model with a clear rubric and a tight scale. It's the most flexible and the least trustworthy, so keep rubrics narrow and spot-check the judge against your own reading.", "The order matters. Use the strictest grader that fits. Reach for a judge only when nothing mechanical will do."], idea: "Prefer the strictest grader that fits; a model judge is the last resort, not the first.", question: "The output must contain exactly the three action owners from the notes. Best grader?", options: ["A model judge.", "A code check on the owners list.", "Exact match on the whole JSON."], feedback: ["Overkill and unreliable for a mechanical check.", "Yes.", "Too brittle — task wording may vary."], deeper: "Arize/DeepLearning.AI, Evaluating AI Agents — graders by type, with traces.", url: "https://www.deeplearning.ai/courses/evaluating-ai-agents" },
  {
    node: (
      <Stack>
        <Bars
          title="first wrong step · 20 failing traces · illustrative"
          note="One row is denser than the others. That row is the next fix."
          height={200}
          data={[
            { label: "plan", value: 3 },
            { label: "tool choice", value: 2 },
            { label: "tool args", value: 12, accent: true },
            { label: "reply", value: 3 },
          ]}
        />
        <Table
          head={[
            "first wrong step",
            "where it lives in the trace",
            "the question to ask",
          ]}
          rows={[
            ["plan", "the first model call", "Was the plan bad?"],
            ["tool choice", "the tool call — its name", "Did it pick the wrong tool?"],
            ["tool args", "the tool call — its arguments", "Right tool, wrong arguments?"],
            ["reply", "the model call after the result", "Right result, wrong reply?"],
          ]}
        />
      </Stack>
    ),
    title: "Traces are evidence", time: "~8 min", line: "When an eval fails, the trace tells you which step went wrong; read twenty of them and the pattern names the fix.", figure: "run ├─ model call\n    ├─ tool call\n    ├─ tool result\n    └─ model call  ⚑\n\nstep             failed cases\nplan             · ·\ntool choice      ·\ntool args        ███████\nreply            · ·", caption: "FIGURE 5.4.1 — Failures cluster at a step. Find the step.", paragraphs: ["A pass rate tells you how often you fail. It doesn't tell you why. For that you have the trace — every model call, every tool call, every result, in order — which you've been recording since Module 3.", "The practice is called error analysis, and it's less glamorous than it sounds: open the failing runs and read them. For each one, mark the first step where things went wrong. Was the plan bad? Did it pick the wrong tool? Right tool, wrong arguments? Right result, wrong reply? After twenty, you have a grid, and one row is denser than the others. That row is your next fix.", "This is why the trace matters more than the score. The score says \"87.\" The trace says \"it's the tool arguments, every time, when the date is in words.\" One of those you can act on."], idea: "Read the failing traces; the step where failures cluster is the fix.", question: "Your pass rate dropped from 91 to 80. First move?", options: ["Try a bigger model.", "Read the failing traces and mark the first wrong step.", "Rewrite the system prompt."], feedback: ["You don't know what broke yet.", "Yes.", "Maybe — after you know where the failures are."], deeper: "Learn AI Visually, Evals & diagnostics — labeling twelve traces into a failure matrix, live.", url: "https://learnaivisually.com/tracks/ai-agents" },
  { node: <Fig09 />, title: "Compounding errors", time: "~6 min", line: "An agent that's 90% right per step is about 35% right over ten steps; per-step accuracy is everything.", figure: "accuracy per step: 90% ───── 99%\nend-to-end success\n1.0 ┤╲                         ╱\n0.8 ┤ ╲ 99%                 ╱\n0.5 ┤  ╲ 90%       ·──────╯\n    └──── 1 ─── 7 ───── 20 steps", caption: "FIGURE 5.5.1 — Small per-step errors, large end-to-end failure.", paragraphs: ["Here's the arithmetic that governs agents. If each step succeeds 90% of the time, and a task takes ten steps, the whole task succeeds about 35% of the time. At 95% per step it's about 60%. At 99% it's about 90%.", "Two consequences. First, a single eval of \"did the whole task work\" hides the problem; you need step-level evals so you know which 90% to fix. Second, the cheapest way to improve an agent is often to shorten it — fewer steps, fewer chances to fail — before making any step smarter.", "This is also why workflows with fixed steps (Module 7) often beat free-roaming agents: fewer decisions, fewer compounding errors."], idea: "Errors compound; measure per step, and cut steps before adding intelligence.", question: "An agent is 90% reliable per step and needs 10 steps. Roughly how often does the whole task succeed?", options: ["About 90%.", "About 35%.", "About 60%."], feedback: ["That's one step.", "Yes — 0.9 to the tenth.", "That's 95% per step."], deeper: "Learn AI Visually, Evals module, stage 1 — the per-step slider.", url: "https://learnaivisually.com/tracks/ai-agents" },
  {
    node: (
      <Stack>
        <Line
          title="pass rate per CI run · illustrative"
          note={CI_NOTE}
          series={[{ name: "80%", points: PASS_RATES, accent: true }]}
          xLabels={RUN_LABELS}
          yMin={50}
          yMax={100}
          unit="%"
        />
        <KV rows={CI_ROWS} />
      </Stack>
    ),
    title: "Every time, automatically", time: "~6 min", line: "Run the eval suite on every change, like tests, so a regression can't ship without someone seeing the number move.", figure: "CI RUNS  pass rate\n#41       91%  ─╮\n#42       80%  ─╯  prompt change · regression", caption: "FIGURE 5.6.1 — The number moves when something breaks.", paragraphs: ["Evals you run once are a report. Evals you run every time are a safety net.", "Put the suite behind a single command. Run it in CI when the prompt, the tools, or the model changes. Record the pass rate with the change that produced it. When the rate drops, the change is the suspect and the traces are the evidence.", "Two practical notes. Model outputs vary, so a single run can wobble; run the suite a few times, or report the average. And keep the suite fast enough that people actually run it — twenty cases in a minute beats two hundred in an hour, because the fast one gets run."], idea: "Evals in CI make regressions visible at the moment they're introduced.", question: "Why run the suite more than once?", options: ["To warm the cache.", "Because model outputs vary, so one run can mislead.", "To make the number bigger."], feedback: ["Not the reason.", "Yes.", "To make it honest."], deeper: "Braintrust docs, Evals in CI.", url: "https://www.braintrust.dev/docs" },
  {
    node: (
      <Code lang="text" title="your suite — one command, run twice" mark={[4]}>{`
$ make evals
run   change                      pass rate
#1    as built                    91%
#2    a worse tool description    80%      RED
      └ failing traces · flagged step
`}</Code>
    ),
    title: "Project: a test suite for your agent", time: "~40 min", line: "Build an eval suite for your Module 4 agent, then change something and watch it catch the regression.", figure: "YOUR RUN  #1  91%\nYOUR RUN  #2  80%  RED\n             └ failing traces · flagged step", caption: "FIGURE 5.7.1 — A regression you caught on purpose.", paragraphs: ["This is the module people skip and the one that separates a demo from a product.", "Write the cases before touching the agent. Then break it on purpose — that's the moment the suite earns its keep.", "Build steps arriving with the lab."], idea: "You can now change your agent without fear, because the suite will tell you.", deeper: "Hamel Husain, Your AI product needs evals.", url: "https://hamel.dev/blog/posts/evals/", project: true, build: ["Twenty golden cases for your agent, in a file, with \"what matters\" for each.", "Three graders: exact match on structured fields, a code check on list properties, a narrow model judge for one prose field.", "Trace assertions: \"called the right tool,\" \"no more than N steps.\"", "One command that runs everything and prints a pass rate.", "A deliberate break — a worse tool description — and the run that catches it."], end: "A number you trust, a grid that says where failures live, and the habit of changing things only when the number agrees." },
]

function MiniCheck({ lesson }: { lesson: Lesson }) { const [selected, setSelected] = useState<number | null>(null); return <Check><span className="block">{lesson.question}</span><div className="mt-3 grid gap-2">{lesson.options?.map((option, i) => <button key={option} onClick={() => setSelected(i)} className={`border px-3 py-3 text-left text-sm ${selected === i ? "border-foreground" : "border-border"}`}><span className="mr-2 font-mono text-[10px]">{String.fromCharCode(65 + i)}</span>{option}</button>)}</div>{selected !== null && <span className="mt-4 block border-t border-border pt-4 text-muted-foreground">{lesson.feedback?.[selected]}</span>}</Check> }

export function ModuleFiveHome() { return <article><Eyebrow>Modules / 05</Eyebrow><h1 className="mt-5 font-display text-6xl">Evals</h1><p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground">You've built an agent that works when you watch it. This module is about knowing it works when you don't: writing down what 'correct' means before you build, grading automatically, reading traces to find out why it failed, and running all of that every time the code changes. Evals are the difference between a demo and something you'd put your name on.</p><section className="mt-10 border-t border-border pt-6"><Eyebrow>What you will be able to do</Eyebrow><ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground"><li>Write a set of golden cases for a task before building it.</li><li>Pick the right grader — exact match, a code check, or a model judging — for each case.</li><li>Read twenty traces and name the step where things go wrong.</li></ul></section><section className="mt-12 border border-border p-5"><Eyebrow>Project</Eyebrow><h2 className="mt-3 font-display text-3xl">A test suite for your agent</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Golden cases, three kinds of grader, assertions on the trace, and a command that runs it all — then a change that makes it fail, on purpose.</p><Link href="/m/5/s/7" className="mt-5 inline-block font-mono text-[10px] uppercase tracking-[.16em] underline underline-offset-4">Open project →</Link></section></article> }

export function ModuleFiveLesson({ section = 1 }: { section?: number }) { const lesson = lessons[Math.max(0, Math.min(6, section - 1))]; return <article><LessonHeader eyebrow={`Module 05 · Section ${section} of 7`} meta={lesson.time}>{lesson.title}</LessonHeader><div className="mt-10 border border-border px-4 py-3"><Eyebrow>In one line</Eyebrow><p className="mt-2 text-lg leading-7">{lesson.line}</p></div><Figure caption={lesson.caption} library={lesson.node ? undefined : (section === 4 ? "agent-prism tree + a simple heat grid." : section === 5 ? "A simple function plot with a slider." : undefined)}>{lesson.node ?? <pre className="whitespace-pre-wrap p-5 font-mono text-xs leading-6 text-muted-foreground">{lesson.figure}</pre>}</Figure>{lesson.project && <section className="border border-border p-5"><Eyebrow>What you'll build</Eyebrow><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">{lesson.build?.map((item) => <li key={item}>{item}</li>)}</ul><p className="mt-5 text-sm leading-6 text-muted-foreground"><strong>What you'll have at the end</strong> — {lesson.end}</p></section>}<Prose>{lesson.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</Prose><aside className="mt-10 border border-border p-5"><Eyebrow>Key idea</Eyebrow><p className="mt-2 text-sm leading-6">{lesson.idea}</p></aside>{lesson.question && <MiniCheck lesson={lesson} />}<GoDeeper title={lesson.deeper} url={lesson.url} /><PrevNext prev={section > 1 ? `/m/5/s/${section - 1}` : "/m/5"} next={section < 7 ? `/m/5/s/${section + 1}` : "/m/6"} /></article> }

export { lessons as moduleFiveLessons }
