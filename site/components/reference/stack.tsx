import { Note, Section, Tag, Tile, TileTitle } from '@/components/carbon/ui'

const layers = [
  {
    n: '04',
    name: 'Application layer',
    tone: 'chart-1',
    what: 'What the user actually touches',
    examples: ['Chat UI', 'Dashboard', 'Slack bot', 'IDE extension'],
    owns: 'Auth, UI, permissions, feedback',
  },
  {
    n: '03',
    name: 'Orchestration layer',
    tone: 'chart-3',
    what: 'The agent loop and its wiring',
    examples: ['Agent framework', 'Tool registry', 'Memory', 'Retries & queues'],
    owns: 'Prompt assembly, tool calls, control flow',
  },
  {
    n: '02',
    name: 'Model layer',
    tone: 'chart-4',
    what: 'The reasoning engine you call',
    examples: ['LLM API', 'Embeddings', 'Re-ranker', 'Router / gateway'],
    owns: 'Tokens in, tokens out. Nothing else.',
  },
  {
    n: '01',
    name: 'Infrastructure layer',
    tone: 'chart-2',
    what: 'Where everything runs and is stored',
    examples: ['GPUs', 'Vector DB', 'App DB', 'Object storage'],
    owns: 'Compute, storage, networking, logs',
  },
]

