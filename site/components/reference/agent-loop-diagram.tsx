'use client'

import { useCallback, useEffect, useState } from 'react'
import { Pause, Play, RotateCcw, ChevronRight } from 'lucide-react'
import {
  EDGES,
  EVALUATE_STEP,
  LOOP_BACK_STEP,
  MAX_ITERATIONS,
  NODES,
  STEPS,
  type DiagramNode,
  type EdgeId,
  type NodeId,
} from './agent-diagram-data'

const SPEEDS = [
  { label: '1x', ms: 2600 },
  { label: '2x', ms: 1400 },
  { label: '0.5x', ms: 4200 },
]

export function AgentLoopDiagram() {
  const [step, setStep] = useState(0)
  const [iteration, setIteration] = useState(1)
  const [playing, setPlaying] = useState(true)
  const [speedIdx, setSpeedIdx] = useState(0)

  const advance = useCallback(() => {
    setStep((current) => {
      if (current === EVALUATE_STEP && iteration < MAX_ITERATIONS) {
        setIteration((n) => n + 1)
        return LOOP_BACK_STEP
      }
      if (current === STEPS.length - 1) {
        setIteration(1)
        return 0
      }
      return current + 1
    })
  }, [iteration])

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(advance, SPEEDS[speedIdx].ms)
    return () => window.clearInterval(timer)
  }, [playing, advance, speedIdx])

  const active = STEPS[step]
  const isNodeActive = (id: NodeId) => active.nodes.includes(id)
  const isEdgeActive = (id: EdgeId) => active.edges.includes(id)

  return (
    <section className="border border-border bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            Runtime trace
          </span>
          <span className="h-4 w-px bg-border" aria-hidden="true" />
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
            {`iteration ${String(iteration).padStart(2, '0')} / ${String(MAX_ITERATIONS).padStart(2, '0')}`}
          </span>
        </div>
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="flex h-9 items-center gap-2 border border-border px-3 font-mono text-[11px] uppercase tracking-[0.12em] text-foreground transition-colors hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-pressed={playing}
          >
            {playing ? (
              <Pause className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Play className="h-4 w-4" aria-hidden="true" />
            )}
            {playing ? 'Pause' : 'Play'}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep(0)
              setIteration(1)
            }}
            className="flex h-9 items-center gap-2 border border-l-0 border-border px-3 font-mono text-[11px] uppercase tracking-[0.12em] text-foreground transition-colors hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset
          </button>
          <button
            type="button"
            onClick={() => setSpeedIdx((i) => (i + 1) % SPEEDS.length)}
            className="flex h-9 items-center gap-2 border border-l-0 border-border px-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Speed {SPEEDS[speedIdx].label}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px]">
        {/* Diagram */}
        <div className="overflow-x-auto border-b border-border lg:border-b-0 lg:border-r">
          <svg
            viewBox="0 0 1120 720"
            className="h-auto w-full min-w-[900px]"
            role="img"
            aria-label="Architecture diagram of an AI agent loop: request, orchestrator, LLM reasoning, tool execution, observation and final response, supported by context window, memory, tool registry and guardrails."
          >
            <defs>
              <marker
                id="arrow-idle"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M0,1 L9,5 L0,9 z" className="fill-border-strong" />
              </marker>
              <marker
                id="arrow-active"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M0,1 L9,5 L0,9 z" className="fill-accent" />
              </marker>
              <pattern
                id="grid"
                width="16"
                height="16"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M16,0 H0 V16"
                  fill="none"
                  stroke="var(--grid-line)"
                  strokeWidth="1"
                />
              </pattern>
            </defs>

            <rect width="1120" height="720" fill="url(#grid)" />

            {/* Loop region annotation */}
            <text
              x="786"
              y="438"
              className="fill-muted-foreground font-mono"
              fontSize="10"
              letterSpacing="1.4"
            >
              AGENT LOOP
            </text>
            <text
              x="786"
              y="458"
              className="fill-muted-foreground font-mono"
              fontSize="10"
              letterSpacing="0.6"
            >
              until goal met
            </text>

            {/* Shared services band label */}
            <text
              x="1080"
              y="574"
              textAnchor="end"
              className="fill-muted-foreground font-mono"
              fontSize="10"
              letterSpacing="1.2"
            >
              PLATFORM SERVICES
            </text>

            {/* Edges */}
            {EDGES.map((edge) => {
              const on = isEdgeActive(edge.id)
              return (
                <g key={edge.id}>
                  <path
                    d={edge.d}
                    fill="none"
                    strokeWidth={1}
                    strokeDasharray={edge.style === 'dashed' ? '3 4' : undefined}
                    className={on ? 'stroke-accent' : 'stroke-border-strong'}
                    markerEnd={
                      edge.style === 'solid'
                        ? `url(#${on ? 'arrow-active' : 'arrow-idle'})`
                        : undefined
                    }
                    opacity={edge.style === 'dashed' && !on ? 0.5 : 1}
                  />
                  {on && edge.style === 'solid' ? (
                    <path
                      d={edge.d}
                      fill="none"
                      strokeWidth={3}
                      className="edge-flow stroke-accent"
                    />
                  ) : null}
                  {edge.label ? (
                    <text
                      x={edge.label.x}
                      y={edge.label.y}
                      textAnchor={edge.label.anchor ?? 'start'}
                      fontSize="10"
                      letterSpacing="0.4"
                      className={`font-mono ${on ? 'fill-accent' : 'fill-muted-foreground'}`}
                    >
                      {edge.label.text}
                    </text>
                  ) : null}
                </g>
              )
            })}

            {/* Nodes */}
            {NODES.map((node) => (
              <DiagramBox
                key={node.id}
                node={node}
                active={isNodeActive(node.id)}
              />
            ))}
          </svg>
        </div>

        {/* Step rail */}
        <div className="bg-card">
          <ol className="divide-y divide-border">
            {STEPS.map((s, i) => {
              const on = i === step
              return (
                <li key={s.index}>
                  <button
                    type="button"
                    onClick={() => setStep(i)}
                    aria-current={on ? 'step' : undefined}
                    className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      on ? 'bg-secondary' : 'hover:bg-secondary/60'
                    }`}
                  >
                    <span
                      className={`mt-[3px] h-4 w-[3px] shrink-0 ${on ? 'bg-accent' : 'bg-transparent'}`}
                      aria-hidden="true"
                    />
                    <span
                      className={`font-mono text-[11px] leading-5 ${on ? 'text-accent' : 'text-muted-foreground'}`}
                    >
                      {s.index}
                    </span>
                    <span className="flex-1">
                      <span
                        className={`block text-sm leading-5 ${on ? 'text-foreground' : 'text-muted-foreground'}`}
                      >
                        {s.title}
                      </span>
                      {on ? (
                        <span className="rise mt-1 block text-[12px] leading-relaxed text-muted-foreground">
                          {s.body}
                        </span>
                      ) : null}
                    </span>
                    {on ? (
                      <ChevronRight
                        className="mt-1 h-4 w-4 shrink-0 text-accent"
                        aria-hidden="true"
                      />
                    ) : null}
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}

function DiagramBox({ node, active }: { node: DiagramNode; active: boolean }) {
  const support = node.variant === 'support'
  return (
    <g>
      {active ? (
        <rect
          x={node.x - 4}
          y={node.y - 4}
          width={node.w + 8}
          height={node.h + 8}
          fill="none"
          strokeWidth={1}
          className="node-pulse stroke-accent"
        />
      ) : null}
      <rect
        x={node.x}
        y={node.y}
        width={node.w}
        height={node.h}
        className={active ? 'fill-secondary' : 'fill-card'}
        stroke={active ? 'var(--accent)' : 'var(--border)'}
        strokeWidth={1}
      />
      <rect
        x={node.x}
        y={node.y}
        width={3}
        height={node.h}
        className={
          active ? 'fill-accent' : support ? 'fill-support' : 'fill-border-strong'
        }
        opacity={active ? 1 : support ? 0.8 : 1}
      />
      <text
        x={node.x + 18}
        y={node.y + 24}
        fontSize="10"
        letterSpacing="1.2"
        className={`font-mono ${active ? 'fill-accent' : 'fill-muted-foreground'}`}
      >
        {node.kind.toUpperCase()}
      </text>
      <text
        x={node.x + 18}
        y={node.y + 48}
        fontSize={support ? 14 : 16}
        fontWeight={500}
        className="fill-foreground font-sans"
      >
        {node.name}
      </text>
      {node.lines.map((line, i) => (
        <text
          key={line}
          x={node.x + 18}
          y={node.y + 68 + i * 16}
          fontSize="11"
          className="fill-muted-foreground font-sans"
        >
          {line}
        </text>
      ))}
    </g>
  )
}
