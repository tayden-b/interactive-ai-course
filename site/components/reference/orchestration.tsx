'use client'

import {
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts'
import { ArrowDown, ArrowRight, FlowNode, Lane } from '@/components/carbon/flow'
import { Note, Section, Tile, TileTitle } from '@/components/carbon/ui'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const tradeoff = [
  { name: 'Single call', autonomy: 5, predictability: 96 },
  { name: 'Chain', autonomy: 18, predictability: 88 },
  { name: 'Router', autonomy: 34, predictability: 74 },
  { name: 'Parallel fan-out', autonomy: 42, predictability: 66 },
  { name: 'Single agent + tools', autonomy: 62, predictability: 52 },
  { name: 'Supervisor + workers', autonomy: 78, predictability: 44 },
  { name: 'Open swarm', autonomy: 94, predictability: 18 },
]

const shape = [
  { axis: 'Latency', chain: 70, supervisor: 34 },
  { axis: 'Cost control', chain: 88, supervisor: 40 },
  { axis: 'Debuggability', chain: 90, supervisor: 38 },
  { axis: 'Task breadth', chain: 32, supervisor: 88 },
  { axis: 'Recovery', chain: 40, supervisor: 82 },
]

export function Orchestration() {
  return (
    <Section
      id="orchestration"
      index="09"
      eyebrow="Orchestration"
      title="Five ways to wire agents together — in increasing order of regret"
      lede="Orchestration is the question of who decides what happens next: your code, one model, or a committee of models. Start at the top of this list and only move down when the task forces you to."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Tile>
          <TileTitle meta="Pattern 01">Chaining — deterministic pipeline</TileTitle>
          <Lane>
            <FlowNode kind="step" label="Extract" tone="cyan" className="w-28" />
            <ArrowRight />
            <FlowNode kind="step" label="Classify" tone="blue" className="w-28" />
            <ArrowRight />
            <FlowNode kind="step" label="Draft" tone="purple" className="w-28" />
            <ArrowRight />
            <FlowNode kind="step" label="Validate" tone="teal" className="w-28" />
          </Lane>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground text-pretty">
            You own the control flow. Each call has a narrow job and a checkable output. Cheapest to
            run, easiest to test, and the correct answer far more often than people expect.
          </p>
        </Tile>

        <Tile>
          <TileTitle meta="Pattern 02">Routing — one classifier, many specialists</TileTitle>
          <div className="flex items-center gap-3">
            <FlowNode kind="router" label="Intent router" sub="cheap, fast model" tone="blue" className="w-32 shrink-0" />
            <ArrowRight />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <FlowNode kind="branch" label="Billing agent" tone="magenta" />
              <FlowNode kind="branch" label="Technical agent" tone="purple" />
              <FlowNode kind="branch" label="Escalate to human" tone="neutral" />
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground text-pretty">
            Routing keeps prompts small and lets you send hard cases to expensive models and easy
            ones to cheap models. The router itself should be boring and heavily evaluated.
          </p>
        </Tile>

        <Tile>
          <TileTitle meta="Pattern 03">Parallel fan-out — map then reduce</TileTitle>
          <div className="flex items-center gap-3">
            <FlowNode kind="split" label="Split task" tone="cyan" className="w-28 shrink-0" />
            <ArrowRight />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <FlowNode kind="worker" label="Worker A — sources" tone="blue" />
              <FlowNode kind="worker" label="Worker B — numbers" tone="blue" />
              <FlowNode kind="worker" label="Worker C — risks" tone="blue" />
            </div>
            <ArrowRight />
            <FlowNode kind="reduce" label="Aggregator" sub="merge, dedupe, resolve conflicts" tone="teal" className="w-32 shrink-0" />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground text-pretty">
            Independent subtasks run at once, so latency is set by the slowest worker rather than
            the sum. Also used for voting: run the same task three times and reconcile.
          </p>
        </Tile>

        <Tile>
          <TileTitle meta="Pattern 04">Supervisor — orchestrator with workers</TileTitle>
          <div className="flex flex-col">
            <FlowNode
              kind="supervisor"
              label="Supervisor agent"
              sub="owns the goal, delegates, judges results, decides when to stop"
              tone="magenta"
            />
            <ArrowDown label="delegate / return" />
            <div className="grid gap-2 sm:grid-cols-3">
              <FlowNode kind="worker" label="Research" sub="search + read" tone="blue" />
              <FlowNode kind="worker" label="Code" sub="write + run tests" tone="purple" />
              <FlowNode kind="worker" label="Report" sub="format + cite" tone="teal" />
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground text-pretty">
            Each worker has its own context window and tool set, which prevents one giant polluted
            prompt. The supervisor becomes the single point of failure — and the thing you evaluate.
          </p>
        </Tile>
      </div>

      <Tile className="mt-6">
        <TileTitle meta="Pattern 05">Swarm — peer handoff with no central authority</TileTitle>
        <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
          <FlowNode kind="peer" label="Triage" sub="hands off to whoever fits" tone="cyan" />
          <ArrowRight label="handoff" />
          <FlowNode kind="peer" label="Specialist" sub="may hand back or sideways" tone="purple" />
          <ArrowRight label="handoff" />
          <FlowNode kind="peer" label="Closer" sub="produces the final answer" tone="teal" />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground text-pretty">
          Powerful and genuinely hard to operate: loops between peers, duplicated work, and traces
          that no longer read as a sequence. Require a global step budget and full tracing before
          you ship anything shaped like this.
        </p>
      </Tile>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Tile>
          <TileTitle meta="Trade-off space">Autonomy costs predictability</TileTitle>
          <ChartContainer
            config={{ pattern: { label: 'Pattern', color: 'var(--chart-1)' } }}
            className="h-72 w-full"
          >
            <ScatterChart margin={{ left: 4, right: 16, top: 12, bottom: 12 }}>
              <CartesianGrid stroke="var(--border)" />
              <XAxis
                type="number"
                dataKey="autonomy"
                name="Autonomy"
                unit="%"
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              />
              <YAxis
                type="number"
                dataKey="predictability"
                name="Predictability"
                unit="%"
                domain={[0, 100]}
                width={44}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              />
              <ZAxis type="category" dataKey="name" name="Pattern" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Scatter data={tradeoff} fill="var(--color-pattern)" shape="square" />
            </ScatterChart>
          </ChartContainer>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground text-pretty">
            Bottom right is the swarm; top left is a single call. Production systems usually live in
            the middle — a deterministic skeleton with one agentic joint.
          </p>
        </Tile>

        <Tile>
          <TileTitle meta="Profile">Chain vs. supervisor across five axes</TileTitle>
          <ChartContainer
            config={{
              chain: { label: 'Chained workflow', color: 'var(--chart-2)' },
              supervisor: { label: 'Supervisor + workers', color: 'var(--chart-3)' },
            }}
            className="h-72 w-full"
          >
            <RadarChart data={shape} outerRadius="72%">
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis
                dataKey="axis"
                tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Radar
                dataKey="chain"
                stroke="var(--color-chain)"
                fill="var(--color-chain)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Radar
                dataKey="supervisor"
                stroke="var(--color-supervisor)"
                fill="var(--color-supervisor)"
                fillOpacity={0.18}
                strokeWidth={2}
              />
            </RadarChart>
          </ChartContainer>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground text-pretty">
            Neither shape is better. Pick the one whose weaknesses you can tolerate for the task in
            front of you.
          </p>
        </Tile>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Tile>
          <TileTitle meta="Plumbing">What the orchestration layer owns</TileTitle>
          <ul className="divide-y divide-border">
            {[
              { k: 'State & durability', v: 'Persist every step so a crash or a timeout resumes instead of restarting.' },
              { k: 'Tool contracts', v: 'Typed schemas, validation, retries with backoff, idempotency keys on writes.' },
              { k: 'Budgets', v: 'Caps on steps, tokens, wall clock and money — enforced outside the model.' },
              { k: 'Human in the loop', v: 'Pause points for approval before irreversible actions.' },
              { k: 'Tracing', v: 'Every prompt, tool call and result recorded and replayable.' },
            ].map((row) => (
              <li key={row.k} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-4">
                <span className="font-mono text-xs text-chart-4 sm:w-40 sm:shrink-0">{row.k}</span>
                <span className="text-sm leading-relaxed text-muted-foreground">{row.v}</span>
              </li>
            ))}
          </ul>
        </Tile>
        <Note label="Design heuristic">
          Add autonomy only where you cannot enumerate the steps. Most systems marketed as
          multi-agent are a three-step workflow with one model call that was allowed to pick a tool.
        </Note>
      </div>
    </Section>
  )
}
