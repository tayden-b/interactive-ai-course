"use client"

import Link from "next/link"
import { useState } from "react"
import { Check, Eyebrow, Figure, LessonHeader, Prose } from "./reading-frame"
import { GoDeeper } from "@/components/figures/resource"
import { Fig05, Fig12, Fig13 } from "@/components/figures/course-figures"
import { Flow, KV, Stack, Steps, Table } from "@/components/figures/kit"
import { Bars, Line, Stacked } from "@/components/figures/charts"

const S1_NOTE =
  "The turn being answered is a sliver; everything else is what your code " +
  "put there — and attention is spread thinner across all of it."
const S5_NOTE =
  "Poisoned, distracted, confused, conflicted: four ways the contents pull " +
  "the line down. None of them is fixed by a bigger window."
const S6_NOTE =
  "Descriptions for every tool crowd the window and cost tokens; load only " +
  "the ones this task could need."

const lessons = [
  { node: (
      <Stack>
        <Stacked title="one window, many tenants · illustrative" note={S1_NOTE}
          segments={[
            { label: "system", value: 10 },
            { label: "tools", value: 14 },
            { label: "older turns", value: 34 },
            { label: "recent", value: 14 },
            { label: "tool results", value: 22 },
            { label: "message", value: 6, accent: true },
          ]} />
        <KV rows={[
          { k: "system prompt", v: "Who it is and how to behave." },
          { k: "tools", v: "The descriptions of everything it can call." },
          { k: "older turns", v: "Everything said earlier in this conversation." },
          { k: "recent turns", v: "The last few exchanges — where the work is." },
          { k: "tool results", v: "What each call returned." },
          { k: "this message", v: "The turn being answered." },
        ]} />
      </Stack>
    ), title: "The window is all it has", minutes: "6", line: "An agent's memory is whatever is in the context window right now; everything else has to be put there on purpose.", figure: "SYSTEM PROMPT · TOOLS · OLDER TURNS\nRECENT TURNS · TOOL RESULTS · THIS MESSAGE\n\n                 attention\n       finite — more tokens means thinner attention", caption: "FIGURE 4.1.1 — One window, many tenants.", library: "Anthropic's attention budget framing.", paragraphs: ["Module 3 ended with an uncomfortable fact: an agent has no memory except the conversation it's handed each turn. This module takes that seriously.", "Think of the window as a budget, not a bucket. It has a hard size, but well before it's full, a second limit bites: the model's attention is spread across everything in the window, and more tokens means each one gets less. Long windows don't just risk forgetting; they make the model vaguer about all of it.", "So memory for an agent is two jobs. Short-term: keep the live transcript small enough that the model stays sharp. Long-term: keep what matters somewhere else — notes, files, a database — and bring it back into the window only when needed. The sections that follow are those two jobs."], key: "The window is a budget; good memory is deciding what's in it right now.", question: "An agent's memory between turns is…", options: ["Stored inside the model.", "Whatever your code puts in the window this turn.", "Everything it has ever seen."], answers: ["The model stores nothing during use.", "Yes.", "Only what fits, and only what you send."], deeper: "Anthropic, Effective context engineering for AI agents.", url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents" },
  { node: <Fig13 />, title: "Short-term memory: the transcript", minutes: "7", line: "When the transcript gets long, replace the older part with a summary the model wrote, and keep the recent part verbatim.", figure: "NAIVE                 WITH SUMMARIES\nturns fill → quality ↓   older turns → SUMMARY\n████████████            ████  recent turns\n                         quality holds", caption: "FIGURE 4.2.1 — Compaction: trade detail for room.", library: "Learnaivisually context-module fill-bar pattern.", paragraphs: ["The transcript is short-term memory, and it grows every turn. Left alone, it fills the window and the agent gets worse. The fix is simple and slightly uncomfortable: throw detail away on purpose.", "When the transcript passes a threshold — say two-thirds of the window — ask the model to summarize the older part: what the task is, what's been decided, what's still open, what the important results were. Replace the old turns with that summary. Keep the most recent turns exactly as they were, because that's where the model needs precision.", "What you lose is detail the agent probably didn't need. What you keep is the thread. The summary prompt matters: ask for decisions, open questions, and facts to remember, not a narrative.", "This is called compaction, and every long-running agent does some version of it."], key: "Summarize the old, keep the recent; a smaller window with the thread intact beats a full one.", question: "When compacting, which part do you keep word-for-word?", options: ["The oldest turns, for history.", "The most recent turns.", "The tool results."], answers: ["History goes in the summary.", "Yes — precision where the work is.", "Summarize the big ones."], deeper: "Learn AI Visually, Context engineering.", url: "https://learnaivisually.com/tracks/ai-agents/context-engineering" },
  { node: <Fig05 />, title: "Long-term memory: notes and files", minutes: "7", line: "Give the agent a place to write things down — a file it owns — and it can remember across conversations.", figure: "AGENT  ── write (after each task) ──→  notes.md\nAGENT  ←─ read (at the start) ───────  notes.md\n\n2026-08-22  preference\n2026-08-22  decision\n2026-08-22  fact learned", caption: "FIGURE 4.3.1 — Memory that survives the window: a file.", paragraphs: ["Short-term memory dies with the conversation. For anything that should last — a user's preferences, a decision made last week, a fact learned the hard way — the agent needs to write it somewhere outside the window.", "The simplest version is a file. Give the agent a tool to append a note, and a rule in the system prompt about what deserves one. At the start of each run, put the file's contents (or the relevant part) into the window. That's long-term memory: externalized, explicit, and readable by you.", "Two rules keep it useful. Notes should be short and structured — what, when, why — so they stay cheap to load. And the agent should be told to update and remove notes, not only add them, or the file becomes a second transcript.", "It's worth noticing how unglamorous this is. The most effective agent memory in use today is a markdown file the agent maintains."], key: "Long-term memory is something the agent writes down and reads back; a file is enough to start.", question: "Where should a user's standing preference live?", options: ["In the transcript.", "In a note the agent writes and reloads.", "In the model."], answers: ["It dies with the conversation.", "Yes.", "The model can't be changed by a conversation."], deeper: "Anthropic, Building agents with the Claude Agent SDK.", url: "https://claude.com/blog/building-agents-with-the-claude-agent-sdk" },
  { node: <Fig12 />, title: "Retrieval", minutes: "8", line: "When there's more than fits in the window, find the few relevant pieces and put only those in; that search is retrieval.", figure: "QUESTION → [document chunks] → WINDOW\n             ●  ●  ●\n       most similar = closest in meaning\n\nquestion + the three relevant chunks", caption: "FIGURE 4.4.1 — Don't load the library; load the three pages that matter.", library: "Embedding-space scatter with nearest-neighbor highlighting.", paragraphs: ["A notes file works until it's bigger than the window. A company's documents, a year of emails, a codebase — none of that fits. You need to find the right part first.", "Retrieval is that search. Split the material into chunks. Turn each chunk into a list of numbers that captures its meaning — an embedding — and store them. When a question comes in, embed it the same way, find the chunks whose numbers are closest, and put those chunks into the window with the question. The model answers from what it can now see.", "This pattern has a name, retrieval-augmented generation, and a great deal of tooling. The idea underneath is one sentence: search first, then ask.", "Retrieval isn't magic. If the search returns the wrong chunks, the model answers confidently from the wrong material. Module 5 is where you learn to check that."], key: "Retrieval puts the relevant few into the window; the model can only use what's in front of it.", question: "Why not put all the documents in the window?", options: ["It costs too much.", "They don't fit, and attention thins anyway.", "The model would memorize them."], answers: ["True, but not the main reason.", "Yes.", "It memorizes nothing."], deeper: "A Visual Guide to LLM Agents, Long-Term Memory.", url: "https://newsletter.maartengrootendorst.com/p/a-visual-guide-to-llm-agents" },
  { node: (
      <Stack>
        <Line title="quality as the window fills · illustrative" note={S5_NOTE}
          xLabels={["empty", "", "half full", "", "full"]} yMax={100}
          series={[
            { name: "clean", points: [92, 91, 89, 86, 82] },
            { name: "rotted", points: [92, 88, 76, 58, 36], accent: true },
          ]} />
        <Table head={["failure", "what's in the window", "what the model does", "the fix"]} rows={[
          ["Poisoning", "A wrong tool result or a hallucinated fact.", "Treats it as true from then on.", "Validate what goes in."],
          ["Distraction", "Too much history.", "Repeats past actions instead of choosing new ones.", "Compact what's old."],
          ["Confusion", "Tools and documents that aren't relevant to this task.", "Gets pulled sideways.", "Load only what's relevant."],
          ["Conflict", "An old instruction and a new one that disagree.", "Splits the difference.", "Replace instead of appending."],
        ]} />
      </Stack>
    ), title: "Context rot", minutes: "7", line: "A window can go wrong in four ways — poisoned, distracted, confused, conflicted — and each has a different fix.", figure: "POISONING  wrong fact → validate results\nDISTRACTION  too much history → compact\nCONFUSION  irrelevant tools → load less\nCONFLICT  disagreement → resolve, don't append", caption: "FIGURE 4.5.1 — Four ways a full window fails.", paragraphs: ["Agents don't usually fail because the window is full. They fail because of what's in it.", "Poisoning: a wrong tool result or hallucinated fact lands in the window, and every later turn treats it as true. Distraction: the history is so long that the model starts repeating past actions instead of choosing new ones. Confusion: tools and documents that aren't relevant to this task are in the window anyway, and they pull the answer sideways. Conflict: two parts of the window say different things — an old instruction and a new one — and the model splits the difference.", "Each has its own fix, and none of them is \"a bigger window.\" Validate what goes in. Compact what's old. Load only what's relevant. Replace instead of appending when something changes."], key: "Diagnose which kind of rot you have; the fix follows from the name.", question: "An agent keeps re-running a search it already ran. Which failure is that?", options: ["Poisoning.", "Distraction — too much history.", "Conflict."], answers: ["That's a wrong fact being trusted.", "Yes; compact it.", "That's two instructions disagreeing."], deeper: "Drew Breunig, How long contexts fail.", url: "https://www.dbreunig.com/2025/06/22/how-contexts-fail-and-how-to-fix-them.html" },
  { node: (
      <Stack>
        <Flow items={[
          { label: "system · tools · notes · docs · history",
            sub: "everything that could go in" },
          { label: "curate, every turn", sub: "your code decides" },
          { label: "small, ordered window", sub: "what the model sees" },
        ]} />
        <KV rows={[
          { k: "system", v: "Stable things first." },
          { k: "tools",
            v: "Descriptions only for the tools this task could need." },
          { k: "docs", v: "Retrieved just in time, not all up front." },
          { k: "tool results", v: "Kept short." },
          { k: "history", v: "Compacted when the transcript is long." },
          { k: "notes", v: "Written for what should outlive the run." },
        ]} />
        <Bars title="tool descriptions in the window · tokens" note={S6_NOTE}
          height={200} data={[
            { label: "all tools loaded", value: 9800, display: "9,800" },
            { label: "relevant tools only", value: 1550, display: "1,550",
              accent: true },
          ]} />
      </Stack>
    ), title: "Context engineering", minutes: "8", line: "Decide, on purpose, what goes in the window each turn: the right instructions, the right tools, the right facts, at the right time.", figure: "SYSTEM · TOOLS · NOTES · DOCS · HISTORY\n                 ↓\n             CURATE, EVERY TURN\n                 ↓\n        SMALL, ORDERED WINDOW\n\nload all tools: 9,800 tokens ↔ relevant: 1,550", caption: "FIGURE 4.6.1 — The window is assembled, not accumulated.", paragraphs: ["Everything in this module adds up to one practice. Instead of letting the window accumulate — every tool, every turn, every document, appended forever — you assemble it. Every turn, your code decides what the model should see.", "Some of that is rules of thumb. Put the stable things first. Load tool descriptions only for the tools this task could need. Retrieve documents just in time, not all up front. Keep tool results short. Compact when the transcript is long. Write notes for what should outlive the run.", "Some of it is structure. For a big job, don't give one agent one enormous window; give several agents their own small windows and have a lead agent coordinate — each one sees only its part. That's Module 7.", "The name for this practice is context engineering, and it's most of what separates an agent that works in a demo from one that works on a Tuesday."], key: "Assemble the window deliberately each turn; context engineering is the craft of what the model sees.", question: "The best default for tool descriptions is to…", options: ["Load all of them, so the model has options.", "Load the ones this task could need.", "Load none and let the model ask."], answers: ["They crowd each other and cost tokens.", "Yes.", "It can't ask for what it can't see."], deeper: "Anthropic, Effective context engineering for AI agents.", url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents" },
  { node: (
      <Stack>
        <Flow items={[
          { label: "window fills", sub: "turn by turn" },
          { label: "compaction", sub: "past the threshold" },
          { label: "window drops", sub: "thread intact" },
        ]} />
        <Steps accent={2} items={[
          { title: "Start with the notes file alone", body: <>A <code className="font-mono text-[12px]">remember(note)</code> tool, a rule for when to use it, and a <code className="font-mono text-[12px]">notes.md</code> the agent reads at the start and maintains.</> },
          { title: "Add compaction", body: "When the transcript passes the threshold, summarize the older part and keep the recent turns verbatim. Watch the window drop in the trace." },
          { title: "Add retrieval last", body: "Only when the notes outgrow the window: find the relevant notes and load just those." },
        ]} />
      </Stack>
    ), title: "Project: an agent that remembers", minutes: "40", line: "Give your Module 3 agent notes it writes for itself, a summary step when the transcript gets long, and a retrieval step that finds the right note.", figure: "YOUR RUN: window fills → COMPACTION → window drops\n\nnotes.md\n────────────\npreference\ndecision\nFACT RETRIEVED  ← highlighted", caption: "FIGURE 4.7.1 — Your agent, remembering.", library: "Context-bar component fed from traces.", project: true, paragraphs: ["Memory is where agents quietly get good or quietly get worse. You'll be able to see which, turn by turn.", "Start with the notes file alone. Then add compaction and watch the window drop. Add retrieval last, and only when the notes outgrow the window.", "Build steps arriving with the lab."], key: "You've built the two kinds of memory, and you can watch the window stay within budget.", deeper: "12-factor agents, Factors 3 and 5.", url: "https://github.com/humanlayer/12-factor-agents" },
]

function MiniCheck({ lesson }: { lesson: typeof lessons[number] }) { const [selected, setSelected] = useState<number | null>(null); return <Check><span className="block">{lesson.question}</span><span className="mt-3 grid gap-2">{lesson.options?.map((option, i) => <button key={option} onClick={() => setSelected(i)} className={`block w-full border px-3 py-3 text-left text-sm ${selected === i ? "border-foreground" : "border-border"}`}><span className="mr-2 font-mono text-[10px]">{String.fromCharCode(65 + i)}</span>{option}</button>)}</span>{selected !== null && <span className="mt-4 block border-t border-border pt-4 text-muted-foreground">{lesson.answers?.[selected]}</span>}</Check> }


export function ModuleFourLesson({ section = 1 }: { section?: number }) { const lesson = lessons[section - 1] ?? lessons[0]; const isProject = Boolean(lesson.project); return <article><LessonHeader eyebrow={`Module 04 · Section ${section} of 7`} meta={`~${lesson.minutes} min`}>{lesson.title}</LessonHeader><div className="mt-10 border border-border px-4 py-3"><Eyebrow>In one line</Eyebrow><p className="mt-2 text-lg leading-7">{lesson.line}</p></div><Figure caption={lesson.caption} library={lesson.node ? "" : lesson.library}>{lesson.node ?? <pre className="whitespace-pre-wrap p-5 font-mono text-xs leading-6 text-muted-foreground">{lesson.figure}</pre>}</Figure>{isProject && <section className="border border-border p-5"><Eyebrow>What you'll build</Eyebrow><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground"><li>A remember(note) tool and a rule for when to use it.</li><li>A notes.md the agent reads at start and maintains.</li><li>Compaction when the transcript passes a threshold.</li><li>Retrieval that loads only the most relevant notes.</li><li>Traces showing window size per turn.</li></ul><p className="mt-5 text-sm leading-6 text-muted-foreground"><span className="font-mono text-[10px] uppercase tracking-[.16em]">What you'll have at the end — </span>An agent that remembers preferences from last week and stays sharp through a long conversation.</p></section>}<Prose>{lesson.paragraphs.map((p) => <p key={p}>{p}</p>)}</Prose><aside className="mt-10 border border-border p-5"><Eyebrow>Key idea</Eyebrow><p className="mt-2 text-sm leading-6">{lesson.key}</p></aside>{!isProject && <MiniCheck lesson={lesson} />}<GoDeeper title={lesson.deeper} url={lesson.url} /><div className="mt-12 flex items-center justify-between border-t border-border pt-6 font-mono text-[10px]"><Link href={section > 1 ? `/m/4/s/${section - 1}` : "/m/4"}>← Previous</Link><Link className="text-foreground" href={section < 7 ? `/m/4/s/${section + 1}` : "/m/5"}>Next →</Link></div></article> }
