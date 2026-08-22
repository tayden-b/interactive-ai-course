import { AnimatedSphere } from "@/components/landing/animated-sphere"
import { AnimatedWave } from "@/components/landing/animated-wave"
import { AnimatedTetrahedron } from "@/components/landing/animated-tetrahedron"
import { StackFigure } from "@/components/book/lesson-one"

const parts = [["Particle / dot-sphere globe", AnimatedSphere], ["Animated wave", AnimatedWave], ["Animated tetrahedron", AnimatedTetrahedron], ["Seven-layer request stack", StackFigure]] as const

export default function GraphicsArchive() { return <main className="min-h-screen bg-background px-6 py-12 text-foreground md:px-12"><div className="mx-auto max-w-6xl"><p className="font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground">Parts bin</p><h1 className="mt-4 font-display text-6xl">Graphics archive</h1><p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">Reusable diagrams and motion from the course. This page is intentionally separate so future lessons can borrow from it.</p><div className="mt-12 grid gap-6 md:grid-cols-2">{parts.map(([label, Component]) => <section key={label} className="border border-border p-5"><p className="font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">{label}</p><div className="mt-5 flex min-h-56 items-center justify-center overflow-hidden"><Component /></div></section>)}</div></div></main> }
