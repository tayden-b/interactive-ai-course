# Module 5 — Evals

**Reading:** Module 5 on the course website, sections 1 to 6.

**What you end up with:** `my-agent/evals/` — golden cases, graders, and one command
that runs your agent against all of them and prints a number you trust. Then you break
the agent on purpose and watch the suite catch it.

**Six steps.** Your tutor takes you through them one at a time.

---

## Step 1 — Write the cases before you touch the agent

The cases are the spec. Writing them first forces the question every feature avoids:
what does correct mean here?

Reading: Module 5, sections 1 and 2.

Create `my-agent/evals/cases.json`: at least ten cases for your agent. Each case has an
`input`, an `expected` answer (or the property that makes an answer acceptable), and a
`why` — one line on what this case is protecting. Cover the easy path, the edge cases,
and the failures you fear: the empty input, the ambiguous one, the one with a distractor.

**Done when** ten cases exist and each `why` would make sense to a stranger.

## Step 2 — Grade with exact match

The strictest grader that fits, first.

Reading: Module 5, section 3.

Write the runner: `my-agent/evals/run.py`. For each case, run your agent on the input
and grade the answer. Start with the cases where one answer is right — a date, a name,
a count — and grade them by comparison, nothing fancier.

**Done when** the runner can run one exact-match case end to end and print pass or fail.

## Step 3 — Grade with code

You are not checking the whole answer. You are checking what matters.

For the cases where wording may vary but a property must hold — the list has three
items, every owner is non-empty, the JSON parses — write a small assertion per case
instead of a comparison.

**Done when** at least one case is graded by a code check, and you can say why exact
match would have been wrong for it.

## Step 4 — Wire the whole suite together

One command, one number.

Run every case through its grader. Trace it so the site can show it:

```
run = Run(module=5)
for i, case in enumerate(cases):
    with run.step(f"case {i}") as span:
        ...run the agent, grade the answer...
        span.set(grader=case_grader, passed=ok)
with run.step("eval") as span:
    span.set(cases_run=n, passed=p, failed=n - p, pass_rate=round(p / n, 2))
run.save()
```

Print the pass rate and the name of every failing case.

**Done when** `python my-agent/evals/run.py` runs all ten-plus cases and prints a rate.

## Step 5 — Read the failures

The score says how often. The trace says why.

Reading: Module 5, sections 4 and 5.

For every failing case, open the run and mark the first step where it went wrong: bad
plan, wrong tool, wrong arguments, wrong reply. Tally the marks. One step will be denser
than the others — that step is your next fix. Make the fix, run the suite again.

**Done when** you improved the pass rate by reading traces, not by guessing.

## Step 6 — Break it on purpose

The suite earns its keep the first time it catches a regression.

Reading: Module 5, section 6.

Make your agent slightly worse — a vaguer tool description, one example deleted from a
prompt — and run the suite. The rate should drop. Put the agent back. The rate should
recover. That drop is what the suite is for: from now on, you change your agent only
when the number agrees.

**Done when** you have seen the number move both ways, and your final saved run is the
suite passing on the restored agent.

---

## Check

```
./course check 5
```

Your tutor goes quiet while this runs. It reads your cases file and your latest suite
run: enough cases, more than one kind of grader, and a pass rate that adds up.

## Explain back

Without looking at your code: why write cases before building? Why prefer a code check
over a model judging? Your rate dropped from 90 to 75 — what exactly do you do next?
