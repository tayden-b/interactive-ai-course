import { Foundations } from "@/components/reference/foundations"
import { Stack } from "@/components/reference/stack"
import { Orchestration } from "@/components/reference/orchestration"
import { Agents } from "@/components/reference/agents"
import { AgentLoopDiagram } from "@/components/reference/agent-loop-diagram"

/**
 * Staging page for the diagrams imported verbatim from the two source repos
 * (llm-agent-field-guide, ai-agent-architecture-diagram). Everything renders
 * inside `.carbon-scope` so the Carbon palette applies to these blocks only.
 * Kept so the imported figures can be reviewed before being placed in modules.
 */
export default function ReferenceDiagrams() {
  return (
    <main className="carbon-scope min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
        <p className="font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground">
          Imported source diagrams
        </p>
        <h1 className="mt-4 text-4xl font-light">Reference figures</h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
          Pulled directly from the two source repositories, unchanged, so the geometry and colour
          match the originals exactly.
        </p>
      </div>

      <section className="mx-auto w-full max-w-6xl px-4 pb-12 md:px-6">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          Animated agent loop — runtime trace
        </p>
        <AgentLoopDiagram />
      </section>

      <Foundations />
      <Stack />
      <Agents />
      <Orchestration />
    </main>
  )
}
