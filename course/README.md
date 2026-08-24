# The Model and the Loop — your lab

This is the folder you build in. The website is the textbook; this is the workbench.

You work here in **your own editor**, with **your own coding agent**, using **your own API
key**. Nothing runs in a browser sandbox, and nothing you write is uploaded anywhere.

## Setup

```bash
./course init      # detects your agent, writes its adapter, creates .env
./course doctor    # tells you exactly what is missing
```

Put your API key in `.env` (git-ignored), then tell your coding agent:

> Read TUTOR.md and start Module 1. Do not write the solution for me.

Any agent that can read files works — Claude Code, Cursor, Codex CLI, Gemini CLI, Copilot.
`TUTOR.md` is what turns it into a tutor instead of an autocomplete.

## Commands

| | |
|---|---|
| `./course init` | set up the folder for whichever agent you have |
| `./course doctor` | check the environment and say what to fix |
| `./course status` | where you are across the eight modules |
| `./course check N` | grade module N **against your trace** |
| `./course serve` | let the website read your traces, over localhost |

## How the site sees your work

`./course serve` starts a small HTTP server on `localhost:4747`. The course site fetches it
**from your own browser** — so your traces go from your disk to your tab and nowhere else.
There is no account and no upload. Close the server and the site falls back to example data.

## The parts

```
tracing.py       the trace library — wire this into the agent you build
my-agent/        your code. one project, growing across all eight modules
modules/mN/      what to build, per module
checks/          the graders. your agent is forbidden to edit these
TUTOR.md         how any coding agent should teach this course
traces/          what your agent did, written by tracing.py   (git-ignored)
.course/         your progress and learner model               (git-ignored)
```

## Why the checks read traces

Most checks assert on `traces/latest.json`, not on what your program prints. Module 3 wants
to see **model → tool → model** — the model asked for a tool, your code ran it, and the
result went back for another turn. You cannot produce that shape by printing the right
answer, which is the point: a trace is evidence of what your code actually did.

Your agent is instructed never to modify `checks/`. If it offers, it is doing the wrong job.

## Cost

You pay your own model usage, and it is small — the exercises use cheap models and short
prompts. `MAX_USD` in `.env` is a hard per-run cap; `tracing.py` raises `BudgetExceeded`
rather than letting a runaway loop spend your money. Every trace records an estimate.
