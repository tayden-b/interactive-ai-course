import { Figure } from "@/components/book/reading-frame"
import { Code, Transcript, Compare, Table, Steps, Note, Flow, Numbers, KV, Mark, Stack } from "@/components/figures/kit"

export default function KitPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-12 text-foreground md:px-12">
      <div className="mx-auto max-w-[860px]">
        <p className="font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground">Parts bin</p>
        <h1 className="mt-4 font-display text-6xl">Kit</h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">The typeset blocks for figure slots that are not drawings. One accent, bold where it helps, structure everywhere.</p>

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
