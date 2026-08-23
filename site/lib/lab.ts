"use client"

/**
 * The bridge, browser side.
 *
 * The learner runs `./course serve` in the folder they cloned; that opens a tiny HTTP
 * server on localhost. This page fetches it directly from their browser, so their traces
 * are never uploaded anywhere — the data goes from their disk to their own tab.
 *
 * Browsers treat http://localhost as a trustworthy origin, so an https page is allowed to
 * reach it. If a browser blocks it anyway, everything here degrades to `status: "off"`
 * and the UI falls back to the demo trace. Nothing breaks.
 */

import { useEffect, useState } from "react"

/** `course serve` binds the first of these that is free, so we try them in the same order. */
export const LAB_PORTS = [4747, 4748, 4749, 4750]
const POLL_MS = 4000
const TIMEOUT_MS = 900

export type SpanKind = "llm" | "tool" | "step"

export type Span = {
  id: string
  parent_id: string | null
  kind: SpanKind
  name: string
  started_at: string
  duration_ms: number
  attributes: Record<string, unknown>
  error?: { type: string; message: string }
}

export type Trace = {
  schema: string
  trace_id: string
  module: number
  agent: string
  started_at: string
  ended_at: string
  totals: {
    llm_calls: number
    tool_calls: number
    errors: number
    input_tokens: number
    output_tokens: number
    usd_estimate: number
    duration_ms: number
  }
  spans: Span[]
}

export type Progress = {
  module?: number
  modules?: Record<string, { passed: boolean; checked_at: string }>
}

export type LabState = {
  status: "probing" | "on" | "off"
  port: number | null
  trace: Trace | null
  progress: Progress | null
  traceCount: number
  refresh: () => void
}

async function getJSON<T>(url: string): Promise<T | null> {
  const ctl = new AbortController()
  const t = setTimeout(() => ctl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, { signal: ctl.signal, cache: "no-store" })
    return res.ok ? ((await res.json()) as T) : null
  } catch {
    return null // offline, blocked, or nothing listening — all the same to us
  } finally {
    clearTimeout(t)
  }
}

/* ---------------------------------------------------------------------------
 * One poller for the whole page.
 *
 * Every consumer used to run its own interval across all four ports, so a page
 * with two panels made eight requests every four seconds — and when the bridge
 * is off, each one is a red ERR_CONNECTION_REFUSED in the console. The browser
 * logs those at the network layer, so try/catch cannot silence them; the only
 * real fix is to ask far less often.
 *
 * So: a single module-level store, one request per cycle, and a backoff that
 * relaxes from 4s to 30s while nothing is listening. The moment the bridge
 * answers, it snaps back to fast polling.
 * ------------------------------------------------------------------------- */

const FAST_MS = 4000
const SLOW_MS = 30000

type Snapshot = Omit<LabState, "refresh">

let snapshot: Snapshot = { status: "probing", port: null, trace: null, progress: null, traceCount: 0 }
let listeners = new Set<() => void>()
let timer: ReturnType<typeof setTimeout> | null = null
let knownPort: number | null = null
let probeIndex = 0
let misses = 0

function emit(next: Partial<Snapshot>) {
  snapshot = { ...snapshot, ...next }
  listeners.forEach((l) => l())
}

async function cycle() {
  // When connected, only re-check the port we know. When not, try one port per
  // cycle rather than all four — a quiet failure costs a single request.
  const port = knownPort ?? LAB_PORTS[probeIndex++ % LAB_PORTS.length]
  const root = await getJSON<{ service?: string }>(`http://localhost:${port}/`)

  if (root?.service !== "model-and-loop") {
    knownPort = null
    misses += 1
    if (snapshot.status !== "off") {
      emit({ status: "off", port: null, trace: null, progress: null, traceCount: 0 })
    }
  } else {
    knownPort = port
    misses = 0
    const base = `http://localhost:${port}`
    const [trace, progress, list] = await Promise.all([
      getJSON<Trace>(`${base}/trace`),
      getJSON<Progress>(`${base}/progress`),
      getJSON<{ traces: string[] }>(`${base}/traces`),
    ])
    emit({ status: "on", port, trace, progress, traceCount: list?.traces?.length ?? 0 })
  }

  // Back off while nothing is there: 4s, 8s, 16s, then 30s.
  const delay = knownPort ? FAST_MS : Math.min(SLOW_MS, FAST_MS * 2 ** Math.min(misses, 3))
  timer = setTimeout(cycle, delay)
}

function start() {
  if (timer === null) cycle()
}

function stop() {
  if (timer !== null) { clearTimeout(timer); timer = null }
}

/** Force an immediate re-check — used by "I started it, look again" buttons. */
export function recheck() {
  stop()
  misses = 0
  knownPort = null
  emit({ status: "probing" })
  cycle()
}

export function useLab(): LabState {
  const [, force] = useState(0)

  useEffect(() => {
    const listener = () => force((n) => n + 1)
    listeners.add(listener)
    start()
    return () => {
      listeners.delete(listener)
      if (listeners.size === 0) stop() // nothing on screen needs it any more
    }
  }, [])

  return { ...snapshot, refresh: recheck }
}

/** The command that starts the bridge — shown wherever we tell someone to turn it on. */
export const SERVE_CMD = "./course serve"
