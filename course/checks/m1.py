"""Module 1 — you made a real model call and recorded it.

Passing this means: a trace exists, it contains a model call, that call reports token
usage, and it actually took some wall-clock time (i.e. it was not hand-written).
"""

TITLE = "Module 1 · Your first call"


def check_trace_exists(trace, repo):
    if not trace:
        return False, "No trace found. Run your agent once, then run `./course check 1` again."
    return True, f"Found a trace from {trace['started_at']}."


def check_one_llm_call(trace, repo):
    llm = [s for s in trace["spans"] if s["kind"] == "llm"]
    if not llm:
        return False, "The trace has no model call. Wrap your call in `with run.llm(model) as span:`."
    return True, f"{len(llm)} model call(s) recorded."


def check_usage_recorded(trace, repo):
    llm = [s for s in trace["spans"] if s["kind"] == "llm"]
    withusage = [s for s in llm if s["attributes"].get("gen_ai.usage.output_tokens", 0) > 0]
    if not withusage:
        return False, ("A model call was recorded but no tokens were. Call "
                       "`span.usage(input_tokens=..., output_tokens=...)` from the response.")
    return True, f"{trace['totals']['input_tokens']} in / {trace['totals']['output_tokens']} out."


def check_it_really_ran(trace, repo):
    llm = [s for s in trace["spans"] if s["kind"] == "llm"]
    if not any(s["duration_ms"] > 0 for s in llm):
        return False, "Every model call took 0ms. That is not a real network call."
    return True, f"Slowest call took {max(s['duration_ms'] for s in llm)}ms."


CHECKS = [check_trace_exists, check_one_llm_call, check_usage_recorded, check_it_really_ran]
