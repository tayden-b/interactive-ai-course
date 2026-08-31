# Module 8 — Capstone: The Deep Research Agent

**Reading:** Module 8 on the course website, sections 1 to 8.

**What you end up with:** the whole book in one system. A question goes in; an
orchestrator plans; researchers work in parallel with real tools; a checker verifies
every claim against its source; a writer produces a sourced brief; and the entire run
is one trace you can narrate in an interview. Nothing here is new — the newness is that
it all runs at once.

**Six steps.** Your tutor takes you through them one at a time. This is the longest
build in the course; expect it to span several sessions.

---

## Step 1 — Draw it, then scaffold it

If you can draw the architecture from memory, you can build it.

Reading: Module 8, sections 1 and 2.

Sketch the pipeline on paper first — question → plan → researchers → checker → writer →
brief — and say which module each box came from. Then create `my-agent/research.py`
with the harness skeleton: a `run_desk(question)` function, the caps and gates from
Module 6 already wired around the outside, and a plan step that reuses your Module 7
orchestrator. The plan is structured output: two or three research tasks, each with a
goal, validated before anything runs.

**Done when** a question produces a validated plan inside the orchestrator's span, with
gates and caps recorded in the trace — even though nothing downstream exists yet.

## Step 2 — Researchers with real tools

A researcher is your Module 3 loop with a job description.

Reading: Module 8, section 3.

Each researcher takes one task from the plan and runs a short loop — cap of eight steps
— with real tools you write: a search or fetch tool if you have a way to reach the web,
otherwise a local corpus (a folder of saved articles) with a `search_notes` and a
`read_file` tool. Honest tools, honest traces: every tool call wrapped, every result
real. The required return shape: a summary under 300 tokens plus the sources it used.

```
with run.step("researcher 1") as span:
    ...its llm and tool calls, nested...
```

**Done when** two or more researchers each complete a task, in parallel, with their tool
calls visible inside their own spans.

## Step 3 — The checker

Unsupported claims are dropped, not softened. This is where it earns trust.

Reading: Module 8, section 3.

Split each researcher's summary into claims. For each claim, ask a judge model — with
the cited source in its window — whether the source actually supports the claim.
Rubric tight, scale small. Claims that fail are removed before the writer ever sees
them.

```
with run.step("checker") as span:
    ...
    span.set(claims_checked=n, claims_dropped=d)
```

**Done when** you have watched the checker drop a claim — plant a bad one if you have
to — and the trace records the count.

## Step 4 — The writer

The writer is a workflow step, not an agent.

Given checked claims and their sources, one model call produces the brief in a fixed
format: headline, findings with citations, caveats. Structured output with validation
and retry — Module 2, one last time. No tools, no decisions, no surprises.

```
with run.step("writer") as span:
    ...the writing call...
```

**Done when** a real question comes out the other end as a brief in your format, with
every finding citing a source that survived the checker.

## Step 5 — Evals on the system

You measure a system the same way you measured an agent — per component.

Reading: Module 8, sections 5 and 7.

Extend your Module 5 suite with golden questions for the desk. Grade per component,
using the strictest grader that fits: a code check that the plan decomposed into
independent parts, a code check that every researcher returned sources, a judge on
checker precision, exact-match on the brief's format. Add memory if you want the
follow-up question to beat the first (Module 4's notes, one level up).

**Done when** the suite runs against the desk and prints a rate you believe.

## Step 6 — Make it demoable

The demo is the trace.

Reading: Module 8, sections 6 and 8.

Run the desk on a question you actually care about, with the site open on Your Runs.
Then practice the two-minute narration, from the trace alone: here's the question,
here's the plan, here are the researchers running at once — watch the windows stay
small — here's the claim the checker dropped and why, here's the brief, here's what it
cost. Nothing in that story is a claim; all of it is on the screen.

**Done when** you can narrate a real run end to end without touching the code, and
every number you say comes from the trace.

---

## Check

```
./course check 8
```

Your tutor goes quiet while this runs. It reads your trace: a plan, parallel
researchers with real tool calls, a checker that counted claims, a writer, and a cost.

## Explain back

The interview version, out loud, from memory: what does each component see, what is
each one forbidden to see, and why does the whole thing get more trustworthy — not
less — as you take powers away from each piece?
