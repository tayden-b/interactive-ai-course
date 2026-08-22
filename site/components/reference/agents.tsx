'use client'

import { useState } from 'react'
import { ArrowDown, FlowNode, Legend } from '@/components/carbon/flow'
import { Note, Section, Tag, Tile, TileTitle } from '@/components/carbon/ui'

const phases = ['Think', 'Act', 'Observe'] as const

type Step = {
  phase: (typeof phases)[number]
  label: string
  detail: string
}

const trace: Step[] = [
  {
    phase: 'Think',
    label: 'Goal decomposition',
    detail:
      'The customer asks why invoice 4471 is unpaid. I need the invoice record before I can explain anything.',
  },
  {
    phase: 'Act',
    label: 'billing.getInvoice({ id: "4471" })',
    detail: 'Tool call emitted as structured JSON, validated against the tool schema.',
  },
  {
    phase: 'Observe',
    label: 'status: "failed", reason: "card_expired"',
    detail: 'Result appended to the context. The agent now knows more than it did one turn ago.',
  },
  {
    phase: 'Think',
    label: 'Plan revision',
    detail:
      'A payment method problem, not a billing dispute. Check whether a newer card exists on the account.',
  },
  {
    phase: 'Act',
    label: 'billing.listPaymentMethods({ account: "a_88" })',
    detail: 'Second tool call, chosen by the model — not by a hard-coded branch.',
  },
  {
    phase: 'Observe',
    label: '1 valid card ending 4242',
    detail: 'Enough information to propose a fix that requires no human triage.',
  },
  {
    phase: 'Think',
    label: 'Termination check',
    detail:
      'Goal satisfiable. Draft the retry, request approval for the charge, then stop looping.',
  },
]

const toneFor = { Think: 'blue', Act: 'magenta', Observe: 'teal' } as const

export function Agents() {
  const [shown, setShown] = useState(3)
  const current = trace[Math.min(shown, trace.length) - 1]

  return (
    <Section
      id="agents"
      index="08"
      eyebrow="Agents"
      title="An agent is a model in a loop with tools, memory and a stopping rule"
      lede="Remove the loop and you have a chatbot. Remove the tools and you have a writer. The interesting behaviour comes from letting the model choose its own next action."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_1fr]">
        <Tile>
          <TileTitle meta="Anatomy">Six parts of an agent</TileTitle>
          <div className="flex flex-col gap-2">
            {[
              { kind: 'goal', label: 'Objective', sub: 'A task description and success criteria', tone: 'cyan' as const },
              { kind: 'brain', label: 'Model + system prompt', sub: 'Reasoning, planning, tool selection', tone: 'blue' as const },
              { kind: 'hands', label: 'Tools', sub: 'Typed functions: APIs, SQL, code exec, browsing', tone: 'magenta' as const },
              { kind: 'memory', label: 'Memory', sub: 'Scratchpad now, vector or SQL store across sessions', tone: 'purple' as const },
              { kind: 'guard', label: 'Guardrails', sub: 'Schema validation, permissions, approvals, budgets', tone: 'neutral' as const },
              { kind: 'exit', label: 'Termination', sub: 'Goal met, step cap, cost cap, or human takeover', tone: 'teal' as const },
            ].map((part) => (
              <FlowNode key={part.kind} {...part} />
            ))}
          </div>
          <div className="mt-4 border-t border-border pt-4">
            <Legend
              items={[
                { label: 'think', tone: 'blue' },
                { label: 'act', tone: 'magenta' },
                { label: 'observe', tone: 'teal' },
              ]}
            />
          </div>
        </Tile>

        <div className="flex min-w-0 flex-col gap-6">
          <Tile>
            <TileTitle meta="The loop">Think → act → observe → repeat</TileTitle>
            <div className="grid gap-4 sm:grid-cols-[minmax(0,180px)_1fr] sm:items-start">
              <div className="flex flex-col">
                {phases.map((phase) => (
                  <div key={phase}>
                    <div
                      className={`border-l-4 p-3 transition-colors ${
                        current.phase === phase
                          ? 'border-primary bg-layer'
                          : 'border-border-strong bg-transparent'
                      }`}
                    >
                      <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                        {phase === 'Think' ? 'reason' : phase === 'Act' ? 'tool call' : 'result'}
                      </span>
                      <p className="text-sm font-medium">{phase}</p>
                    </div>
                    <ArrowDown />
                  </div>
                ))}
                <p className="border-l-2 border-dashed border-border-strong pl-3 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  loop back to think, until it stops
                </p>
              </div>

              <div className="flex min-w-0 flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                  <span className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                    Trace — step {Math.min(shown, trace.length)} / {trace.length}
                  </span>
                  <span className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShown((s) => Math.min(s + 1, trace.length))}
                      disabled={shown >= trace.length}
                      className="border border-border-strong px-3 py-1 text-xs transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-foreground"
                    >
                      Next step
                    </button>
                    <button
                      type="button"
                      onClick={() => setShown(1)}
                      className="border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Reset
                    </button>
                  </span>
                </div>

                <ol className="flex flex-col gap-2">
                  {trace.slice(0, shown).map((step, i) => (
                    <li key={step.label} className="flex gap-3">
                      <span className="w-6 shrink-0 pt-1 font-mono text-[11px] text-muted-foreground">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <Tag tone={toneFor[step.phase]}>{step.phase}</Tag>
                          <span className="font-mono text-xs break-all text-foreground">
                            {step.label}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                          {step.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Tile>

          <div className="grid gap-6 sm:grid-cols-2">
            <Tile>
              <TileTitle meta="Boundary">Workflow vs. agent</TileTitle>
              <p className="mb-3 text-sm leading-relaxed text-muted-foreground text-pretty">
                A workflow has the control flow written by you: fixed steps, predictable cost, easy
                to debug. An agent decides its own control flow at runtime.
              </p>
              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-chart-2">→</span> Known path, repeated? Write a workflow.
                </li>
                <li className="flex gap-2">
                  <span className="text-chart-3">→</span> Unknown path, open-ended input? Use an agent.
                </li>
              </ul>
            </Tile>
            <Note label="Cost warning">
              Every loop iteration re-sends the whole growing context. A ten-step agent can cost
              far more than ten single calls — budget by step count and cap it explicitly.
            </Note>
          </div>
        </div>
      </div>
    </Section>
  )
}
