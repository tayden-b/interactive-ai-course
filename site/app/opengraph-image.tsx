import { ImageResponse } from "next/og"

export const alt = "textbook.ai · Your guide to LLMs and agents"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

/**
 * The link preview. This is the first thing anyone sees when the URL is pasted into a
 * message, an email, or LinkedIn — before the site itself — so it carries the same warm
 * paper, the same blue, and the same sentence as the hero.
 *
 * Rendered by Satori, which supports a subset of CSS: every container needs an explicit
 * display, and flex is the only layout that behaves.
 */
export default function OpengraphImage() {
  const paper = "#faf9f7"
  const ink = "#1a1a1a"
  const blue = "#2563f0"
  const muted = "#6b6b6b"

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          justifyContent: "space-between", background: paper, padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", width: 10, height: 10, background: blue }} />
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, color: muted, textTransform: "uppercase" }}>
            textbook.ai
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 96, color: ink, lineHeight: 1.05, letterSpacing: -3 }}>
            Your guide to
          </div>
          <div style={{ display: "flex", fontSize: 96, color: blue, lineHeight: 1.05, letterSpacing: -3 }}>
            LLMs and agents
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 30, color: muted, lineHeight: 1.4 }}>
            Eight modules of content, with built-in projects to build your portfolio.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid #e2e0dc`, paddingTop: 26 }}>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 2, color: muted, textTransform: "uppercase" }}>
            Build it locally · see your own run
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ display: "flex", width: 46, height: 12, background: ink }} />
            <div style={{ display: "flex", width: 22, height: 12, background: blue }} />
            <div style={{ display: "flex", width: 58, height: 12, background: ink }} />
          </div>
        </div>
      </div>
    ),
    size,
  )
}
