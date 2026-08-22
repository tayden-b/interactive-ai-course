import { Figure } from "@/components/book/reading-frame"
import { Code, Transcript, Compare, Table, Steps, Note, Flow, Numbers, KV, Mark, Stack } from "@/components/figures/kit"
import { Pictogram, modulePictogram } from "@/components/figures/pictograms"
import { Bars, Line, Timeline, Spark, Stacked } from "@/components/figures/charts"
import { GoDeeper } from "@/components/figures/resource"

export default function KitPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-12 text-foreground md:px-12">
      <div className="mx-auto max-w-[860px]">
        <p className="font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground">Parts bin</p>
        <h1 className="mt-4 font-display text-6xl">Kit</h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">The typeset blocks for figure slots that are not drawings. One accent, bold where it helps, structure everywhere.</p>


        <div>
          <p className="mt-16 font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground">Reference cards</p>
          <GoDeeper title="Andrej Karpathy — Intro to Large Language Models" url="https://www.youtube.com/watch?v=zjkBMFhNj_g" />
          <GoDeeper title="Simon Willison — The lethal trifecta for AI agents" url="https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/" />
        </div>

        <Figure caption="PICTOGRAMS — one per module, from IBM Carbon (Apache-2.0), in the book's blue.">
          <div className="grid grid-cols-4 gap-6 md:grid-cols-8">
            {Object.entries(modulePictogram).map(([m, name]) => (
              <div key={m} className="text-center">
                <Pictogram name={name} size={56} style={{ color: "var(--figure-accent)", margin: "0 auto" }} />
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">{String(m).padStart(2, "0")}</p>
              </div>
            ))}
          </div>
        </Figure>


        <Figure caption="CHARTS — bars, line with a cap, timeline, stacked. One blue series; mono ticks; one baseline.">
          <Stack>
            <Bars title="Window per agent · tokens" data={[{ label: "orchestrator", value: 300, accent: true, display: "300" }, { label: "worker A", value: 30000, display: "30k" }, { label: "worker B", value: 30000, display: "30k" }, { label: "worker C", value: 30000, display: "30k" }]} />
            <Line title="Steps per run · with and without a cap" cap={10} capLabel="cap · 10" xLabels={["1", "2", "3", "4", "5", "6", "7", "8"]} series={[{ name: "capped", points: [2, 3, 3, 4, 4, 5, 5, 5], accent: true }, { name: "runaway", points: [2, 4, 7, 11, 16, 22, 29, 37], dashed: true }]} />
            <Timeline title="Sequential vs parallel · seconds" total={6} rows={[{ label: "summarize A", start: 0, end: 2 }, { label: "summarize B", start: 2, end: 4 }, { label: "summarize C", start: 4, end: 6 }, { label: "A · B · C at once", start: 0, end: 2, accent: true }]} />
            <Stacked title="Where the tokens went · one run" segments={[{ label: "system", value: 900 }, { label: "history", value: 2400, accent: true }, { label: "tool results", value: 1800 }, { label: "reply", value: 300 }]} />
            <p className="text-[14px] text-muted-foreground">Inline: pass rate, last 12 runs <Spark points={[8, 9, 9, 10, 10, 9, 10, 10, 10, 7, 10, 10]} /></p>
          </Stack>
        </Figure>

        <Figure caption="CODE — a request body, with the line that matters marked.">
          <Code lang="json" title="request" mark={[5]}>{`
{
  "model": "claude-sonnet-5",
  "messages": [
    { "role": "system", "content": "You are a careful assistant." },
    { "role": "user",   "content": "What's the capital of France?" }
  ],
  "temperature": 0.7
}`}</Code>
        </Figure>

        <Figure caption="CODE — python, with a comment and a marked line.">
          <Code lang="python" title="01_call.py" mark={[6]}>{`
# one round trip, traced
def call(messages, temperature=0.7):
    response = client.messages.create(model=MODEL, messages=messages, temperature=temperature)
    trace.record("model.call", tokens=response.usage)
    return response.content[0].text

reply = call([{"role": "user", "content": "Summarise this note."}])`}</Code>
        </Figure>

        <Figure caption="TRANSCRIPT — one tool use is two messages and a function call in between.">
          <Transcript turns={[
            { role: "user", text: "What's the weather in Austin?" },
            { role: "assistant", text: <>I'll check. <Mark>get_weather(city="Austin")</Mark></>, note: "a request, not an answer" },
            { role: "tool", text: '{ "temp_f": 84, "sky": "partly cloudy" }' },
            { role: "assistant", text: "It's 84°F and partly cloudy in Austin." },
          ]} />
        </Figure>

        <Figure caption="COMPARE — the same model; one of them can check.">
          <Compare
            left={{ title: "No tools", children: <Transcript turns={[{ role: "user", text: "Weather in Austin?" }, { role: "assistant", text: "Austin is 84°F and sunny." }]} />, note: "fluent, confident, invented" }}
            right={{ title: "With a tool", accent: true, children: <Transcript turns={[{ role: "user", text: "Weather in Austin?" }, { role: "tool", text: "84°F, partly cloudy" }, { role: "assistant", text: "It's 84°F and partly cloudy." }]} />, note: "the number came from somewhere" }}
          />
        </Figure>

        <Figure caption="TABLE — the spec, as a table.">
          <Table head={["input", "expected", "what matters", "grader"]} accentCol={3} rows={[
            ["easy note", "3 actions", "owners + dates", "code"],
            ["no actions", "[]", "empty is valid", "exact"],
            ["ambiguous owner", "owner?", "flag uncertainty", "judge"],
            ["distractor", "ignore", "relevance", "judge"],
          ]} />
        </Figure>

        <Figure caption="STEPS + FLOW + NOTE">
          <Stack>
            <Flow items={["gather", "decide", { label: "act", accent: true }, "observe"]} loop />
            <Steps accent={2} items={[
              { title: "Gather", body: "Everything the model can see this turn: system prompt, history, tool results." },
              { title: "Decide", body: "The model answers, or asks for a tool." },
              { title: "Act", body: "Your code runs the tool. The model never does." },
              { title: "Observe", body: "The result goes back on the stack as a message." },
            ]} />
            <Note label="The point">The loop ends only when the model <Mark>stops asking</Mark>. That is the whole difference between an agent and a hang.</Note>
          </Stack>
        </Figure>

        <Figure caption="NUMBERS + KV">
          <Stack>
            <Numbers items={[{ value: "10 TB", label: "text read" }, { value: "140 GB", label: "numbers kept", accent: true }, { value: "~500", label: "lines that run them" }]} />
            <KV rows={[{ k: "model", v: "which numbers to run" }, { k: "messages", v: "everything it can see", accent: true }, { k: "temperature", v: "how adventurous the pick is" }]} />
          </Stack>
        </Figure>
      </div>
    </main>
  )
}
