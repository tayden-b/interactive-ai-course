import { AnimatedSphere } from "@/components/landing/animated-sphere"
import { AnimatedWave } from "@/components/landing/animated-wave"
import { AnimatedTetrahedron } from "@/components/landing/animated-tetrahedron"
import { StackFigure } from "@/components/book/lesson-one"
import { Fig01, Fig02, Fig03, Fig04, Fig05, Fig06, Fig07, Fig08, Fig09, Fig10, Fig11, Fig12, Fig13, Fig14 } from "@/components/figures/course-figures"

const figures = [
  ["01", "Text in, text out", "Module 1 · Section 4", Fig01],
  ["02", "What the model sees", "Module 1 · Section 7", Fig02],
  ["03", "Model, your code, tools", "Module 3 · Section 1", Fig03],
  ["04", "The agent loop", "Module 3 · Section 4", Fig04],
  ["05", "Where memory lives", "Module 4 · Section 3", Fig05],
  ["06", "Gates around the loop", "Module 6 · Section 6", Fig06],
  ["07", "Many loops — the Desk", "Module 8 · Section 1", Fig07],
  ["08", "A ranked list", "Module 1 · Section 3", Fig08],
  ["09", "Ninety percent, ten times", "Module 5 · Section 5", Fig09],
  ["10", "One run, read back", "Module 8 · Section 6", Fig10],
  ["11", "The lethal trifecta", "Module 6 · Section 4", Fig11],
  ["12", "Nearest in meaning", "Module 4 · Section 4", Fig12],
  ["13", "Folding the transcript", "Module 4 · Section 2", Fig13],
  ["14", "The round trip, in order", "Module 3 · Section 3", Fig14],
] as const

const parts = [
  ["Particle / dot-sphere globe", AnimatedSphere],
  ["Animated wave", AnimatedWave],
  ["Animated tetrahedron", AnimatedTetrahedron],
  ["Seven-layer request stack", StackFigure],
] as const

export default function GraphicsArchive() {
  return (
    <main className="min-h-screen bg-background px-6 py-12 text-foreground md:px-12">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground">Parts bin</p>
        <h1 className="mt-4 font-display text-6xl">Graphics archive</h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
          Fourteen figures carry the book. They share one geometry — the model is always the same
          box, the window always a tray, the loop always a ring — and each one puts exactly one shape
          in solid ink: the single thing it is teaching. Figures 8–10 open three new families — quantity, state and trace — for claims that are not architectural.
        </p>

        <div className="mt-14 space-y-12">
          {figures.map(([n, title, where, Component]) => (
            <section key={n}>
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">
                  Figure {n} — {title}
                </p>
                <p className="font-mono text-[10px] text-muted-foreground">{where}</p>
              </div>
              <figure className="mt-3 border border-border bg-secondary/30 p-4">
                <Component />
              </figure>
            </section>
          ))}
        </div>

        <p className="mt-20 font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground">
          Template parts, kept for reuse
        </p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {parts.map(([label, Component]) => (
            <section key={label} className="border border-border p-5">
              <p className="font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">{label}</p>
              <div className="mt-5 flex min-h-56 items-center justify-center overflow-hidden">
                <Component />
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
