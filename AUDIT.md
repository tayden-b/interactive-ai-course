# Audit — LLM.TEXTBOOK ("The Model and the Loop")

Deep audit of the live course, October 2026. Every page read end to end:
all 63 sections across 8 modules plus orientation, about, kit, and graphics
pages; all 14 drawn figures rendered and checked against their captions and
the surrounding prose; every interactive/reference component; the whole
`course/` lab (TUTOR.md, GUIDE.md, SETUP.md, `./course` CLI, all eight
checks, all eight `BUILD.md`s, tracing.py).

Tags: **[FIXED]** changed in this PR · **[NEEDS-AUTHOR]** a judgment call —
tone, positioning, pricing, or a claim only the author can verify ·
**[WONT-FIX]** noted, intentionally left.

One correction to the brief's premise: `course/` currently ships `BUILD.md`
and checks for **all eight** modules, not just 1 and 3. Lab-honesty checks
below were evaluated against that reality.

## Verified clean (no findings)

- `cd site && npm ci && npm run lint && npm run build` — passes; 79 pages,
  TypeScript strict. (Lint needed repair first; see S-1.)
- Counts: "eight modules" / 63 sections / 14 figures / 1 capstone all match
  `courseTotals` and the rendered content. Section-numbering
  ("Section N of M") is correct in every module.
- Previous/Next links checked across all modules, including module-to-module
  transitions (M1→M2 … M7→M8).
- All 38 external "Go deeper" URLs checked over HTTP; 36 resolve. The two
  dead ones are fixed (M1-1, M8-1).
- Quizzes: every question's feedback array matches its options array in
  length; every `correct` index is in bounds; spot-checked answers are right.
- Accessibility basics: one `h1` per page (lesson header), drawn figures
  render `role="img"` + `aria-label`, figure captions are real `figcaption`,
  YouTube lite-embed has `aria-label` and `alt=""`.
- `course/SETUP.md` and `site/public/setup.md` are byte-identical
  (`prebuild` syncs them; falls back to the committed copy on Vercel).
- The lab bridge (lab.ts ↔ coursekit/server.py) is honest: service id,
  port range 4747–4750, trace schema `modelandloop.trace/v1`, CORS pinned
  to the site + localhost origins.
- All eight `checks/*.py` assert on trace shape, not printed output — none
  can be passed by printing the right answer. `checks/` and TUTOR.md's
  teaching rules were not weakened; nothing under `checks/` was modified.
- Tone: prose is already plain and direct; no AI-sounding filler found
  beyond the items flagged below.

## Site-wide

- **S-1 [FIXED]** `npm run lint` was broken: `"lint": "eslint ."` existed but
  eslint was never a devDependency, so the script failed with
  `eslint: not found`. Added `eslint` + `eslint-config-next`, wrote a flat
  `eslint.config.mjs` (core-web-vitals + typescript, vendored `components/ui`
  and `hooks` ignored, `react/no-unescaped-entities` off — a book's prose
  uses real quotes — and four React-Compiler-era `react-hooks/*` rules off,
  which fire on deliberate mount/animation idioms). Fixed the real findings:
  a missing JSX `key` in module-three, `no-assign-module-variable` in the
  section route, unused vars in lab.ts, animated-sphere, metrics-section,
  and the module landing page. Result: 0 errors, 1 intentional warning
  (`<img>` inside the lite YouTube embed — deliberate for privacy).
- **S-2 [NEEDS-AUTHOR]** Model names are drifting toward dated for
  late 2026. The YourRun demo traces and kit page use `gpt-4o-mini` /
  `claude-sonnet-5`. Both still resolve as real models, and the demo data is
  labeled illustrative, so nothing is false — but if the course wants to
  read current, the demo model names and `tracing.py`'s `PRICES` table
  deserve a pass. Refreshing pricing is the author's call; I only added the
  missing `claude-sonnet-4-5` row so its cost estimate isn't silently $0.
- **S-3 [NEEDS-AUTHOR]** Loop vocabulary differs across modules. Module 3
  teaches the agent loop as **gather → decide → act → observe**; the Agents
  reference embedded in Module 8 §2 steps **Think → Act → Observe**. Same
  idea, two vocabularies. Pick one canonical naming and align the other.
- **S-4 [NEEDS-AUTHOR]** The Orchestration reference embedded in Module 7 §2
  says "Five ways to wire agents together" — chaining, routing, parallel
  fan-out, supervisor, **swarm** — while Module 7's own five pattern
  sections are chaining+routing, parallel, orchestrator–workers, critic,
  and humans-in-the-loop. The card set shows an untaught pattern (swarm)
  and omits two taught ones (critic, human gate). Worth aligning to the
  module, or relabeling as a broader field guide.
