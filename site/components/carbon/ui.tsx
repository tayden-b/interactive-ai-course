import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Container({
  children,
  className,
}: { children: ReactNode; className?: string }) {
  // Full width by design: the page that hosts these sections owns the max-width and the
  // horizontal padding. Capping here left the Carbon tiles inset and double-padded.
  return <div className={cn('mx-auto w-full', className)}>{children}</div>
}

export function Section({
  id,
  index,
  eyebrow,
  title,
  lede,
  children,
}: {
  id: string
  index: string
  eyebrow: string
  title: string
  lede?: string
  children: ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-16 border-t border-border py-12 md:py-16">
      <Container>
        <header className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 font-mono text-xs tracking-widest text-muted-foreground uppercase">
              <span className="text-primary">{index}</span>
              <span aria-hidden="true" className="h-px w-6 bg-border-strong" />
              <span>{eyebrow}</span>
            </div>
            <h2 className="max-w-2xl text-2xl leading-tight font-light text-balance md:text-4xl">
              {title}
            </h2>
          </div>
          {lede ? (
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground text-pretty">
              {lede}
            </p>
          ) : null}
        </header>
        <div className="pt-6 md:pt-8">{children}</div>
      </Container>
    </section>
  )
}

export function Tile({
  children,
  className,
  as: As = 'div',
}: { children: ReactNode; className?: string; as?: 'div' | 'li' | 'article' }) {
  return (
    <As className={cn('border border-border bg-card p-5 md:p-6', className)}>{children}</As>
  )
}

export function TileTitle({
  children,
  meta,
}: { children: ReactNode; meta?: string }) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-4 border-b border-border pb-3">
      <h3 className="text-sm font-medium tracking-wide">{children}</h3>
      {meta ? (
        <span className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
          {meta}
        </span>
      ) : null}
    </div>
  )
}

const tagTones = {
  blue: 'border-chart-1/40 text-chart-1',
  teal: 'border-chart-2/40 text-chart-2',
  magenta: 'border-chart-3/40 text-chart-3',
  purple: 'border-chart-4/40 text-chart-4',
  neutral: 'border-border-strong text-muted-foreground',
} as const

export function Tag({
  children,
  tone = 'neutral',
}: { children: ReactNode; tone?: keyof typeof tagTones }) {
  return (
    <span
      className={cn(
        'inline-flex items-center border px-2 py-0.5 font-mono text-[11px] tracking-wider uppercase',
        tagTones[tone],
      )}
    >
      {children}
    </span>
  )
}

export function Stat({
  value,
  label,
  hint,
}: { value: string; label: string; hint?: string }) {
  return (
    <div className="flex flex-col gap-1 border-l-2 border-primary pl-4">
      <span className="font-mono text-2xl leading-none font-light md:text-3xl">{value}</span>
      <span className="text-xs tracking-wide text-foreground uppercase">{label}</span>
      {hint ? <span className="text-xs leading-relaxed text-muted-foreground">{hint}</span> : null}
    </div>
  )
}

export function DefinitionList({
  items,
}: { items: { term: string; detail: string }[] }) {
  return (
    <dl className="divide-y divide-border">
      {items.map((item) => (
        <div key={item.term} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
          <dt className="font-mono text-xs tracking-wider text-foreground uppercase sm:w-40 sm:shrink-0">
            {item.term}
          </dt>
          <dd className="text-sm leading-relaxed text-muted-foreground">{item.detail}</dd>
        </div>
      ))}
    </dl>
  )
}

export function Note({ children, label = 'Note' }: { children: ReactNode; label?: string }) {
  return (
    <aside className="flex gap-4 border-l-2 border-chart-2 bg-layer p-4">
      <span className="font-mono text-[11px] tracking-widest text-chart-2 uppercase">{label}</span>
      <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{children}</p>
    </aside>
  )
}
