"use client"

import { useEffect, useState } from "react"

// Resolves from random mono characters to the real text over ~700ms, once, on mount.
// Server-renders the real text, so no-JS and reduced-motion readers see it static.
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·—/<>"
const DURATION = 700

export function ScrambleText({ text }: { text: string }) {
  const [shown, setShown] = useState(text)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION)
      const settled = Math.floor(t * text.length)
      let out = ""
      for (let i = 0; i < text.length; i++) {
        const c = text[i]
        out += i < settled || c === " " ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
      }
      setShown(out)
      if (t < 1) raf = requestAnimationFrame(tick); else setShown(text)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [text])
  return <span aria-label={text}><span aria-hidden>{shown}</span></span>
}
