"use client"
// The GO DEEPER reference as a card. YouTube links become a lite embed: the real thumbnail and a
// play mark; nothing loads from Google until the reader clicks, then the privacy-enhanced player
// swaps in. Everything else becomes a link card with its domain.
import { useState } from "react"

const ACC = "var(--figure-accent)"
const INK_ACC = "var(--figure-accent-ink)"

export function youtubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/)
  return m ? m[1] : null
}

function domainOf(url: string) {
  try { return new URL(url).hostname.replace(/^www\./, "") } catch { return url }
}

export function VideoCard({ id, title, note }: { id: string; title: string; note?: string }) {
  const [playing, setPlaying] = useState(false)
  return (
    <figure className="mt-8 border border-border bg-secondary/30 p-4">
      <p className="font-mono text-[10px] uppercase tracking-[.16em]" style={{ color: INK_ACC }}>Watch</p>
      <div className="relative mt-3 aspect-video w-full overflow-hidden bg-card">
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} aria-label={`Play: ${title}`} className="group absolute inset-0 h-full w-full">
            <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            <span className="absolute inset-0 bg-foreground/10 transition-colors group-hover:bg-foreground/5" />
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center" style={{ background: ACC }}>
              <svg viewBox="0 0 24 24" width="26" height="26" fill="var(--background)" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-3 flex items-baseline justify-between gap-4">
        <span className="text-[14px] font-medium leading-6 text-foreground">{title}</span>
        <a href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noreferrer" className="shrink-0 font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground underline underline-offset-4">youtube ↗</a>
      </figcaption>
      {note && <p className="mt-1 text-[12px] italic text-muted-foreground">{note}</p>}
    </figure>
  )
}

export function LinkCard({ url, title, note }: { url: string; title: string; note?: string }) {
  return (
    <a href={url} target="_blank" rel="noreferrer" className="group mt-8 block border border-border bg-secondary/30 p-4" style={{ borderLeft: `2px solid ${ACC}` }}>
      <p className="font-mono text-[10px] uppercase tracking-[.16em]" style={{ color: INK_ACC }}>Go deeper · {domainOf(url)}</p>
      <p className="mt-2 flex items-baseline justify-between gap-4 text-[15px] font-medium leading-6 text-foreground">
        <span>{title}</span>
        <span className="shrink-0 font-mono text-[12px] text-muted-foreground transition-transform group-hover:translate-x-0.5">→</span>
      </p>
      {note && <p className="mt-1 text-[12px] italic text-muted-foreground">{note}</p>}
    </a>
  )
}

/** One call for every section: picks the video card or the link card by URL. */
export function GoDeeper({ title, url, note }: { title?: string; url?: string; note?: string }) {
  if (!url) return null
  const id = youtubeId(url)
  const t = title?.trim() || (id ? "Watch the reference" : domainOf(url))
  return id ? <VideoCard id={id} title={t} note={note} /> : <LinkCard url={url} title={t} note={note} />
}
