import type { ReactNode } from 'react'
import { ArrowRight, FlowNode, Lane } from '@/components/carbon/flow'
import { DefinitionList, Note, Section, Tile, TileTitle } from '@/components/carbon/ui'

const layers = [
  {
    label: 'Artificial intelligence',
    detail: 'Any system that performs tasks we associate with human reasoning.',
  },
  {
    label: 'Machine learning',
    detail: 'Behaviour learned from data instead of hand-written rules.',
  },
  {
    label: 'Deep learning',
    detail: 'Many-layered neural networks that learn their own features.',
  },
  {
    label: 'Generative AI',
    detail: 'Models that produce new data: text, image, audio, code.',
  },
  {
    label: 'Large language models',
    detail: 'Transformers trained to predict the next token of text.',
  },
]

const shades = [
  'border-border-strong bg-layer',
  'border-chart-5/60 bg-chart-5/5',
  'border-chart-4/60 bg-chart-4/5',
  'border-chart-2/60 bg-chart-2/5',
  'border-chart-1 bg-chart-1/10',
]

export function Foundations() {
  return (
    <Section
      id="foundations"
      index="01"
      eyebrow="Foundations"
      title="AI is a set of nested ideas, not one technology"
      lede="Every term in the discourse sits somewhere inside this containment diagram. Read it outside-in: each ring is a narrower, more specific way of building the ring above it."
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <Tile>
          <TileTitle meta="Containment diagram">Where an LLM sits</TileTitle>
          <div className="flex flex-col">
            {layers.reduce<ReactNode>(
              (inner, _layer, i) => {
                const depth = layers.length - 1 - i
                return (
                  <div className={`border p-3 md:p-4 ${shades[depth]}`}>
                    <div className="mb-3 flex items-baseline justify-between gap-3">
                      <span className="text-sm font-medium">{layers[depth].label}</span>
                      <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
                        L{depth + 1}
                      </span>
                    </div>
                    <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
                      {layers[depth].detail}
                    </p>
                    {inner}
                  </div>
                )
              },
              <div className="border border-dashed border-border p-3 text-center font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                you are here
              </div>,
            )}
          </div>
        </Tile>

        <div className="flex flex-col gap-6">
          <Tile>
            <TileTitle meta="Rules vs. learning">The shift that made this possible</TileTitle>
            <div className="flex flex-col gap-4">
              <div>
                <p className="mb-2 font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                  Classical software
                </p>
                <Lane>
                  <FlowNode kind="input" label="Data" className="w-32" />
                  <ArrowRight />
                  <FlowNode kind="human" label="Rules written by hand" tone="neutral" className="w-40" />
                  <ArrowRight />
                  <FlowNode kind="output" label="Answers" className="w-32" />
                </Lane>
              </div>
              <div>
                <p className="mb-2 font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                  Machine learning
                </p>
                <Lane>
                  <FlowNode kind="input" label="Data + answers" tone="cyan" className="w-32" />
                  <ArrowRight />
                  <FlowNode
                    kind="training"
                    label="Rules inferred by optimisation"
                    tone="blue"
                    className="w-40"
                  />
                  <ArrowRight />
                  <FlowNode kind="artifact" label="A model" tone="teal" className="w-32" />
                </Lane>
              </div>
            </div>
          </Tile>

          <Tile>
            <TileTitle meta="Vocabulary">Terms you will meet later</TileTitle>
            <DefinitionList
              items={[
                {
                  term: 'Parameters',
                  detail:
                    'The learned numbers inside a model — its weights. Size is quoted in billions (7B, 70B, 400B).',
                },
                {
                  term: 'Token',
                  detail:
                    'The unit a model reads and writes. Roughly ¾ of an English word, but arbitrary bytes in practice.',
                },
                {
                  term: 'Inference',
                  detail: 'Running a trained model to produce output. Training happens once; inference happens forever.',
                },
                {
                  term: 'Agent',
                  detail:
                    'A model placed in a loop with tools, memory and a goal, allowed to decide its own next step.',
                },
              ]}
            />
          </Tile>

          <Note label="Caveat">
            None of this involves understanding in the human sense. An LLM is a very good conditional
            probability machine — the capability comes from scale, data and feedback, not from an
            inner world model we designed.
          </Note>
        </div>
      </div>
    </Section>
  )
}
