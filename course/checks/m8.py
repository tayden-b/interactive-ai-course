"""Module 8 — the whole pipeline ran, and the trace can prove each stage.

Plan, parallel researchers using real tools, a checker that counted claims, a writer,
and a bill. Each assertion is a module the learner already passed, composed — which is
the thesis of the capstone.
"""

TITLE = "Module 8 · Capstone: The Deep Research Agent"


def _descendants(trace, root_id):
    kids, frontier = [], {root_id}
    while frontier:
        found = [s for s in trace["spans"] if s.get("parent_id") in frontier]
        kids += found
        frontier = {s["id"] for s in found}
    return kids


def _steps_named(trace, needle):
    return [s for s in trace["spans"] if s["kind"] == "step" and needle in s["name"].lower()]


def check_trace_exists(trace, repo):
    if not trace:
        return False, "No trace found. Run the desk once, then run `./course check 8` again."
    if trace.get("module") != 8:
        return False, (f"The latest trace is from Module {trace.get('module')}. "
                       "Run your capstone (`Run(module=8)`) so it is the most recent run.")
    return True, f"Found a Module 8 trace from {trace['started_at']}."


def check_plan(trace, repo):
    orch = _steps_named(trace, "orchestrator")
    if not orch or not any(s["kind"] == "llm" for s in _descendants(trace, orch[0]["id"])):
        return False, ("No orchestrator span with a model call. The run starts with a plan — "
                       "Module 7's shape, wrapped in `run.step(\"orchestrator\")`.")
    return True, "The orchestrator planned."


def check_researchers_used_tools(trace, repo):
    researchers = _steps_named(trace, "researcher")
    good = []
    for r in researchers:
        kids = _descendants(trace, r["id"])
        if any(s["kind"] == "llm" for s in kids) and any(s["kind"] == "tool" for s in kids):
            good.append(r)
    if len(good) < 2:
        return False, (f"Found {len(good)} researcher span(s) containing both model and tool calls; "
                       "the desk needs at least two, each running its own short loop with real tools.")
    return True, f"{len(good)} researchers ran their own loops with real tools."


def check_checker_counted(trace, repo):
    checkers = _steps_named(trace, "checker")
    if not checkers:
        return False, ("No checker span. Every claim gets verified against its source — "
                       "`run.step(\"checker\")` with `span.set(claims_checked=..., claims_dropped=...)`.")
    a = checkers[-1]["attributes"]
    if not a.get("claims_checked"):
        return False, "The checker ran but checked nothing. Record `claims_checked` and `claims_dropped`."
    return True, f"Checker verified {a['claims_checked']} claim(s), dropped {a.get('claims_dropped', 0)}."


def check_writer_wrote(trace, repo):
    writers = _steps_named(trace, "writer")
    if not writers or not any(s["kind"] == "llm" for s in _descendants(trace, writers[-1]["id"])):
        return False, ("No writer span with a model call. The brief is one formatting call over "
                       "checked claims — wrap it in `run.step(\"writer\")`.")
    return True, "The writer produced the brief."


def check_the_bill(trace, repo):
    totals = trace.get("totals", {})
    if not totals.get("usd_estimate"):
        return False, ("The run has no cost estimate. Real calls through `tracing.py` price "
                       "themselves — a free run is a run that never happened.")
    return True, (f"The run: {totals.get('llm_calls', 0)} model calls, {totals.get('tool_calls', 0)} "
                  f"tool calls, ~${totals['usd_estimate']}.")


CHECKS = [check_trace_exists, check_plan, check_researchers_used_tools,
          check_checker_counted, check_writer_wrote, check_the_bill]