- **S-5 [NEEDS-AUTHOR]** Dead landing kit: 13 unused components under
  `components/landing/` (navigation, footer, hero, features, pricing,
  metrics, testimonials, etc.). Two of them still carry the old brand
  "The Model and the Loop" instead of `BRAND` from `lib/brand.ts`. Unused
  code is harmless at runtime but misleading to future contributors;
  deleting the kit is the author's call.
- **S-6 [WONT-FIX]** `fig-04` ("The agent loop" drawn figure) is only shown
  in the /graphics archive — M3 §4 uses the interactive `AgentLoopDiagram`
  instead. Deliberate; left alone.
- **S-7 [WONT-FIX]** Module landing heroes label drawn figures by gallery
  name ("Text in, text out") while in-section captions differ
  ("Pick, append, repeat"). Consistent with `tools/figures/figures.json`
  naming — a figure has a gallery name and a section caption. Left alone.
- **S-8 [WONT-FIX]** `app/m/[module]/s/[section]/page.tsx` still contains a
  generic "content arriving" fallback with an off-by-one
  (`sections.length - 1` for the project check). Unreachable: all eight
  modules return early above it. Left as scaffolding.

## Module 1 — What is an LLM?

- **M1-1 [FIXED]** §9 "Go deeper" linked to
  `deeplearning.ai/the-batch/agentic-design-patterns-part-1`, which now
  returns HTTP 500. The article was retitled; retargeted to the live URL
  (`/the-batch/how-agents-can-improve-llm-performance`).
- Verified: fig-01 (pick-append-repeat), fig-02 (context window), fig-08
  (next-token distribution, ~9% sleep) all match captions; §11's lab
  instructions match BUILD.md (three runs at temperature 0 / 0.7 / 1.5).

## Module 2 — Working with a model

- Verified clean. "What you'll build" bullets match `modules/m2/BUILD.md`
  (system prompt + two examples + JSON schema + validate-and-retry +
  token/cost log).

## Module 3 — Tools and the agent loop

- **M3-1 [FIXED]** The site oversold the lab build. The §8 project copy and
  build list promised *three tools (now, search, read_file)*, *a turn cap
  of ten*, and *a run against five questions*. `modules/m3/BUILD.md` asks
  for **one** real tool, a cap of **five** turns, and one closed-loop run
  (model → tool → model); `checks/m3.py` grades exactly that shape.
  Rewrote the project line, paragraph, bullet list, and the module-page
  project blurb (`course-data.ts`) to match the lab.
- Verified: fig-03 (model asks / code runs), fig-14 (round trip), the
  gather–decide–act–observe loop figure, and the "when the model replies
  with text instead of a tool call" quiz answer.

## Module 4 — Memory and context

- Verified clean. Build bullets match `modules/m4/BUILD.md` (remember tool,
  notes.md, compaction threshold, retrieval). fig-05 (memory outside the
  window), fig-12 (retrieval scatter), fig-13 (compaction) match captions.
  Context-rot taxonomy (poisoning / distraction / confusion / conflict)
  follows Breunig's framing, correctly cited.

## Module 5 — Evals

- **M5-1 [FIXED]** Same class of oversell: the project build list promised
  *"Twenty golden cases"* and *"Three graders … a narrow model judge"*.
  `modules/m5/BUILD.md` asks for **at least ten** cases and
  `checks/m5.py` requires **≥2 grader kinds** (`MIN_CASES = 10`); no judge
  is required. Also replaced the invented "Trace assertions" bullet with
  the build's actual traced-run-per-case shape, and aligned the
  module-page project blurb in `course-data.ts`.
- Verified: fig-09 (compounding accuracy) — 0.9^10 ≈ 0.349 shown as ~35%,
  and 99% per step ≈ 90% over ten steps; both correct. §2's "Twenty of
  them" is advice in prose, not the build spec; left as is.

## Module 6 — Failure modes and guardrails

- Verified clean. Build bullets match `modules/m6/BUILD.md` (three caps,
  repetition detector, input/action/output gates, injection test).
  fig-06 (gates around the loop) and fig-11 (lethal trifecta) match
  captions.
- **M6-1 [WONT-FIX]** `checks/m6.py`'s injection-test assertion reads a
  learner-written span attribute (`obeyed=False`), so it's partly
  self-reported — acknowledged in the check's own comment. Every check in
  the course reads the learner's trace, so this is the designed trust
  model, not a bug.

## Module 7 — Workflows and orchestration

- **M7-1 [FIXED]** Sections had no Previous/Next footer — the only module
  missing one. Added the standard footer to both render paths (regular
  sections link through the module and onward to M8; the project page
  links §6 → M8).
- **M7-2 [FIXED]** Project build list promised *"One human-approval pause
  on the risky action"* — no such step exists in `modules/m7/BUILD.md` or
  `checks/m7.py`. Removed the bullet.
- See also S-4 (Orchestration reference card set vs. the module's five
  taught patterns).

## Module 8 — Capstone: The Deep Research Agent

