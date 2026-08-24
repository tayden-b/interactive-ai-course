"use client"

/**
 * The entire setup experience: one sentence you paste into the agent you already have.
 *
 * There is deliberately no setup page. Setup is not a destination. It appears inline at
 * the moment someone first needs it (a module's project section), and collapses to a
 * single line once their lab is running.
 *
 * The prompt is a *pointer*, not a script. SETUP.md lives on the server, so onboarding can
 * be fixed for everyone without anybody re-copying anything, and every agent follows the
 * same ordered steps instead of improvising its own idea of a course folder.
 */

import { useState } from "react"
import { useLab } from "@/lib/lab"
import { BRAND } from "@/lib/brand"

const ACC = "var(--figure-accent)"
const INK = "var(--figure-accent-ink)"

/**
 * The site serves SETUP.md itself, so onboarding can be fixed by editing one file and
 * pushing — nobody re-copies the prompt. Update this if a custom domain is attached.
 */
const SETUP_URL = "https://llm-textbook.vercel.app/setup.md"

const REPO = "https://github.com/tayden-b/interactive-ai-course"

export function promptFor(module: number) {
  return `Set up ${BRAND} and start Module ${module}: read ${SETUP_URL} and follow it exactly.`
}

export function LabPrompt({ module = 1 }: { module?: number }) {
  const { status, port, progress, refresh } = useLab()
  const [copied, setCopied] = useState(false)
  const text = promptFor(module)

  const copy = () =>
    navigator.clipboard?.writeText(text).then(
      () => { setCopied(true); setTimeout(() => setCopied(false), 2000) },
      () => {},
    )

  // Already set up — get out of the way.
  if (status === "on") {
    const passed = Object.values(progress?.modules ?? {}).filter((m) => m.passed).length
    return (
      <p className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">
        <span aria-hidden className="inline-block h-[7px] w-[7px] rounded-full" style={{ background: ACC }} />
        Your lab is connected · :{port}
        {passed > 0 && ` · ${passed} module${passed === 1 ? "" : "s"} passed`}
      </p>
    )
  }

  return (
    <div className="border border-border bg-card p-5 md:p-6">
      <p className="font-mono text-[10px] uppercase tracking-[.18em]" style={{ color: INK }}>
        To build this, paste one line into your coding agent
      </p>

      <button
        type="button"
        onClick={copy}
        className="group mt-4 flex w-full items-start gap-4 border border-border bg-secondary/40 p-4 text-left transition-colors hover:bg-secondary"
        aria-label="Copy the setup prompt"
      >
        <code className="min-w-0 flex-1 font-mono text-xs leading-6 text-foreground">{text}</code>
        <span
          className="shrink-0 font-mono text-[9px] uppercase tracking-[.16em]"
          style={{ color: copied ? ACC : "var(--muted-foreground)" }}
        >
          {copied ? "Copied" : "Copy"}
        </span>
      </button>

      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        Your agent clones the course, sets it up, asks you for an API key, and becomes your
        tutor: one that won&rsquo;t write your code for you. Works with Claude Code, Cursor,
        Codex CLI, Gemini CLI, or Copilot.
      </p>

      <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">
        <button type="button" onClick={refresh} className="underline underline-offset-4 hover:text-foreground">
          {status === "probing" ? "Looking for your lab…" : "I've done this, check again"}
        </button>
        <a href={REPO} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-foreground">
          Or set it up by hand
        </a>
      </p>
    </div>
  )
}
