"use client"

import { useState } from "react"

/** A command with a copy button. The whole setup flow is built out of these. */
export function Copy({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(text).then(
          () => { setCopied(true); setTimeout(() => setCopied(false), 1600) },
          () => {},
        )
      }}
      className="group inline-flex max-w-full items-center gap-3 border border-border bg-card px-3 py-2 text-left transition-colors hover:bg-secondary"
      aria-label={`Copy: ${label ?? text}`}
    >
      <code className="truncate font-mono text-xs text-foreground">{text}</code>
      <span
        className="shrink-0 font-mono text-[9px] uppercase tracking-[.16em]"
        style={{ color: copied ? "var(--figure-accent)" : "var(--muted-foreground)" }}
      >
        {copied ? "Copied" : "Copy"}
      </span>
    </button>
  )
}
