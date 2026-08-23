import Link from "next/link"
import { ReadingFrame, Eyebrow } from "@/components/book/reading-frame"
import { Copy } from "@/components/lab/copy"
import { LabStatus } from "@/components/lab/lab-status"
import { YourRun } from "@/components/lab/your-run"

const ACC = "var(--figure-accent)"
const INK = "var(--figure-accent-ink)"

const REPO = "https://github.com/tayden-b/interactive-ai-course"
const TEMPLATE = `${REPO}/generate`

/**
 * Editors register URL protocol handlers, so these links really do clone and open the repo
 * in one click. Nothing happens if the editor is not installed, which is why step 3 stands
 * on its own and every step below it works without this one.
 */
const EDITORS = [
  { name: "VS Code", href: `vscode://vscode.git/clone?url=${encodeURIComponent(REPO)}` },
  { name: "Cursor", href: `cursor://vscode.git/clone?url=${encodeURIComponent(REPO)}` },
  { name: "GitHub Desktop", href: `x-github-client://openRepo/${REPO}` },
]

function Step({ n, title, children, note }: { n: string; title: string; children: React.ReactNode; note?: string }) {
  return (
    <li className="grid gap-4 border-t border-border py-8 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)] md:gap-10">
      <div>
        <span className="font-mono text-[10px] uppercase tracking-[.18em]" style={{ color: INK }}>Step {n}</span>
        <h2 className="mt-2 font-display text-2xl leading-tight">{title}</h2>
        {note && <p className="mt-2 text-sm leading-6 text-muted-foreground">{note}</p>}
      </div>
      <div className="min-w-0">{children}</div>
    </li>
  )
}

export default function StartPage() {
  return (
    <ReadingFrame title="Set up your lab">
      <main>
        <header className="pb-8">
          <Eyebrow>Set up · about five minutes</Eyebrow>
          <h1 className="mt-5 max-w-3xl text-balance font-display text-5xl leading-[.98] tracking-tight md:text-6xl">
            Get the lab on <span style={{ color: ACC }}>your machine</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground">
            You build in your own editor, with the coding agent you already use, in a repo you own.
            This site reads what your agent does and explains it back to you. Nothing runs in the
            browser and nothing is uploaded.
          </p>
          <p className="mt-6"><LabStatus /></p>
        </header>

        <ol className="mb-4">
          <Step n="01" title="Take your own copy"
                note="Creates the repo under your account, so your commits are yours — and the thing you show people at the end is a real repository with your history in it.">
            <a href={TEMPLATE} target="_blank" rel="noreferrer"
               className="inline-flex bg-primary px-5 py-3 text-sm text-primary-foreground">
              Use this template →
            </a>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              Or clone it directly if you would rather not fork:
            </p>
            <div className="mt-2"><Copy text={`git clone ${REPO}.git model-and-loop`} /></div>
          </Step>

          <Step n="02" title="Open it in your editor"
                note="These are real protocol links — one click clones the repo and opens it. If nothing happens, your editor is not installed and you can open the folder by hand.">
            <div className="flex flex-wrap gap-3">
              {EDITORS.map((e) => (
                <a key={e.name} href={e.href}
                   className="inline-flex border border-border px-5 py-3 text-sm transition-colors hover:bg-secondary">
                  Open in {e.name}
                </a>
              ))}
            </div>
          </Step>

          <Step n="03" title="Set up the folder"
                note="Detects which coding agent you have, writes the one adapter file it needs, creates your .env, and sets your module.">
            <div className="flex flex-col items-start gap-2">
              <Copy text="cd course && ./course init" />
              <Copy text="./course doctor" label="check your environment" />
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              <code className="font-mono">doctor</code> tells you exactly what is missing and how to fix it.
              Put your API key in <code className="font-mono">.env</code> — it is git-ignored and stays on your machine.
            </p>
          </Step>

          <Step n="04" title="Tell your agent to begin"
                note="Any agent that can read files works: Claude Code, Cursor, Codex CLI, Gemini CLI, Copilot. TUTOR.md turns it into a tutor that refuses to hand you the answer.">
            <Copy text="Read TUTOR.md and start Module 1. Do not write the solution for me." />
          </Step>

          <Step n="05" title="Connect the lab to this site"
                note="Starts a small server in your folder. Your browser reads it directly — the traces never leave your machine, and there is no account.">
            <Copy text="./course serve" />
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              Leave it running while you work. The indicator at the top of this page turns on,
              and every &ldquo;Your run&rdquo; panel starts showing your own build.
            </p>
          </Step>
        </ol>

        <section className="border-t border-border py-10">
          <Eyebrow>What you unlock</Eyebrow>
          <h2 className="mt-4 max-w-2xl text-balance font-display text-3xl leading-tight md:text-4xl">
            Every diagram becomes yours
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
            This panel is showing example data right now. With the bridge running it shows the run
            your agent just made — the same figure, your numbers.
          </p>
          <div className="mt-6 max-w-3xl"><YourRun module={3} /></div>
        </section>

        <nav aria-label="Continue" className="flex items-center justify-between border-t border-border py-10 font-mono text-[10px] uppercase tracking-[.16em]">
          <Link href="/">← Course home</Link>
          <Link href="/m/1" className="accent-ink">Module 01: What is an LLM? →</Link>
        </nav>
      </main>
    </ReadingFrame>
  )
}
