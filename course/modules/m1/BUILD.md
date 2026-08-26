# Module 1 — What is an LLM?

**Read first:** Module 1 on the site, sections 1 to 10. This folder is the build.

## How this module works

The lessons are marimo notebooks in `lessons/`. Your tutor opens them for you at
http://localhost:2718 and teaches alongside you: it can write scaffold cells into the
notebook while you watch, but the cells marked `---- your turn ----` are yours. It will
not fill them in.

Do them in order:

| | Notebook | You write |
|---|---|---|
| 1 | `lessons/01_first_call.py` | one real, traced chat completion call |
| 2 | `lessons/02_temperature.py` | `reweight()` and `sample()`, softmax with temperature |
| 3 | `lessons/03_tokens.py` | `estimate_cost()` and one exact-count call |
| 4 | `lessons/04_context_window.py` | `fit_window()` and the question that exposes it |

Every real call you make is traced to `traces/`, and the course site shows your runs
back to you while the bridge (`./course serve`) is up.

## Graduation

When the four notebooks are done, prove it outside the notebook: write
`my-agent/call.py`, a plain script that loads your key from `.env`, makes one traced
call, and prints the reply. No notebook scaffolding, no help beyond hints. This is the
file Module 2 builds on.

## Check

```
./course check 1
```

The check reads your trace, not your output. A real call passes; a printed answer does
not.

## Explain back

Without looking at your code: what exactly did you send the model, what came back, why
is the input token count bigger than your words, and what did temperature change?
