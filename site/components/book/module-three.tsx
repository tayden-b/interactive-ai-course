"use client"

import Link from "next/link"
import { useState } from "react"
import { Check, Eyebrow, Figure, LessonHeader, Prose } from "./reading-frame"
import { Fig03, Fig14 } from "@/components/figures/course-figures"
import {
  Code, Compare, Flow, KV, Mark, Stack, Steps, Table,
} from "@/components/figures/kit"
import { Line } from "@/components/figures/charts"
import { AgentLoopDiagram } from "@/components/reference/agent-loop-diagram"

/* ---------- typeset figures for the slots that are not drawings ---------- */

// 3.2 — a tool is three things. The model reads two of them; your code owns the third.
const fig32 = (
  <Compare
    left={{
      title: "The model reads",
      accent: true,
      children: (
        <Code lang="python" title="tool definition">{`
{
  "name": "get_weather",
  "description": (
    "Current conditions for a city. "
    "Use when the user asks about "
    "weather now, not forecasts."
  ),
  "input_schema": {
    "type": "object",
    "properties": {
      "city": {"type": "string"}
    }
  }
}`}</Code>
      ),
      note: "Name, description, schema — read the way the model reads everything else.",
    }}
    right={{
      title: "Your code runs",
      children: (
        <Code lang="python" title="tools.py">{`
def get_weather(city: str) -> str:
    # calls a weather API
    ...

# when the model asks for it, by name,
# with arguments in the schema's shape
if call.name == "get_weather":
    result = get_weather(**call.arguments)
`}</Code>
      ),
      note: "The function, and the code that runs it. The model never sees either.",
    }}
  />
)

// 3.5 — the window grows every turn; whole pages fill it fast.
const note35 =
  "Every result stays in the window for every later call. " +
  "Return the summary, not the page."
const fig35 = (
  <Line
    title="Window size per turn · k tokens · illustrative"
    series={[
      { name: "summaries", points: [2, 3, 4, 5, 6, 7, 8, 9], accent: true },
      { name: "whole pages", points: [2, 8, 14, 20, 26, 32], dashed: true },
    ]}
    xLabels={["1", "2", "3", "4", "5", "6", "7", "8"]}
    cap={32}
    capLabel="window fills"
    yMax={40}
    note={note35}
  />
)

// 3.6 — when it picks the wrong tool. Vague vs precise descriptions, then the three fixes.
const fig36 = (
  <Stack>
    <Compare
      left={{
        title: "Vague",
        children: (
          <KV rows={[
            { k: "search", v: "Searches." },
            { k: "read_file", v: "Reads a file." },
          ]} />
        ),
        note: "The two overlap. Asked about something in a file, the pick is a coin flip.",
      }}
      right={{
        title: "Precise",
        accent: true,
        children: (
          <KV rows={[
            { k: "search", v: "Web search for things that are not in the user's files. Do not use for questions about an uploaded file." },
            { k: "read_file", v: "Reads an uploaded file by path. Use for any question about the user's files." },
          ]} />
        ),
        note: "Each says when to use it — and when not to.",
      }}
    />
    <div>
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">Three fixes, in order</p>
      <Steps items={[
        { title: "Rewrite the descriptions", body: "Each one says when to use it and when not to." },
        { title: "Cut the tools this task doesn't need", body: "Or load them only when relevant. Thirty descriptions crowd each other, however good each one is." },
        { title: "Put the tricky cases in the system prompt", body: "“For questions about the uploaded file, use read_file, not search.”" },
      ]} />
    </div>
  </Stack>
)

// 3.7 — MCP, briefly. Host, client, server — and the loop underneath, unchanged.
const fig37 = (
  <Stack>
    <Flow items={[
      { label: "your agent", sub: "the host — it runs the loop" },
      { label: "client", sub: "speaks the protocol" },
      { label: "GitHub MCP server", sub: "publishes its tools: names, descriptions, schemas" },
    ]} />
    <Table
      head={["", "by hand (sections 2–3)", "with MCP"]}
      rows={[
        ["Descriptions", "you write them", "the server publishes them"],
        ["Schemas", "you write them", "the server publishes them"],
        ["The call", "structured output; your code runs the function", "structured output; the client passes it to the server"],
        ["The result", "a tool message in the window", "a tool message in the window"],
        ["The loop", "gather, decide, act, observe", <Mark>unchanged</Mark>],
      ]}
    />
  </Stack>
)

