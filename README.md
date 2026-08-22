# Interactive AI Course

A visual, hands-on book on how LLMs and agents actually work — for technically-minded people who
aren't yet AI-fluent. The site is the textbook; a local `course/` folder is the workbook the learner
opens with their own AI coding agent, and the site renders traces from their own runs.

## Layout

- `site/` — the Next.js site. Source of truth for code. Originates from a v0 chat (see below).
- `course/` — the learner's local lab folder (TUTOR.md, trace.py, progress.json). Not built yet.
- `tools/figures/` — the figure pipeline: SVG sources, the render harness, and the sync script.

## The v0 ↔ repo contract

The site lives in a v0 chat AND in this repo. They are kept in sync deliberately, not accidentally:

| Work | Where it happens | Why |
|---|---|---|
| Page/layout/UI generation, design exploration | **v0** | It's genuinely good at this, and it's 7 prompts/day. |
| Figures, content, trace wiring, anything iterative | **this repo** | Unlimited iteration and a real visual feedback loop. |

- **Pull from v0:** `tools/figures/sync.sh pull` — downloads the current v0 version and overwrites `site/`.
- **Push to v0:** `tools/figures/sync.sh push <file>...` — writes files into the v0 version via
  `PATCH /chats/{id}/versions/{id}` with `locked: true`, so v0's model will not overwrite them.
  This costs **no** message budget (it is not a generation).

Always `pull` before starting repo work if anything was prompted in v0 since the last sync.

## Figures

Seven architectural figures carry the whole book. They are authored here as static SVG, verified by
rendering into a pixel-faithful replica of the site's `<Figure>` frame, then pushed to v0 as locked
files. See `tools/figures/VISUAL-LANGUAGE.md` for the rules — the short version: light warm paper,
pure monochrome (the site has no accent colour), and exactly one solid-filled shape per figure.

## Run it

```bash
cd site && pnpm install && pnpm dev
```
