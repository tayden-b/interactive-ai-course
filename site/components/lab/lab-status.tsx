"use client"

import { useLab } from "@/lib/lab"

/**
 * The one element that makes the local folder visibly part of the site. It sits in the
 * setup page and anywhere we want the reader to see that their lab is live.
 */
export function LabStatus() {
  const { status, port, progress, traceCount, refresh } = useLab()
  const on = status === "on"
  const dot = on ? "var(--figure-accent)" : "var(--muted-foreground)"
  const current = progress?.module
  const passed = Object.values(progress?.modules ?? {}).filter((m) => m.passed).length

  return (
    <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">
      <span aria-hidden className="inline-block h-[7px] w-[7px] rounded-full" style={{ background: dot }} />
      {status === "probing" && "Looking for your lab…"}
      {status === "off" && (
        <>
          Lab not connected
          <button type="button" onClick={refresh}
            className="underline underline-offset-4 hover:text-foreground">Check again</button>
        </>
      )}
      {on && (
        <>
          Lab connected · :{port}
          {current ? ` · module ${current}` : ""}
          {passed ? ` · ${passed} passed` : ""}
          {traceCount ? ` · ${traceCount} run${traceCount === 1 ? "" : "s"}` : ""}
        </>
      )}
    </span>
  )
}