// 3.8 — the project. The run, then the trace that proves it.
const fig38 = (
  <Stack>
    <Flow items={[
      { label: "question", sub: "from you" },
      { label: "model call", sub: "decide" },
      { label: "now()", sub: "act — your code" },
      { label: "model call", sub: "decide" },
      { label: "search(query)", sub: "act — your code" },
      { label: "model call", sub: "decide" },
      { label: "reply", sub: "done" },
    ]} />
    <div>
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">Trace — the first three spans</p>
      <Table
        head={["span", "what happened", "recorded"]}
        accentCol={2}
        rows={[
          ["model call", "decided to call now()", "212 tokens"],
          ["now()", "your code ran it and appended the result", "84 ms"],
          ["model call", "saw the time; decided to call search(query)", "188 tokens"],
        ]}
      />
    </div>
  </Stack>
)

const lessons = [
  { node: <Fig03 />, title: "A model can't do anything", minutes: "5", line: "A model produces text; it cannot look anything up, run anything, or change anything — unless something around it does those things.", caption: "FIGURE 3.1.1 — The same model. One of them can check.", library: "A side-by-side transcript component.", figure: "NO TOOLS                              WITH A TOOL\nuser  What's the weather in Austin?     user  What's the weather in Austin?\nassistant  Austin is 84°F...             calling get_weather(city='Austin')\n                                         Result: 84°F, partly cloudy\n                                         assistant  It's 84°F and partly cloudy in Austin.", paragraphs: ["Module 1 ended with the model confidently inventing the weather. It wasn't being careless. It had no way to find out, and it has no way to find out anything — today's date, the contents of a file, the result of a calculation, the state of your calendar.", "A model is text in, text out. That's the whole thing. Everything an AI assistant does beyond producing text — searching, running code, sending an email — is done by ordinary software around the model, on the model's behalf.", "This module is about that software. Once you see where the line is, agents stop being mysterious. The model decides; your code does."], key: "Everything an agent does in the world is done by your code, at the model's request.", question: "Who runs a web search when an agent searches the web?", options: ["The model.", "Your code, because the model asked for it.", "The model provider's servers, automatically."], answers: ["The model can only produce text.", "Yes.", "Only if you set that up — and then it's still code, not the model."], deeper: "Karpathy's LLM OS sketch — the model as a CPU, tools as peripherals.", url: "https://www.youtube.com/watch?v=zjkBMFhNj_g" },
  { node: fig32, title: "A tool is three things", minutes: "7", line: "A tool is a name and description the model reads, a schema for its arguments, and a function your code runs.", caption: "FIGURE 3.2.1 — The model sees the top two. Your code owns the third.", library: "A three-band tool card.", figure: "DESCRIPTION   get_weather — current weather for a city\nSCHEMA        { city: string }\nFUNCTION      calls a weather API\n\nDESCRIPTION + SCHEMA  →  MODEL\nFUNCTION               →  YOUR CODE", paragraphs: ["To give the model a tool, you don't give it the tool. You give it a description of the tool.", "A tool has three parts. The name and description tell the model what it's for — in plain words, because the model reads them the way it reads everything else. The schema says what arguments it takes and what type each one is. And the function is the code that actually does the thing. The model sees the first two. Only your code ever touches the third.", "When the model decides a tool would help, it produces a small structured message: the tool's name and the arguments, in the shape the schema asked for. That's Module 2, Section 4 — structured output — doing its most important job.", "Write descriptions for a smart colleague who's never seen your system. 'Gets weather' is too thin. 'Current conditions for a city; use when the user asks about weather now, not forecasts' tells the model when to reach for it and when not to."], key: "The model chooses tools by reading their descriptions; a tool call is structured output.", question: "What does the model actually receive about a tool?", options: ["The code.", "The description and the argument schema.", "Nothing — it figures tools out."], answers: ["Never. It sees the description and schema.", "Yes.", "It can only pick what it's told about."], deeper: "Anthropic, Building effective agents — the section on tool design.", url: "https://www.anthropic.com/research/building-effective-agents" },
  { node: <Fig14 />, title: "The round trip", minutes: "7", line: "The model asks for a tool, your code runs it and sends the result back as a message, and the model continues with that result in view.", caption: "FIGURE 3.3.1 — One tool use is two messages and a function call in between.", library: "A sequence-of-cards component.", figure: "user: What's the weather in Austin?  →  assistant: [tool call] get_weather(city: Austin)\n                                      →  tool: 84°F, partly cloudy\n                                      →  assistant: It's 84°F and partly cloudy in Austin.\n                                      [ your code ran here ]", paragraphs: ["Here is exactly what happens when a tool gets used. You send the conversation plus the list of tools. Instead of a normal reply, the model sends back a tool call: the tool's name and arguments. Your code sees that, runs the function, and adds the result to the conversation as a new message with the role tool. Then you call the model again.", "Now the model sees the user's question, its own request, and the answer to that request. It produces a reply that uses the result. Two calls to the model, one function call in between, and the conversation got two messages longer.", "Notice what you didn't do. You didn't parse the model's prose for a city name. You didn't guess when it wanted weather. The structured tool call told you exactly what to run and with what. That's the payoff of Module 2.", "Notice also that the tool result is just a message in the window. The model doesn't know the weather now. It can see a message that says what the weather is."], key: "A tool use is a round trip: tool call out, tool result in, then the model continues.", question: "After your code runs the tool, what do you do with the result?", options: ["Show it to the user.", "Add it to the conversation as a tool message and call the model again.", "Store it for later."], answers: ["Not yet — the model hasn't used it.", "Yes.", "It needs to be in the window now."], deeper: "Hugging Face Agents Course, Thought–Action–Observation.", url: "https://huggingface.co/learn/agents-course/unit1/agent-steps-and-structure" },
  { node: <div className="carbon-scope"><AgentLoopDiagram /></div>, title: "The loop", minutes: "8", line: "An agent is the round trip run repeatedly — gather, decide, act, observe — until the model decides it's done.", caption: "FIGURE 3.4.1 — The loop, with a way out.", library: "A stepped state-machine component with a log.", figure: "              GATHER\n          ↗             ↘\n     OBSERVE  ←  ACT  ←  DECIDE  →  done → REPLY\n\ntrace: decide: call get_weather\n       act: 84°F, partly cloudy\n       decide: reply", paragraphs: ["Put a loop around Section 3 and you have an agent.", "Gather: assemble what the model needs to see — the conversation, the tools, any results so far. Decide: call the model; it either requests a tool or writes a reply. Act: if it requested a tool, run it. Observe: add the result to the conversation. Go back to Gather.", "The loop stops when Decide produces a reply instead of a tool call. That's it. The model decides when it's done, and your code respects that — with a safety cap on the number of turns, because Module 6 will show you what happens without one.", "Everything that gets called an agent is some version of this loop. Fancier ones add planning, memory, and more tools. The skeleton is four verbs and an exit."], key: "Agent = a loop of gather, decide, act, observe; the model chooses when it ends.", question: "When does the loop stop?", options: ["After a fixed number of tool calls.", "When the model replies with text instead of a tool call.", "When the user says stop."], answers: ["That's the safety cap, not the normal exit.", "Yes.", "The user isn't in the loop."], deeper: "Thorsten Ball, How to build an agent — the loop in about 90 lines.", url: "https://ampcode.com/how-to-build-an-agent" },
  { node: fig35, title: "The window is the loop variable", minutes: "6", line: "Every turn of the loop, the whole conversation — including every tool result — goes back into the window; the window is the agent's working memory.", caption: "FIGURE 3.5.1 — The result goes back on the stack, and the stack is what the model sees.", library: "The 12-factor agent loop animation.", figure: "                         DECIDE\n                           ↑\nreply ← result ← tool call ← user\n  [ context window fills as every message returns ]", paragraphs: ["There's no hidden state in an agent. What the model knows on turn five is exactly what's in the conversation on turn five: the original request, every tool it called, every result that came back. Your code gathers that and sends it, every time.", "That makes the context window the loop's variable. It grows with every tool result, and a big tool result — a whole web page, a long file — grows it fast. When it fills, the earliest parts fall out, and the agent starts to forget what it was doing.", "This is why agents that work for three steps fail at thirty. Module 4 is about managing the window on purpose. For now, the habit to form is: keep tool results small. Return the summary, not the page."], key: "The conversation is the agent's only memory; every result you add is a cost against the window.", question: "Where does an agent remember a tool result from two turns ago?", options: ["In a variable your code keeps.", "In the conversation, which is re-sent every turn.", "In the model's weights."], answers: ["Your code re-sends it, but the model reads it from the window.", "Yes.", "The weights don't change at all during use."], deeper: "12-factor agents, Factor 3: Own your context window.", url: "https://github.com/humanlayer/12-factor-agents" },
  { node: fig36, title: "When it picks the wrong tool", minutes: "7", line: "Most wrong tool calls come from unclear descriptions or too many tools, not from a dumb model.", caption: "FIGURE 3.6.1 — Clearer descriptions, fewer tools.", library: "Two simple controlled charts.", figure: "VAGUE  ───────────────→  PRECISE\ncorrect pick rate  ▂▃▅▆▇\n\nnumber of tools: 3 ─────────→ 30\ncorrect pick rate:  ▇▇▆▅▃▂", paragraphs: ["Give an agent a search tool and a file reader, ask it about something in a file, and sometimes it searches the web instead. It's tempting to blame the model. Usually the description is to blame.", "The model picks tools the way it does everything: by predicting the most likely next thing given what it can see. If two descriptions overlap, or one is vague, the pick is a coin flip. If there are thirty tools, the descriptions crowd each other and accuracy drops no matter how good each one is.", "Three fixes, in order. Rewrite the descriptions so each says when to use it and when not to. Cut tools that aren't needed for this task — or load them only when relevant. And give examples in the system prompt of the tricky cases: 'for questions about the uploaded file, use read_file, not search.'", "When those don't work, the fix is usually not a bigger model. It's a narrower job."], key: "Tool choice is prediction; make the right choice the obvious one.", question: "An agent keeps searching the web for things that are in a local file. First fix?", options: ["Use a smarter model.", "Make the descriptions say when to use each tool.", "Remove the search tool."], answers: ["Try the cheap fix first.", "Yes.", "Maybe — but first make the choice clear."], deeper: "Learn AI Visually, Tool use — the vague/precise toggle and tool-count dial.", url: "https://learnaivisually.com/tracks/ai-agents/tool-use" },
  { node: fig37, title: "MCP, briefly", minutes: "5", line: "MCP is a standard way for tools to describe themselves so any agent can use them without custom wiring.", caption: "FIGURE 3.7.1 — Tools that describe themselves.", figure: "YOUR AGENT (HOST)  ↔  CLIENT  ↔  MCP SERVER\n                                      ↓\n                         GitHub tool list → agent", paragraphs: ["So far you've written every tool by hand: description, schema, function. That doesn't scale to the hundreds of services an agent might want. The Model Context Protocol is an agreement on how a service can publish its tools — names, descriptions, schemas — so any agent that speaks the protocol can list them and call them.", "Practically: instead of writing a GitHub tool, you connect to a GitHub MCP server and your agent gets its tools. Under the hood it's exactly Section 2 and Section 3 — descriptions in, structured calls out, results back. MCP just standardizes the plumbing.", "Worth knowing, not worth dwelling on. The concepts in this module are the thing; MCP is one way to ship them."], key: "MCP standardizes how tools are described and called; the loop underneath is unchanged.", question: "What does MCP change about the agent loop?", options: ["The model runs tools directly.", "Nothing in the loop — only how tools are published and connected.", "It removes the need for descriptions."], answers: ["Never. Your side still runs them.", "Yes.", "The server provides them; the model still reads them."], deeper: "The Model Context Protocol specification and introduction.", url: "https://modelcontextprotocol.io/" },
  { node: fig38, title: "Project: an agent that can look things up", minutes: "40", line: "Build a small agent with three tools and a loop, and record every step it takes.", caption: "FIGURE 3.8.1 — Your agent, every step of it.", library: "A trace tree and waterfall component.", figure: "YOUR RUN\nquestion → model call → now() → model call → search(query) → model call → reply\n\ntrace tree   model-call  ─────────  212 tokens\n             tool         ───        84ms\n             model-call  ─────────  188 tokens", project: true, paragraphs: ["This is the module's whole point made concrete: the model decides, your code does, and the trace proves it.", "Build the loop before the tools. Run it with zero tools and watch it just reply. Add the clock. Watch it call the clock. Then add the others.", "Build steps arriving with the lab."], key: "You've built an agent, and you can see inside it.", deeper: "CodeCrafters, Build your own Claude Code — the same loop as a test-driven challenge.", url: "https://app.codecrafters.io/courses/claude-code/overview" },
]

