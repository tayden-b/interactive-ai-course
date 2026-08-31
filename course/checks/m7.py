"""Module 7 — two agents, and the trace proves it.

The interesting assertions are structural: worker spans with their own model calls
nested inside, an orchestrator that planned with a model call of its own, and a
synthesis after the workers. That nesting is what "two context windows" looks like
in a trace, and you cannot produce it with a single flat loop.
"""

TITLE = "Module 7 · Workflows and orchestration"


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
        return False, "No trace found. Run your team once, then run `./course check 7` again."
    if trace.get("module") != 7:
        return False, (f"The latest trace is from Module {trace.get('module')}. "
                       "Run your Module 7 system (`Run(module=7)`) so it is the most recent run.")
    return True, f"Found a Module 7 trace from {trace['started_at']}."


def check_orchestrator_planned(trace, repo):
    orch = _steps_named(trace, "orchestrator")
    if not orch:
        return False, ("No orchestrator span. Wrap the planning call in "
                       "`with run.step(\"orchestrator\"):` so its window is visible on its own.")
    if not any(s["kind"] == "llm" for s in _descendants(trace, orch[0]["id"])):
        return False, "The orchestrator span contains no model call — the plan is a model's output."
    return True, "The orchestrator planned with its own model call."


def check_two_workers(trace, repo):
    workers = _steps_named(trace, "worker")
    good = [w for w in workers
            if any(s["kind"] == "llm" for s in _descendants(trace, w["id"]))]
    if len(good) < 2:
        return False, (f"Found {len(good)} worker span(s) with model calls inside; the point is at "
                       "least two, each doing its part in its own window — nest each worker's calls "
                       "inside `with run.step(\"worker N\"):`.")
    return True, f"{len(good)} workers, each with its own model calls nested inside."


def check_synthesis(trace, repo):
    synth = _steps_named(trace, "synth")
    if not synth:
        return False, ("No synthesis span. The fan-in is one more model call over the workers' "
                       "summaries — wrap it in `run.step(\"synthesize\")`.")
    workers = _steps_named(trace, "worker")
    if workers and synth[-1]["started_at"] < max(w["started_at"] for w in workers):
        return False, "The synthesis started before the last worker — it has to fan the results back in."
    if not any(s["kind"] == "llm" for s in _descendants(trace, synth[-1]["id"])):
        return False, "The synthesis span contains no model call."
    return True, "Workers fanned out, synthesis fanned back in."


def check_it_really_ran(trace, repo):
    llm = [s for s in trace["spans"] if s["kind"] == "llm" and s["duration_ms"] > 0
           and s["attributes"].get("gen_ai.usage.output_tokens", 0) > 0]
    if len(llm) < 3:
        return False, ("Fewer than three real model calls. A plan, two workers, and a synthesis "
                       "should show at least four.")
    return True, f"{len(llm)} real model calls across the team."


CHECKS = [check_trace_exists, check_orchestrator_planned, check_two_workers, check_synthesis, check_it_really_ran]
