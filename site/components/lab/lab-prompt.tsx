"use client"

/**
 * The setup prompt. One box, one line to copy, always visible.
 *
 * It used to collapse to a status line once the local bridge connected, which hid the
 * whole story from anyone looking at a connected machine. Now the prompt always shows
 * and the connection state is a footer, not a replacement.
 *
 * The prompt is a pointer, not a script: SETUP.md lives on the server, so onboarding
 * can be fixed for everyone by editing one file.
 */

import { useState } from "react"
import { useLab } from "@/lib/lab"
import { BRAND } from "@/lib/brand"

const ACC = "var(--figure-accent)"
const INK = "var(--figure-accent-ink)"

const SETUP_URL = "https://llm-textbook.vercel.app/setup.md"
const REPO = "https://github.com/tayden-b/interactive-ai-course"

export function promptFor(module: number) {
  return `Set up ${BRAND} and start Module ${module}: read ${SETUP_URL} and follow it exactly.`
}

export function LabPrompt({ module = 1, eyebrow }: { module?: number; eyebrow?: string | null }) {
  const { status, port, progress, refresh } = useLab()
  const [copied, setCopied] = useState(false)
  const text = promptFor(module)
  const connected = status === "on"
  const passed = Object.values(progress?.modules ?? {}).filter((m) => m.passed).length

  const copy = () =>
    navigator.clipboard?.writeText(text).then(
      () => { setCopied(true); setTimeout(() => setCopied(false), 2000) },
      () => {},
    )

  return (
    <div className="border border-border bg-card p-5 md:p-6">
      {eyebrow !== null && (
        <p className="font-mono text-[10px] uppercase tracking-[.18em]" style={{ color: INK }}>
          {eyebrow ?? "Copy this into your coding agent"}
        </p>
      )}

      <button
        type="button"
        onClick={copy}
        className={`group flex w-full items-start gap-4 border border-border bg-secondary/40 p-4 text-left transition-colors hover:bg-secondary ${eyebrow !== null ? "mt-4" : ""}`}
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
        Works with Claude Code, Cursor, Codex CLI, Gemini CLI, or Copilot. Your agent
        downloads the course to your machine and becomes your tutor. Everything runs
        and stays there; this site only shows your progress back to you.
      </p>

      <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">
        {connected ? (
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="inline-block h-[7px] w-[7px] rounded-full" style={{ background: ACC }} />
            Your lab is connected · :{port}
            {passed > 0 && ` · ${passed} module${passed === 1 ? "" : "s"} passed`}
          </span>
        ) : (
          <>
            <button type="button" onClick={refresh} className="underline underline-offset-4 hover:text-foreground">
              {status === "probing" ? "Looking for your lab…" : "Already set up? Check the connection"}
            </button>
            <a href={REPO} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-foreground">
              Or set it up by hand
            </a>
          </>
        )}
      </p>
    </div>
  )
}