function MiniCheck({ lesson }: { lesson: typeof lessons[number] }) { const [selected, setSelected] = useState<number | null>(null); return <Check><span className="block">{lesson.question}</span>{lesson.options && <span className="mt-3 grid gap-2">{lesson.options.map((option, i) => <button key={option} onClick={() => setSelected(i)} className={`block w-full border px-3 py-3 text-left text-sm ${selected === i ? "border-foreground" : "border-border"}`}><span className="mr-2 font-mono text-[10px]">{String.fromCharCode(65 + i)}</span>{option}</button>)}</span>}{selected !== null && <span className="mt-4 block border-t border-border pt-4 text-muted-foreground">{lesson.answers?.[selected]}</span>}</Check> }

export function ModuleThreeHome() { return <article><Eyebrow>Modules / 03</Eyebrow><h1 className="mt-5 font-display text-6xl">Tools and the agent loop</h1><p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground">A model can only produce text. This module is about giving it hands: describing a tool, letting the model ask for it, running it yourself, and sending the result back — then doing that in a loop until the job is done. By the end, you'll have built one and watched every step of it.</p><section className="mt-10 border-t border-border pt-6"><Eyebrow>What you'll be able to do</Eyebrow><ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground"><li>Explain what a tool is and who actually runs it.</li><li>Draw the loop — gather, decide, act, observe — and say when it stops.</li><li>Diagnose the most common reason an agent picks the wrong tool.</li></ul></section><section className="mt-12 border border-border p-5"><Eyebrow>Project</Eyebrow><h2 className="mt-3 font-display text-3xl">An agent that can look things up</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">A small agent with three tools — a clock, a search, and a file reader — that answers questions it couldn't answer alone, with every step recorded.</p><Link href="/m/3/s/8" className="mt-5 inline-block font-mono text-[10px] uppercase tracking-[.16em] underline underline-offset-4">Open project →</Link></section></article> }

export function ModuleThreeLesson({ section = 1 }: { section?: number }) { const lesson = lessons[section - 1] ?? lessons[0]; const isProject = Boolean(lesson.project); return <article><LessonHeader eyebrow={`Module 03 · Section ${section} of 8`} meta={`~${lesson.minutes} min`}>{lesson.title}</LessonHeader><div className="mt-10 border border-border px-4 py-3"><Eyebrow>In one line</Eyebrow><p className="mt-2 text-lg leading-7">{lesson.line}</p></div><Figure caption={lesson.caption} library={lesson.node ? "" : lesson.library}>{lesson.node ?? <pre className="whitespace-pre-wrap p-5 font-mono text-xs leading-6 text-muted-foreground">{lesson.figure}</pre>}</Figure>{isProject && <section className="border border-border p-5"><Eyebrow>What you'll build</Eyebrow><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground"><li>Three tools: now(), search(query), and read_file(path).</li><li>Descriptions that say when to use each tool and when not to.</li><li>The gather–decide–act–observe loop with a turn cap of ten.</li><li>Tracing on every model call and tool call, written to your traces folder.</li><li>A run against five questions the model can't answer alone.</li></ul><p className="mt-5 text-sm leading-6 text-muted-foreground"><span className="font-mono text-[10px] uppercase tracking-[.16em]">What you'll have at the end — </span>A working agent, and a trace you can read that shows exactly why it did what it did.</p></section>}<Prose>{lesson.paragraphs.map((p) => <p key={p}>{p}</p>)}</Prose><aside className="mt-10 border border-border p-5"><Eyebrow>Key idea</Eyebrow><p className="mt-2 text-sm leading-6">{lesson.key}</p></aside>{!isProject && <MiniCheck lesson={lesson} />}<details className="mt-8 border-y border-border py-4"><summary className="cursor-pointer font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">Go deeper — {lesson.deeper}</summary><p className="mt-4 text-sm leading-6 text-muted-foreground"><a className="underline underline-offset-4" href={lesson.url} target="_blank" rel="noreferrer">Open resource →</a></p></details><div className="mt-12 flex items-center justify-between border-t border-border pt-6 font-mono text-[10px]"><Link href={section > 1 ? `/m/3/s/${section - 1}` : "/m/3"}>← Previous</Link><Link className="text-foreground" href={section < 8 ? `/m/3/s/${section + 1}` : "/m/4"}>Next →</Link></div></article> }
