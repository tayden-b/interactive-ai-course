"""Module 5 — the eval suite is real.

Passing this means golden cases exist on disk as the spec, the latest run graded
enough of them with more than one kind of grader, and the summary's arithmetic adds
up. The pass rate itself is the learner's number, not ours — the check only insists
that it was honestly produced.
"""

import json

TITLE = "Module 5 · Evals"

MIN_CASES = 10


def check_trace_exists(trace, repo):
    if not trace:
        return False, "No trace found. Run your suite once, then run `./course check 5` again."
    if trace.get("module") != 5:
        return False, (f"The latest trace is from Module {trace.get('module')}. "
                       "Run your eval suite (`Run(module=5)`) so it is the most recent run.")
    return True, f"Found a Module 5 trace from {trace['started_at']}."


def check_golden_cases(trace, repo):
    f = repo / "my-agent" / "evals" / "cases.json"
    if not f.exists():
        return False, "No `my-agent/evals/cases.json`. The golden cases are the spec — write them first."
    try:
        cases = json.loads(f.read_text())
    except Exception:
        return False, "cases.json is not valid JSON."
    if not isinstance(cases, list) or len(cases) < MIN_CASES:
        return False, f"cases.json has {len(cases) if isinstance(cases, list) else 0} case(s); write at least {MIN_CASES}."
    missing = [i for i, c in enumerate(cases)
               if not (isinstance(c, dict) and c.get("input") and c.get("why"))]
    if missing:
        return False, f"Case(s) {missing[:3]} lack an `input` or a `why`. Every case says what it protects."
    return True, f"{len(cases)} golden cases, each with an input and a why."


def check_cases_graded(trace, repo):
    graded = [s for s in trace["spans"]
              if s["kind"] == "step" and "grader" in s["attributes"] and "passed" in s["attributes"]]
    if len(graded) < MIN_CASES:
        return False, (f"Only {len(graded)} graded case(s) in the trace; the suite should run them all. "
                       "Record each with `span.set(grader=..., passed=...)`.")
    graders = sorted({s["attributes"]["grader"] for s in graded})
    if len(graders) < 2:
        return False, (f"Every case used the same grader ({graders[0]}). Use the strictest grader that "
                       "fits each case — at least two kinds across the suite.")
    return True, f"{len(graded)} cases graded, using {len(graders)} kinds of grader: {', '.join(graders)}."


def check_summary_adds_up(trace, repo):
    evals = [s for s in trace["spans"] if s["kind"] == "step" and s["name"] == "eval"]
    if not evals:
        return False, ("No suite summary in the trace. End the run with `run.step(\"eval\")` and "
                       "`span.set(cases_run=..., passed=..., failed=..., pass_rate=...)`.")
    a = evals[-1]["attributes"]
    n, p, f = a.get("cases_run", 0), a.get("passed", 0), a.get("failed", 0)
    if n < MIN_CASES or p + f != n:
        return False, f"The summary says {p} passed + {f} failed of {n} run — that does not add up."
    return True, f"Suite summary: {p}/{n} passed (rate {a.get('pass_rate')})."


def check_agent_really_ran(trace, repo):
    llm = [s for s in trace["spans"] if s["kind"] == "llm" and s["duration_ms"] > 0]
    if not llm:
        return False, ("No real model calls in the suite run. The suite runs your agent on every "
                       "case — grading canned outputs proves nothing.")
    return True, f"{len(llm)} real model call(s) during the suite."


CHECKS = [check_trace_exists, check_golden_cases, check_cases_graded, check_summary_adds_up, check_agent_really_ran]
