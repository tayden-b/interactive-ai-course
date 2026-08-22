"use client"

import Link from "next/link"
import { useState } from "react"
import { Check, Eyebrow, Figure, LessonHeader, Prose } from "./reading-frame"
import { Code, Transcript, Compare, Flow, KV, Stack } from "@/components/figures/kit"
import { Bars, Timeline } from "@/components/figures/charts"

const lessons = [
  {
    title: "The API: a model you call from code", minutes: "7", line: "From your code, a model is a function: you send a list of messages and a model name, you get a message back.", caption: "FIGURE 2.1.1 — Everything you send, and everything you get back.", library: "A static code-card component.", figure: "request  model: \"…\"  messages: [{role: \"system\", …}, {role: \"user\", …}]  temperature: 0.7     HTTPS     response  message: {role: \"assistant\", content: \"…\"}  usage: {input_tokens: 212, output_tokens: 48}",
    node: <Stack>
      <Code lang="json" title="request · sent over https" mark={[3]}>{`
{
  "model": "…",
  "messages": [
    { "role": "system", "content": "…" },
    { "role": "user",   "content": "…" }
  ],
  "temperature": 0.7
}`}</Code>
      <Code lang="json" title="response · one new message, tokens counted">{`
{
  "message": { "role": "assistant", "content": "…" },
  "usage":   { "input_tokens": 212, "output_tokens": 48 }
}`}</Code>
    </Stack>,
    paragraphs: ["When you use a chat app, something is calling the model for you. When you write code, you make that call yourself. It's simpler than it sounds.", "You send a request over the internet to the model provider. The request has three important parts: which model you want, the list of messages so far (Module 1, Section 8), and a few settings like temperature. The provider runs the model and sends back one new message — the assistant's reply — plus a count of the tokens you used.", "That's the whole interface. Every chatbot, every agent, every product built on these models is doing this one thing, repeatedly, with different messages.", "Two practical details. You need an API key — a secret string that identifies your account and bills your usage; keep it out of your code and out of Git. And the reply comes back as data, not as a chat bubble, so your program can read it, check it, and do something with it. That last part is the point of this module."], key: "A model is a function you call: messages in, one message out, tokens counted.", question: "What do you send when you call a model?", options: ["The whole conversation, the model name, and settings.", "Just your latest message.", "Your API key and a question."], answers: ["Yes — the model sees only what's in the request.", "Then it would have no memory at all. The whole transcript goes every time.", "The key identifies you; the request still needs the messages."], deeper: "Anthropic's Messages API quickstart", url: "https://docs.anthropic.com/en/api/messages" },
  {
    title: "The system prompt", minutes: "6", line: "The system prompt is the standing instruction at the top of every request; it's where you tell the model who it is and how to behave.", caption: "FIGURE 2.2.1 — The system prompt: role, rules, format.", figure: "SYSTEM\nrole: You are a meeting assistant…\nrules: Only use information from the notes. If unsure, say so.\nformat: Reply in plain sentences, no bullet points.",
    node: <Stack>
      <Code lang="python" title="system prompt" mark={[5]}>{`
SYSTEM = (
    # role
    "You are a meeting assistant. "
    # rules
    "Only use information from the notes. If unsure, say so. "
    # format
    "Reply in plain sentences, no bullet points."
)`}</Code>
      <KV rows={[
        { k: "role", v: "What the model is in this conversation." },
        { k: "rules", v: "What it must and must not do." },
        { k: "format", v: "How the reply should look." },
      ]} />
    </Stack>,
    paragraphs: ["In Module 1 you saw that most chat apps put a message at the top of the transcript that the user never wrote. That's the system prompt, and when you call the model yourself, you write it.", "It does three jobs. It sets the role — what the model is in this conversation. It sets the rules — what it must and must not do. And it sets the format — how the reply should look. A good system prompt is specific about all three and short about everything else.", "Two mistakes are common. The first is making it vague (\"be helpful\") and hoping. The second is making it a wall of rules the model can't hold all at once. The useful middle is a paragraph or two that reads like a brief to a capable new colleague: here's your job, here's what matters, here's how I want the output.", "One more thing worth knowing: the system prompt is just tokens in the window. The model isn't bound by it the way a program is bound by code. It's strongly influenced, which is usually enough — and Module 6 is about the cases where it isn't."], key: "The system prompt is a brief, not a law: role, rules, format, kept specific and short.", question: "A system prompt says \"be helpful and accurate.\" What's missing?", options: ["Nothing — that's the standard.", "A role, concrete rules, and a format.", "Legal language so the model is bound."], answers: ["It's vague. The model has no role, no rules, no format.", "Yes.", "Nothing binds it. Specificity helps; legal language doesn't."], deeper: "Effective context engineering for AI agents", url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents" },
  {
    title: "Show, don't tell: examples", minutes: "6", line: "A few examples of the output you want, placed in the prompt, usually beat a paragraph describing it.", caption: "FIGURE 2.3.1 — Two examples do what three paragraphs can't.", figure: "TELLING: a long instruction paragraph\n\nSHOWING: instruction → input → output\n          input → output ✓\n          real input",
    node: <Compare
      left={{ title: "Telling", children: <Transcript turns={[
        { role: "system", text: <em>A long paragraph describing the output you want.</em> },
        { role: "user", text: <em>The real input.</em> },
      ]} />, note: "the model has to guess the shape from a description" }}
      right={{ title: "Showing", accent: true, children: <Transcript turns={[
        { role: "system", text: <em>One short instruction.</em> },
        { role: "user", text: <em>An example input.</em> },
        { role: "assistant", text: <em>The output, in exactly the shape you want.</em> },
        { role: "user", text: <em>A second example — the tricky case.</em> },
        { role: "assistant", text: <em>Its output, in the same shape.</em> },
        { role: "user", text: <em>The real input.</em> },
      ]} />, note: "the model continues the pattern" }}
    />,
    paragraphs: ["Models are very good at continuing patterns. If you show two examples of exactly what you want — input, then the output in the shape you want — the model will usually produce a third in the same shape. This is called few-shot prompting, and it's the single most reliable trick in this module.", "It works because of Module 1: the model is predicting what comes next. If what came before is a clear pattern, the most likely continuation is more of that pattern.", "Three rules of thumb. Use real examples, not toy ones — the model copies the style of what it sees. Cover the tricky case, not only the easy one; if short inputs sometimes produce empty output, show one. And keep the examples close to the real input in the prompt, so they're the freshest thing the model has seen."], key: "The model continues patterns; give it the pattern you want and it will continue it.", question: "Why do examples work so well?", options: ["The model memorizes them.", "The model predicts the next tokens, and a clear pattern makes the next tokens clear.", "Examples make the prompt longer, and longer is better."], answers: ["It doesn't store anything. It continues them.", "Yes.", "Longer isn't better. Clearer is."], deeper: "Microsoft, Generative AI for Beginners, lesson 4", url: "https://github.com/microsoft/generative-ai-for-beginners" },
  {
    title: "Structured output", minutes: "8", line: "You can ask the model to answer in a fixed shape — JSON with named fields — so your code can use the answer without reading prose.", caption: "FIGURE 2.4.1 — Prose in, data out.", library: "A two-pane component with SVG connector lines.", figure: "MESSY NOTES                         JSON\nPriya — send the deck by Friday       { actions: [{ owner: \"Priya\",\n                                      task: \"send the deck\", due: \"Friday\" }] }",
    node: <Compare
      left={{ title: "Messy notes", children: "Priya — send the deck by Friday", note: "text for a person to read" }}
      right={{ title: "JSON", accent: true, children: <Code lang="json" title="response">{`
{
  "actions": [
    {
      "owner": "Priya",
      "task": "send the deck",
      "due": "Friday"
    }
  ]
}`}</Code>, note: "fields your code can read" }}
    />,
    paragraphs: ["Everything so far produced text for a person to read. Programs can't read prose. They need fields: a name, a date, a list. So the next move is to ask the model for its answer in a fixed shape.", "The shape is usually JSON — a small, strict format of named fields and values that every programming language can read. You describe the shape you want (a list of actions, each with an owner, a task, and a due date), and the model fills it in from the text you gave it.", "Most providers now let you hand over the shape as a schema — a formal description of the fields and their types — and the model is constrained to match it. Even without that, a clear description plus one example is usually enough.", "Hold onto this idea, because it's bigger than it looks. When you ask a model to choose a tool and fill in its arguments, you are asking for structured output. Module 3 is built on this section."], key: "Structured output turns the model from a writer into a component: fields your code can read.", question: "Why ask for JSON instead of a sentence?", options: ["JSON is shorter.", "Your code needs fields, not prose.", "The model is more accurate in JSON."], answers: ["Not the reason. It's about what your code can read.", "Yes.", "Not inherently — but the answer becomes checkable, which is next."], deeper: "12-factor agents, Factor 4: Tools are just structured outputs", url: "https://github.com/humanlayer/12-factor-agents" },
  {
    title: "When the output is wrong", minutes: "7", line: "The model will sometimes return the wrong shape; your code must check it, and retry with the error, rather than trust it.", caption: "FIGURE 2.5.1 — Validate, then retry with the reason.", figure: "call model → parse → valid? → yes: use it\n                         ↓ no: send the error back → call again\n                         attempt 2 of 3\nmissing comma · prose before JSON · wrong field type",
    node: <Stack>
      <Flow items={["call the model", "parse", "validate", { label: "send the error back", sub: "attempt 2 of 3" }]} loop />
      <Code lang="python" title="validate, then retry" mark={[9]}>{`
for attempt in range(1, 4):                 # up to three attempts
    reply = call(messages)
    try:
        actions = Actions.parse(reply)
        break                               # valid: use it
    except ValidationError as err:
        # a stray sentence, a missing comma, a date where a number belongs
        messages.append({"role": "assistant", "content": reply})
        messages.append({"role": "user", "content": f"Fix: {err}"})`}</Code>
    </Stack>,
    paragraphs: ["Here is the honest part. Ask for JSON a hundred times and a few times you'll get something that isn't quite JSON — a stray sentence before it, a missing comma, a date where you asked for a number. The model is predicting likely text, and \"almost right\" is likely text.", "So your program has a job the chat app never had: check the answer. Parse it. Validate it against the shape you asked for. If it fails, don't give up and don't trust it — send the model the error message and ask again. Models are good at fixing a specific mistake when they're told what it was. Two or three attempts catch nearly everything.", "This pattern — call, validate, retry — is where reliability comes from. It's also your first taste of a loop around a model, which is what an agent is.", "The parser is the seam between the model's text and your program's data. Everything that crosses it gets checked."], key: "Never trust the shape; validate it, and retry with the error when it fails.", question: "The model returns JSON with one field missing. What should your code do?", options: ["Use what's there.", "Validate, then call again with the error.", "Switch to a bigger model."], answers: ["Silent bad data is the worst outcome.", "Yes.", "Maybe later. First, tell it what was wrong."], deeper: "Pydantic's validate and retry pattern", url: "https://docs.pydantic.dev/" },
  {
    title: "Streaming and latency", minutes: "5", line: "Replies can be sent token by token as they're made, which is why chat feels fast even when the whole answer takes seconds.", caption: "FIGURE 2.6.1 — Same total time, very different feeling.", figure: "BLOCKING   | wait | wait | wait | [whole reply]\nSTREAMING  | first token | token · token · token · token\n             time to first token",
    node: <Stack>
      <Compare
        left={{ title: "All at once", children: <Code lang="python" title="blocking">{`
reply = call(messages)
print(reply)
# shown after the last token`}</Code>, note: "wait · wait · wait · the whole reply" }}
        right={{ title: "Streamed", children: <Code lang="python" title="streaming">{`
for token in stream(messages):
    print(token, end="", flush=True)
# shown as each token is chosen`}</Code>, note: "first token · token · token · token" }}
      />
      <Timeline
        title="four seconds, two ways · illustrative"
        total={4}
        rows={[
          { label: "all at once", start: 0, end: 4 },
          { label: "streamed", start: 0, end: 0.6, accent: true },
          { label: "words arriving", start: 0.6, end: 4, depth: 1 },
        ]}
        note="Blue is time to first token. Both replies take the same four seconds; only one shows anything before the end."
      />
    </Stack>,
    paragraphs: ["In Module 1 you watched a reply arrive in pieces. From code, you choose whether that happens. Ask for the reply all at once and you wait for the last token before you see the first. Ask for a stream and the provider sends each token as it's chosen.", "The total time is the same. The feeling isn't. People will wait four seconds watching words appear; they won't wait four seconds watching nothing.", "The number to know is time to first token — how long before the first piece arrives. It's mostly the cost of the model reading your prompt, so long prompts make it worse. Section 7 has a trick for that."], key: "Stream when a person is watching; the first token matters more than the last.", question: "Streaming makes the reply…", options: ["Faster overall.", "Feel faster, because the first token arrives sooner.", "Cheaper."], answers: ["Same total time.", "Yes.", "Same tokens, same cost."], deeper: "Vercel AI SDK, Streaming", url: "https://ai-sdk.dev/docs/foundations/streaming" },
  {
    title: "What it costs, and caching", minutes: "6", line: "You pay per token in and per token out, and providers charge much less for a prompt prefix they've already seen.", caption: "FIGURE 2.7.1 — The part that doesn't change is the part that gets cheap.", figure: "system prompt | examples | documents | this message\n  CACHED ~10%  | CACHED ~10% | CACHED ~10% | FULL PRICE\ninput tokens × price + output tokens × price = cost",
    node: <Stack>
      <Bars
        title="price per input token · by prompt segment"
        data={[
          { label: "system prompt", value: 10, display: "cached · ~10%" },
          { label: "examples", value: 10, display: "cached · ~10%" },
          { label: "documents", value: 10, display: "cached · ~10%" },
          { label: "this message", value: 100, display: "full price", accent: true },
        ]}
        note="The first three are identical every call, so the provider has seen them before. Only the last is new."
      />
      <Code lang="python" title="cost, per response">{`
usage = response.usage                       # Figure 2.1.1
cost = usage.input_tokens * PRICE_IN + usage.output_tokens * PRICE_OUT
log(usage.input_tokens, usage.output_tokens, cost)`}</Code>
    </Stack>,
    paragraphs: ["Every call costs money, and the bill is simple: tokens in at one price, tokens out at a higher price. A short question with a long system prompt costs more than it looks, because the system prompt is sent every time.", "That's where caching comes in. If the beginning of your prompt — the system prompt, the examples, the reference documents — is identical across calls, most providers will recognize it and charge a fraction of the price for that part. The rule is: keep the stable part at the front and the changing part at the end.", "Two habits pay for themselves. Log the token counts from every response (Figure 2.1.1 showed them) so you know what things cost before the bill arrives. And be deliberate about model choice — a smaller, cheaper model is often right for simple, structured tasks, and the expensive one is for when judgment matters."], key: "Cost is tokens in and out; put the unchanging part of the prompt first and it gets cheap.", question: "To make prefix caching work, the stable part of your prompt should go…", options: ["At the end, so it's freshest.", "At the beginning.", "It doesn't matter where."], answers: ["Freshness is for examples. Caching needs the stable part first.", "Yes.", "It matters — the cache matches from the start."], deeper: "Anthropic, Prompt caching", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching" },
  {
    title: "Project: the note-to-actions tool", minutes: "30", line: "Build a script that turns messy meeting notes into a validated list of action items, retrying when the model gets the shape wrong.", caption: "FIGURE 2.8.1 — Your first reliable model-backed tool.", figure: "$ python note_to_actions.py notes.txt\n{ \"actions\": [{ \"owner\": \"Priya\", \"task\": \"send the deck\", \"due\": \"Friday\" }] }\n\nrun 2 · attempt 1: due expected a date, got 'soon'\nattempt 2: success · 212 input tokens · $0.003", project: true,
    node: <Stack>
      <Flow items={["notes.txt", "prompt + two examples", "JSON", "validate", "retry with the error", "log tokens and cost"]} />
      <Code lang="bash" title="terminal" mark={[6]}>{`
$ python note_to_actions.py notes.txt
{"actions": [{"owner": "Priya", "task": "send the deck", "due": "Friday"}]}

$ python note_to_actions.py notes.txt        # run 2
attempt 1: due expected a date, got 'soon'
attempt 2: success · 212 input tokens · $0.003`}</Code>
    </Stack>,
    paragraphs: ["This is the first thing you build that a person could rely on. Not because the model is reliable — it isn't — but because your code is.", "Keep the scope small. Three fields. Real notes from a real meeting. When it works, feed it the messiest notes you have and watch the retry earn its keep.", "Build steps arriving with the lab."], key: "Reliability lives in your code around the model, not in the model.", deeper: "Thorsten Ball, How to build an agent", url: "https://ampcode.com/how-to-build-an-agent" },
]

function MiniCheck({ lesson }: { lesson: typeof lessons[number] }) { const [selected, setSelected] = useState<number | null>(null); if (!lesson.question) return null; return <Check><span className="block">{lesson.question}</span><span className="mt-3 grid gap-2">{lesson.options?.map((option, i) => <button key={option} onClick={() => setSelected(i)} className={`block w-full border px-3 py-3 text-left text-sm ${selected === i ? "border-foreground" : "border-border"}`}><span className="mr-2 font-mono text-[10px]">{String.fromCharCode(65 + i)}</span>{option}</button>)}</span>{selected !== null && <span className="mt-4 block border-t border-border pt-4 text-muted-foreground">{lesson.answers?.[selected]}</span>}</Check> }

export function ModuleTwoLesson({ section = 1 }: { section?: number }) { const lesson = lessons[section - 1] ?? lessons[0]; const isProject = Boolean(lesson.project); return <article><LessonHeader eyebrow={`Module 02 · Section ${section} of 8`} meta={`~${lesson.minutes} min`}>{lesson.title}</LessonHeader><div className="mt-10 border border-border px-4 py-3"><Eyebrow>In one line</Eyebrow><p className="mt-2 text-lg leading-7">{lesson.line}</p></div><Figure caption={lesson.caption} library={lesson.node ? undefined : (lesson.library)}>{lesson.node ?? <pre className="whitespace-pre-wrap p-5 font-mono text-xs leading-6 text-muted-foreground">{lesson.figure}</pre>}</Figure>{isProject && <section className="border border-border p-5"><Eyebrow>What you'll build</Eyebrow><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground"><li>A Python script that reads a text file of notes.</li><li>A system prompt with role, rules, and format, plus two examples.</li><li>A request for JSON matching a small schema (owner, task, due).</li><li>Validation, and a retry that sends the error back, up to three attempts.</li><li>A one-line log of tokens and cost per run, written to your traces folder.</li></ul><p className="mt-5 text-sm leading-6 text-muted-foreground"><span className="font-mono text-[10px] uppercase tracking-[.16em]">What you'll have at the end — </span>A tool you'd actually use, and the call–validate–retry pattern that every agent in this book is built on.</p></section>}<Prose>{lesson.paragraphs.map((p) => <p key={p}>{p}</p>)}</Prose><aside className="mt-10 border border-border p-5"><Eyebrow>Key idea</Eyebrow><p className="mt-2 text-sm leading-6">{lesson.key}</p></aside><MiniCheck lesson={lesson}/><details className="mt-8 border-y border-border py-4"><summary className="cursor-pointer font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">Go deeper — {lesson.deeper}</summary><p className="mt-4 text-sm leading-6 text-muted-foreground"><a className="underline underline-offset-4" href={lesson.url} target="_blank" rel="noreferrer">Open resource</a> for a clear explanation of this idea.</p></details><div className="mt-12 flex items-center justify-between border-t border-border pt-6 font-mono text-[10px]"><Link href={section > 1 ? `/m/2/s/${section - 1}` : "/m/2"}>← Previous</Link><Link className="text-foreground" href={section < 8 ? `/m/2/s/${section + 1}` : "/m/3"}>Next →</Link></div></article> }

export function ModuleTwoHome() { return <article><Eyebrow>Modules / 02</Eyebrow><h1 className="mt-5 font-display text-6xl">Working with a model</h1><p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground">In Module 1 you learned what a model does. This module is about driving one from code: calling it, steering it with instructions and examples, and getting answers back in a shape your program can use. By the end you'll have written a small, honest tool that turns messy text into clean data — and you'll understand why that skill is the foundation of every agent.</p><section className="mt-10 border-t border-border pt-6"><Eyebrow>What you'll be able to do</Eyebrow><ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground"><li>Call a model from a script and read what comes back.</li><li>Steer a model with a system prompt and examples instead of trial and error.</li><li>Get structured, validated output — and handle it when the model gets it wrong.</li></ul></section><section className="mt-12 border border-border p-5"><Eyebrow>Project</Eyebrow><h2 className="mt-3 font-display text-3xl">The note-to-actions tool</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">A script that takes messy meeting notes and returns a validated list of action items as JSON, retrying when the model's answer doesn't fit the shape.</p><Link href="/m/2/s/8" className="mt-5 inline-block font-mono text-[10px] uppercase tracking-[.16em] underline underline-offset-4">Open project →</Link></section></article> }
