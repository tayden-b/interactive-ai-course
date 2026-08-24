# textbook.ai

**Live: https://llm-textbook.vercel.app**

The repo keeps the working name *interactive-ai-course*; the product is displayed as
**textbook.ai** (see `site/lib/brand.ts`) and deploys to `llm-textbook.vercel.app`.

A visual, hands-on book on how LLMs and agents actually work — for technically-minded people who
aren't yet AI-fluent. The site is the textbook; a local `course/` folder is the workbook the learner
opens with their own AI coding agent, and the site renders traces from their own runs.

## Layout

- `site/` — the Next.js site. Source of truth for code. Originates from a v0 chat (see below).
- `course/` — the learner's local lab folder (TUTOR.md, trace.py, progress.json). Not built yet.
- `tools/figures/` — the figure pipeline: SVG sources, the render harness, and the sync script.

## The v0 ↔ repo contract

The site started in a v0 chat and still lives there, but **this repo is the source of truth** and
deployments go from here. The relationship is deliberately one-way.

| | |
|---|---|
| **v0 → repo** | Works exactly. `tools/figures/sync.sh pull` downloads the current v0 version over `site/`. |
| **repo → v0** | **Does not work.** Verified 2026-08-22: `PATCH /chats/{id}/versions/{id}` records file entries on the version object, but the exported and built project is unaffected — code written that way never reaches the preview or a deployment. Don't rely on it. |

So: **v0 is a design sandbox.** Prompt it for layout and UI ideas (it's good at that, and it's capped
at 7 messages/day), then `pull` and keep what's worth keeping. Figures, content, and anything that
needs real iteration are built here, where the loop is free and you can actually look at the result.

```bash
tools/figures/sync.sh status   # chat, version, remaining message budget
tools/figures/sync.sh diff     # what differs between v0's project and site/
tools/figures/sync.sh pull     # OVERWRITES site/ — commit first, reconcile in git
```

## Figures

Fourteen drawn figures carry the book (`tools/figures/svg/`), in five families — architecture,
quantity, state, sequence, trace (`FAMILIES.md`). They are authored as static SVG, verified by
rendering into a pixel-faithful replica of the site's `<Figure>` frame (`render.sh`, `sheet.sh`),
generated into `site/components/figures/course-figures.tsx` by `build.mjs`, and wired into their
sections by `place.py`. The other figure slots are typeset blocks built on
`site/components/figures/kit.tsx` (code, transcript, compare, table, steps, note, flow, numbers).
The rules are in `VISUAL-LANGUAGE.md`: light warm paper, near-black ink, and ONE accent — electric
blue — on exactly one shape per figure.

## Run it

```bash
cd site && pnpm install && pnpm dev
```

## Deploy

The repo is on GitHub at https://github.com/tayden-b/interactive-ai-course. To make it live:
import the repo in Vercel, set the **root directory to `site/`**, and accept the Next.js defaults.
A clean `npm install` and `npm run build` are verified; every later push to `main` deploys itself.
There is no `vercel` CLI session on this machine, so that one import is a click in the Vercel UI.
