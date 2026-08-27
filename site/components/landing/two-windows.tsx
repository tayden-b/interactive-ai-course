/**
 * The two windows, drawn. This is the picture that explains the whole experience:
 * you talk to your agent in one window, you build in the notebook it opened in the
 * other, and both live on your machine. Static, no client code.
 */

const ACC = "var(--figure-accent)"
const INK = "var(--figure-accent-ink)"

function WindowFrame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <span aria-hidden className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-border" />
          <span className="h-2 w-2 rounded-full bg-border" />
          <span className="h-2 w-2 rounded-full bg-border" />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">{label}</span>
      </div>
      <div className="flex-1 p-4">{children}</div>
    </div>
  )
}

export function TwoWindows() {
  return (
    <figure>
      <div className="grid gap-4 md:grid-cols-2">
        <WindowFrame label="Your coding agent · you talk here">
          <div className="space-y-3 text-sm leading-6">
            <p><span className="font-mono text-[10px] uppercase tracking-[.14em]" style={{ color: INK }}>tutor</span><br />
              Before we start: what do you think temperature changes about the answer?</p>
            <p className="text-muted-foreground"><span className="font-mono text-[10px] uppercase tracking-[.14em]">you</span><br />
              how the next token gets picked?</p>
            <p><span className="font-mono text-[10px] uppercase tracking-[.14em]" style={{ color: INK }}>tutor</span><br />
              Right. Open the your-turn cell in the lesson, I just added a hint above it.</p>
          </div>
        </WindowFrame>
        <WindowFrame label="The lesson, in your browser · you build here">
          <div className="space-y-3">
            <p className="font-display text-lg leading-tight">Lesson 2. Temperature</p>
            <div>
              <div className="mb-1 flex justify-between font-mono text-[9px] uppercase tracking-[.14em] text-muted-foreground"><span>temperature</span><span>0.7</span></div>
              <div className="relative h-1 w-full bg-border">
                <span aria-hidden className="absolute -top-[3px] left-[35%] h-2.5 w-2.5 rounded-full" style={{ background: ACC }} />
              </div>
            </div>
            <pre className="overflow-x-auto border border-border bg-secondary/40 p-3 font-mono text-[11px] leading-5 text-muted-foreground">{`# ---- your turn ----
def reweight(logprobs, t):
    `}<span className="inline-block h-3 w-[6px] translate-y-[2px]" style={{ background: ACC }} /></pre>
          </div>
        </WindowFrame>
      </div>
      <figcaption className="mt-3 text-center font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">
        Both windows are on your machine. The tutor hints and checks your work; it never writes your solution.
      </figcaption>
    </figure>
  )
}
