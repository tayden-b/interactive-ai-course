"use client"

/**
 * Where the reader is, kept on their device.
 *
 * Two facts, both written automatically as sections are opened: which sections have been
 * seen, and the last one. Nothing is uploaded; the key lives in localStorage and the same
 * module-level store feeds every component that asks, so the rail, the landing page and
 * the header all agree without prop-drilling.
 */

import { useSyncExternalStore } from "react"

const KEY = "llmtextbook-progress"

export type Place = { module: number; section: number; at: number }
export type Progress = { seen: Record<string, number>; last: Place | null }

const EMPTY: Progress = { seen: {}, last: null }

let cache: Progress | null = null
const listeners = new Set<() => void>()

function read(): Progress {
  if (cache) return cache
  if (typeof window === "undefined") return EMPTY
  try {
    const raw = window.localStorage.getItem(KEY)
    const parsed = raw ? (JSON.parse(raw) as Partial<Progress>) : null
    cache = { seen: parsed?.seen ?? {}, last: parsed?.last ?? null }
  } catch {
    cache = { ...EMPTY }
  }
  return cache
}

function write(next: Progress) {
  cache = next
  try { window.localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* private mode, quota: the page still works */ }
  listeners.forEach((l) => l())
}

function subscribe(l: () => void) {
  listeners.add(l)
  const onStorage = (e: StorageEvent) => { if (e.key === KEY) { cache = null; l() } }
  window.addEventListener("storage", onStorage)
  return () => { listeners.delete(l); window.removeEventListener("storage", onStorage) }
}

export const sectionKey = (module: number, section: number) => `${module}/${section}`

/** Record that a section is open. Called once per section view. */
export function markSeen(module: number, section: number) {
  if (!(module > 0 && section > 0)) return
  const cur = read()
  const now = Date.now()
  write({ seen: { ...cur.seen, [sectionKey(module, section)]: now }, last: { module, section, at: now } })
}

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, read, () => EMPTY)
}

/** How many of a module's sections have been opened. */
export function seenCount(p: Progress, module: number, total: number): number {
  let n = 0
  for (let s = 1; s <= total; s++) if (p.seen[sectionKey(module, s)]) n++
  return n
}