// Graphic 1 — the four layers of an AI application, drawn as a physical stack.
function StackDiagram() {
  return (
    <Tile>
      <TileTitle meta="graphic 01">The four layers of an AI app</TileTitle>
      <p className="mb-5 text-sm leading-relaxed text-muted-foreground text-pretty">
        Read it bottom-up: each layer only talks to the one directly below it. Most beginner
        confusion comes from mixing layers &mdash; blaming &ldquo;the model&rdquo; for a bug that
        actually lives in orchestration.
      </p>
      <ol className="flex flex-col gap-2">
        {layers.map((layer) => (
          <li
            key={layer.n}
            className="grid gap-3 border border-border bg-layer p-4 sm:grid-cols-[auto_1fr_1fr]"
            style={{ borderLeft: `4px solid var(--${layer.tone})` }}
          >
            <div className="flex items-baseline gap-3 sm:flex-col sm:gap-1">
              <span
                className="font-mono text-lg leading-none font-light"
                style={{ color: `var(--${layer.tone})` }}
              >
                {layer.n}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">{layer.name}</span>
              <span className="text-xs leading-relaxed text-muted-foreground">{layer.what}</span>
              <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                owns: {layer.owns}
              </span>
            </div>
            <ul className="flex flex-wrap content-start items-start gap-1">
              {layer.examples.map((ex) => (
                <li
                  key={ex}
                  className="border border-border-strong px-2 py-0.5 font-mono text-[10px] tracking-wider text-muted-foreground uppercase"
                >
                  {ex}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <p className="mt-4 border-l-2 border-border-strong pl-3 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
        you swap layers independently &mdash; changing models should not change your UI
      </p>
    </Tile>
  )
}

const code: { line: string; note?: string; tone?: string }[] = [
  { line: 'from openai import OpenAI' },
  { line: '' },
  { line: 'client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])', note: 'never hardcode keys', tone: 'chart-2' },
  { line: '' },
  { line: 'TOOLS = [{' , note: 'what the agent is allowed to DO', tone: 'chart-3' },
  { line: '    "type": "function",' },
  { line: '    "name": "get_order",' },
  { line: '    "description": "Look up an order by id.",', note: 'the model picks tools from this text', tone: 'chart-3' },
  { line: '    "parameters": {"order_id": "string"},' },
  { line: '}]' },
  { line: '' },
  { line: 'response = client.responses.create(' },
  { line: '    model="gpt-4o-mini",', note: 'which brain, and what it costs', tone: 'chart-4' },
  { line: '    instructions="You are a support agent.",', note: 'the system prompt = the job description', tone: 'chart-1' },
  { line: '    input=conversation,', note: 'history you choose to send', tone: 'chart-1' },
  { line: '    tools=TOOLS,' },
  { line: '    temperature=0.2,', note: '0 = predictable, 1 = creative', tone: 'chart-4' },
  { line: '    max_output_tokens=800,', note: 'a hard cap on the reply', tone: 'chart-5' },
  { line: ')' },
]

// Graphic 2 — a minimal agent configuration, annotated line by line.
function ConfigAnatomy() {
  return (
    <Tile>
      <TileTitle meta="graphic 02">Anatomy of an agent config</TileTitle>
      <p className="mb-5 text-sm leading-relaxed text-muted-foreground text-pretty">
        Every agent, in every framework, is ultimately this: a model name, an instruction, a list of
        tools, and a few dials. The rest is plumbing.
      </p>
      <div className="overflow-x-auto border border-border bg-layer">
        <table className="w-full min-w-max border-collapse text-left">
          <tbody>
            {code.map((row, i) => (
              <tr key={i} className="align-top">
                <td className="w-8 border-r border-border px-2 py-0.5 text-right font-mono text-[10px] text-muted-foreground select-none">
                  {i + 1}
                </td>
                <td className="py-0.5 pl-3 font-mono text-xs whitespace-pre text-foreground">
                  {row.line || ' '}
                </td>
                <td className="py-0.5 pr-3 pl-6">
                  {row.note ? (
                    <span
                      className="font-mono text-[10px] tracking-wider uppercase"
                      style={{ color: `var(--${row.tone})` }}
                    >
                      &larr; {row.note}
                    </span>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Tag tone="blue">prompt</Tag>
        <Tag tone="magenta">tools</Tag>
        <Tag tone="purple">model dials</Tag>
        <Tag tone="teal">secrets</Tag>
      </div>
    </Tile>
  )
}

const budget = [
  { label: 'System prompt', pct: 8, tone: 'chart-1', detail: 'Rules, persona, format' },
  { label: 'Tool schemas', pct: 12, tone: 'chart-3', detail: 'Every tool, every call' },
  { label: 'Retrieved docs', pct: 25, tone: 'chart-2', detail: 'RAG chunks' },
  { label: 'Chat history', pct: 35, tone: 'chart-5', detail: 'Grows every turn' },
  { label: 'Room for reply', pct: 20, tone: 'chart-4', detail: 'Output needs space too' },
]

// Graphic 3 — the context window as a single fixed-size desk.
function ContextWindow() {
  return (
    <Tile>
      <TileTitle meta="graphic 03">The context window is a desk, not a memory</TileTitle>
      <p className="mb-5 text-sm leading-relaxed text-muted-foreground text-pretty">
        A model has no memory between calls. Every single request re-sends everything it should
        know, and it all has to fit on one fixed-size desk. Anything you push off the edge is simply
        forgotten.
      </p>

      <div className="mb-2 flex items-baseline justify-between font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
        <span>0 tokens</span>
        <span>context limit</span>
      </div>
      <div className="flex h-12 w-full border border-border-strong" role="img" aria-label="Context window budget split across system prompt, tool schemas, retrieved documents, chat history and reply headroom">
        {budget.map((seg) => (
          <div
            key={seg.label}
            className="flex items-center justify-center border-r border-background last:border-r-0"
            style={{ width: `${seg.pct}%`, backgroundColor: `var(--${seg.tone})` }}
          >
            <span className="font-mono text-[10px] font-medium text-background">{seg.pct}%</span>
          </div>
        ))}
      </div>

      <ul className="mt-4 divide-y divide-border">
        {budget.map((seg) => (
          <li key={seg.label} className="flex items-center gap-3 py-2">
            <span
              aria-hidden="true"
              className="h-3 w-3 shrink-0"
              style={{ backgroundColor: `var(--${seg.tone})` }}
            />
            <span className="w-32 shrink-0 text-xs font-medium">{seg.label}</span>
            <span className="text-xs text-muted-foreground">{seg.detail}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        {[
          { t: 'Overflow', d: 'Oldest turns get dropped. The agent "forgets" what you said earlier.' },
          { t: 'Cost', d: 'You pay for the whole desk on every turn, not just the new message.' },
          { t: 'Fix', d: 'Summarise old turns, retrieve less, or trim unused tools.' },
        ].map((c) => (
          <div key={c.t} className="border border-border bg-layer p-3">
            <span className="font-mono text-[10px] tracking-widest text-chart-3 uppercase">
              {c.t}
            </span>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground text-pretty">{c.d}</p>
          </div>
        ))}
      </div>
    </Tile>
  )
}

export function Stack() {
  return (
    <Section
      id="stack"
      index="02"
      eyebrow="The stack"
      title="Where an agent actually lives"
      lede="Before the maths, get the map: four layers, one config file, and one fixed-size desk called the context window."
    >
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <StackDiagram />
          <ConfigAnatomy />
        </div>
        <ContextWindow />
        <Note label="Beginner trap">
          &ldquo;The agent forgot what I told it&rdquo; is almost never a model flaw &mdash; it is an
          orchestration choice about what you put in the context window on the next call.
        </Note>
      </div>
    </Section>
  )
}