- **M8-1 [FIXED]** §6 "Go deeper" linked to
  `langfuse.com/docs/observability/features/trace-ui` → 404. Retargeted to
  `langfuse.com/docs/observability` (200).
- Verified: fig-07 (the desk) and fig-10 (trace waterfall) match captions;
  the §8 checklist matches `modules/m8/BUILD.md`'s phases; deploy/check
  narrative matches `checks/m8.py` (nested orchestrator→worker spans).

## Lab (course/)

- **L-1 [FIXED]** `tracing.py`: `_provider_of` didn't recognize `o4`/`o5`
  model prefixes (returned `"unknown"` for current OpenAI reasoning
  models); added them. `PRICES` had no row matching `claude-sonnet-4-5`,
  so runs on that model reported a silent $0.00 cost estimate; added the
  row at its published price.
- **L-2 [FIXED]** `course/README.md` listed `modules/mN/` twice in "The
  parts" with different descriptions; merged into one entry.
- Verified: `./course` CLI surface (`init`/`doctor`/`status`/`check`/
  `serve`) matches what the site and README tell learners;
  `available()` correctly discovers all eight BUILD.md files; `cmd_check`
  runs graders sequentially and stops at first failure as documented;
  TUTOR.md's hint ladder and "checks are sacred" rules are internally
  consistent; GUIDE.md matches the checks-read-the-trace model.
- **L-3 [WONT-FIX]** `tools/figures/figures.json` `target`/caption fields
  are stale relative to current in-section captions (e.g., fig-02 says
  "FIGURE 2" while §7's caption is "FIGURE 7.1"). It's a pipeline work
  doc, not user-facing; regenerating it belongs to the figure workflow,
  not this audit.

## What I did not change

- Nothing under `course/checks/` — graders are the integrity layer; all
  findings there were either correct-by-design (M6-1) or already sound.
- No design-system or structural changes; edits are confined to content,
  one missing footer, link targets, the lint toolchain, and small
  correctness fixes in `tracing.py`.

---

# Round 2 — Making the site more impressive

A second pass after the correctness audit merged (PR #1). The goal this time was not accuracy but
presence: places where the reader can do something with the idea, and a sense of place in the book.
Scope stayed inside `site/`; nothing under `course/` changed.

## Shipped

- **[FIXED] Live tokenizer in Module 1 §2.** A real `o200k_base` BPE encoder (the encoding behind GPT-4o
  and GPT-5) runs in the page. Type anything; every piece is tinted, hover shows its id, and the token /
  word / character counts update. The 1 MB encoding loads only when the box is focused or after an idle
  moment, so the page itself stays light. `site/components/figures/tokenizer-demo.tsx`.
- **[FIXED] Temperature sampler in Module 1 §5.** The two static charts became one chart with a slider
  (0–2) over the same sleep/cook/relax/read list as Figure 3.1. Shares are recomputed with real
  temperature arithmetic (log-probabilities divided by T, renormalised; the tail is modelled as 2,000
  tiny tokens so it swells at high T and vanishes at low T). "Pick 20 times" samples from the list so
  the reader sees variance, not just a bar chart. `site/components/figures/temperature-demo.tsx`.
- **[FIXED] Reading progress and resume.** Opening a section records it on the device
  (`localStorage`, key `llmtextbook-progress`). The landing hero shows "Continue where you left off ·
  Module 03 · 4. The loop" for a returning reader; module cards show "4 of 11 read" with a hairline
  rail; the rail and the module page mark read sections with a filled dot; the header gets a
  "Continue reading →" link outside the book. This replaces the manual "Save your place" button,
  which stored a title string with no way back. `site/lib/progress.ts`, `site/components/book/progress-ui.tsx`.
- **[FIXED] Labelled Previous / Next everywhere.** All eight module files now use the shared `PrevNext`
  pager, so every footer names its destination ("03 · A probability machine") instead of a bare
  "Next →". ← and → keys turn the page (ignored while typing or with a modifier held).
- **[FIXED] Paragraph spacing.** `Prose` used Tailwind's `prose` class, but `@tailwindcss/typography`
  is not installed, so every section's paragraphs ran together with no gap. Replaced with explicit
  sibling spacing.
- **[FIXED] Per-page titles.** Module and section routes now emit `generateMetadata`, so browser tabs,
  history and shared links read "The loop · Module 3 · LLM.TEXTBOOK" instead of the site-wide title.

## Checked and left alone

- Figure 07 on the landing-page Capstone card: an early headless screenshot showed it blank; verified in
  a real browser that it renders (the reveal-on-scroll transition had not fired). No change.
- Dark mode: the whole figure language is "electric blue on warm paper"; a dark theme would touch every
  SVG and chart token for no reading benefit. [WONT-FIX]
- The hero "demo" console: it types once and stops; considered replacing it with the interactive agent
  loop diagram but that diagram belongs to Module 3 and would promise the loop before the book has
  earned it. [NEEDS-AUTHOR]
