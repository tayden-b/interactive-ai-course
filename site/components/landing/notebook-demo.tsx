"use client"

/**
 * The landing page's live lesson: the temperature explorer, exported to WASM, running
 * Python in the visitor's browser from static files under /demo.
 *
 * The iframe mounts only when scrolled near (the assets are heavy), a static preview
 * holds the space until the notebook is interactive, and if loading fails the preview
 * simply stays, with a link out. The page is never blank.
 */

import { useEffect, useRef, useState } from "react"

const ACC = "var(--figure-accent)"
const INK = "var(--figure-accent-ink)"

/** The placeholder chart: the same distribution the demo opens with, drawn statically. */
function PreviewBars() {
  const bars = [86, 9, 5, 4, 3, 3, 2, 2, 2, 1, 1, 1]
  return (
    <div aria-hidden className="flex h-40 items-end gap-2 px-6">
      {bars.map((v, i) => (
        <div key={i} className="flex-1 rounded-none" style={{ height: `${v}%`, background: i === 0 ? ACC : "var(--border)" }} />
      ))}
    </div>
  )
}

export function NotebookDemo() {
  const holder = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const el = holder.current
    if (!el) return
    if (typeof IntersectionObserver === "undefined") { setNear(true); return }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect() } },
      { rootMargin: "600px 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!near || ready) return
    const t = setTimeout(() => setFailed(true), 20000)
    return () => clearTimeout(t)
  }, [near, ready])

  return (
    <div ref={holder} className="relative border border-border bg-secondary/30">
      {!ready && (
        <div className="flex h-[560px] flex-col justify-center gap-6 py-8">
          <PreviewBars />
          <p className="px-6 text-center font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">
            {failed ? (
              <a href="/demo/index.html" target="_blank" rel="noreferrer" className="underline underline-offset-4" style={{ color: INK }}>
                Open the demo in a new tab
              </a>
            ) : near ? (
              "Loading Python in your browser, the first load takes a few seconds"
            ) : (
              "A live lesson loads here"
            )}
          </p>
        </div>
      )}
      {near && !failed && (
        <iframe
          src="/demo/index.html"
          title="A lesson from the course: temperature, live in your browser"
          className={ready ? "h-[560px] w-full" : "h-0 w-full"}
          onLoad={() => setReady(true)}
        />
      )}
    </div>
  )
}
