export type NodeId =
  | 'input'
  | 'orchestrator'
  | 'llm'
  | 'tools'
  | 'observation'
  | 'response'
  | 'context'
  | 'memory'
  | 'registry'
  | 'guardrails'

export type DiagramNode = {
  id: NodeId
  x: number
  y: number
  w: number
  h: number
  kind: string
  name: string
  lines: string[]
  variant: 'primary' | 'support'
}

export const NODES: DiagramNode[] = [
  {
    id: 'input',
    x: 40,
    y: 292,
    w: 190,
    h: 96,
    kind: 'Entry point',
    name: 'Request',
    lines: ['goal · constraints', 'chat · api · schedule'],
    variant: 'primary',
  },
  {
    id: 'orchestrator',
    x: 290,
    y: 292,
    w: 200,
    h: 96,
    kind: 'Control plane',
    name: 'Orchestrator',
    lines: ['state · routing · retries', 'step budget'],
    variant: 'primary',
  },
  {
    id: 'llm',
    x: 500,
    y: 124,
    w: 220,
    h: 92,
    kind: 'Model',
    name: 'LLM reasoning',
    lines: ['plan → select action', 'emits structured call'],
    variant: 'primary',
  },
  {
    id: 'tools',
    x: 880,
    y: 292,
    w: 200,
    h: 96,
    kind: 'Action',
    name: 'Tool execution',
    lines: ['api · sql · code · rag', 'sandboxed, typed i/o'],
    variant: 'primary',
  },
  {
    id: 'observation',
    x: 500,
    y: 474,
    w: 220,
    h: 92,
    kind: 'Feedback',
    name: 'Observation',
    lines: ['parse · validate · trim', 'written back to state'],
    variant: 'primary',
  },
  {
    id: 'response',
    x: 40,
    y: 474,
    w: 190,
    h: 92,
    kind: 'Exit point',
    name: 'Final response',
    lines: ['answer + citations', 'streamed to user'],
    variant: 'primary',
  },
  {
    id: 'context',
    x: 540,
    y: 296,
    w: 220,
    h: 88,
    kind: 'Working set',
    name: 'Context window',
    lines: ['prompt · history · results', 'retrieved documents'],
    variant: 'support',
  },
  {
    id: 'memory',
    x: 290,
    y: 610,
    w: 250,
    h: 76,
    kind: 'Service',
    name: 'Memory',
    lines: ['short-term · episodic · vector'],
    variant: 'support',
  },
  {
    id: 'registry',
    x: 560,
    y: 610,
    w: 250,
    h: 76,
    kind: 'Service',
    name: 'Tool registry',
    lines: ['openapi · mcp · functions'],
    variant: 'support',
  },
  {
    id: 'guardrails',
    x: 830,
    y: 610,
    w: 250,
    h: 76,
    kind: 'Service',
    name: 'Guardrails',
    lines: ['policy · schema · rate limits'],
    variant: 'support',
  },
]

export type EdgeId =
  | 'e1'
  | 'e2'
  | 'e3'
  | 'e4'
  | 'e5'
  | 'e6'
  | 'ctxOrch'
  | 'ctxLlm'
  | 'busMain'
  | 'busMemory'
  | 'busRegistry'
  | 'busGuard'
  | 'busToOrch'
  | 'busToTools'

export type DiagramEdge = {
  id: EdgeId
  d: string
  style: 'solid' | 'dashed'
  label?: { text: string; x: number; y: number; anchor?: 'start' | 'middle' | 'end' }
}

export const EDGES: DiagramEdge[] = [
  { id: 'e1', d: 'M230,340 H290', style: 'solid' },
  {
    id: 'e2',
    d: 'M390,292 V170 H500',
    style: 'solid',
    label: { text: 'context + tools', x: 400, y: 158, anchor: 'start' },
  },
  {
    id: 'e3',
    d: 'M720,170 H980 V292',
    style: 'solid',
    label: { text: 'tool call (json)', x: 850, y: 158, anchor: 'middle' },
  },
  {
    id: 'e4',
    d: 'M980,388 V520 H720',
    style: 'solid',
    label: { text: 'result / error', x: 850, y: 512, anchor: 'middle' },
  },
  {
    id: 'e5',
    d: 'M500,520 H390 V388',
    style: 'solid',
    label: { text: 'updated state', x: 400, y: 512, anchor: 'start' },
  },
  {
    id: 'e6',
    d: 'M310,388 V520 H230',
    style: 'solid',
    label: { text: 'done', x: 244, y: 508, anchor: 'start' },
  },
  { id: 'ctxOrch', d: 'M540,340 H490', style: 'dashed' },
  { id: 'ctxLlm', d: 'M650,296 V216', style: 'dashed' },
  { id: 'busMain', d: 'M330,580 H1080', style: 'dashed' },
  { id: 'busMemory', d: 'M415,610 V580', style: 'dashed' },
  { id: 'busRegistry', d: 'M685,610 V580', style: 'dashed' },
  { id: 'busGuard', d: 'M955,610 V580', style: 'dashed' },
  { id: 'busToOrch', d: 'M360,580 V388', style: 'dashed' },
  { id: 'busToTools', d: 'M1030,580 V388', style: 'dashed' },
]

export type Step = {
  index: string
  title: string
  body: string
  nodes: NodeId[]
  edges: EdgeId[]
}

export const STEPS: Step[] = [
  {
    index: '01',
    title: 'Request received',
    body: 'A goal arrives from chat, an API call or a schedule. The orchestrator opens a task, sets a step budget and picks the policy that applies.',
    nodes: ['input', 'orchestrator'],
    edges: ['e1'],
  },
  {
    index: '02',
    title: 'Context assembled',
    body: 'System prompt, goal, conversation history, retrieved documents and prior tool results are packed into the context window — the only thing the model ever sees.',
    nodes: ['orchestrator', 'context', 'memory'],
    edges: ['ctxOrch', 'busMemory', 'busMain', 'busToOrch'],
  },
  {
    index: '03',
    title: 'Reason and plan',
    body: 'The model reasons over the working set and decides the next action: call a tool, ask a clarifying question, or finish. The decision is emitted as a structured tool call.',
    nodes: ['llm', 'context'],
    edges: ['e2', 'ctxLlm'],
  },
  {
    index: '04',
    title: 'Action dispatched',
    body: 'The orchestrator checks the call against the tool registry and guardrails — schema, permissions, rate limits — then executes it in a sandbox.',
    nodes: ['tools', 'registry', 'guardrails'],
    edges: ['e3', 'busRegistry', 'busGuard', 'busMain', 'busToTools'],
  },
  {
    index: '05',
    title: 'Observation returned',
    body: 'Results (or errors) are parsed, validated, truncated to fit the budget and appended to state. Durable facts are committed to memory.',
    nodes: ['observation', 'memory'],
    edges: ['e4', 'busMemory', 'busMain'],
  },
  {
    index: '06',
    title: 'Evaluate and iterate',
    body: 'Is the goal satisfied? If not, the loop repeats with enriched context. The step budget and guardrails bound how many iterations may run.',
    nodes: ['orchestrator', 'observation'],
    edges: ['e5'],
  },
  {
    index: '07',
    title: 'Final response',
    body: 'The orchestrator synthesises the answer, attaches citations and traces, and streams it back to the caller. The trace is retained for evaluation.',
    nodes: ['orchestrator', 'response'],
    edges: ['e6'],
  },
]

export const MAX_ITERATIONS = 3
export const EVALUATE_STEP = 5
export const LOOP_BACK_STEP = 1
