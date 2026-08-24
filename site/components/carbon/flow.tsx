import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

const nodeTones = {
  blue: 'border-chart-1 bg-chart-1/10',
  teal: 'border-chart-2 bg-chart-2/10',
  magenta: 'border-chart-3 bg-chart-3/10',
  purple: 'border-chart-4 bg-chart-4/10',
  cyan: 'border-chart-5 bg-chart-5/10',
  neutral: 'border-border-strong bg-layer',
} as const

const accentText = {
  blue: 'text-chart-1',
  teal: 'text-chart-2',
  magenta: 'text-chart-3',
  purple: 'text-chart-4',
  cyan: 'text-chart-5',
  neutral: 'text-muted-foreground',
} as const

export type Tone = keyof typeof nodeTones

export function FlowNode({
  label,
  sub,
  kind,
  tone = 'neutral',
  className,
}: {
  label: string
  sub?: string
  kind?: string
  tone?: Tone
  className?: string
}) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-1 border-l-4 p-3', nodeTones[tone], className)}>
      {kind ? (
        <span
          className={cn('font-mono text-[10px] tracking-widest uppercase', accentText[tone])}
        >
          {kind}
        </span>
      ) : null}
      <span className="text-sm leading-snug font-medium text-foreground text-pretty">{label}</span>
      {sub ? (
        <span className="text-xs leading-relaxed text-muted-foreground text-pretty">{sub}</span>
      ) : null}
    </div>
  )
}

export function ArrowDown({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 py-1 pl-3" aria-hidden="true">
      <div className="flex flex-col items-center">
        <span className="h-6 w-px bg-border-strong" />
        <span className="h-0 w-0 border-x-4 border-t-5 border-x-transparent border-t-border-strong" />
      </div>
      {label ? (
        <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
          {label}
        </span>
      ) : null}
    </div>
  )
}

export function ArrowRight({ label }: { label?: string }) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-1 px-1" aria-hidden="true">
      {label ? (
        <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
          {label}
        </span>
      ) : null}
      <div className="flex items-center">
        <span className="h-px w-6 bg-border-strong" />
        <span className="h-0 w-0 border-y-4 border-l-5 border-y-transparent border-l-border-strong" />
      </div>
    </div>
  )
}

export function Lane({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('-mx-1 overflow-x-auto pb-2', className)}>
      <div className="flex min-w-max items-stretch gap-1 px-1">{children}</div>
    </div>
  )
}

export function Legend({ items }: { items: { label: string; tone: Tone }[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className={cn('h-3 w-3 border-l-4', nodeTones[item.tone])}
          />
          <span className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
            {item.label}
          </span>
        </li>
      ))}
    </ul>
  )
}
