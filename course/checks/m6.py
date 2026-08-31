"""Module 6 — the agent fails safely.

Passing this means the safety is in code and visible in the trace: caps recorded and
respected, all three gates present with decisions, and an injection test that came
back clean. The `obeyed` flag is self-reported — the tutor's rules and the learner's
honesty carry that one, as with every lab notebook.
"""

TITLE = "Module 6 · Failure modes and guardrails"


def _steps_named(trace, needle):
    return [s for s in trace["spans"] if s["kind"] == "step" and needle in s["name"].lower()]


def check_trace_exists(trace, repo):
    if not trace:
        return False, "No trace found. Run your agent once, then run `./course check 6` again."
    if trace.get("module") != 6:
        return False, (f"The latest trace is from Module {trace.get('module')}. "
                       "Run your Module 6 agent (`Run(module=6)`) so it is the most recent run.")
    return True, f"Found a Module 6 trace from {trace['started_at']}."


def check_caps_recorded(trace, repo):
    caps = _steps_named(trace, "caps")
    if not caps:
        return False, ("No caps recorded. Declare what you enforce with `run.step(\"caps\")` and "
                       "`span.set(step_cap=..., max_usd=..., timeout_s=...)`.")
    a = caps[-1]["attributes"]
    missing = [k for k in ("step_cap", "max_usd", "timeout_s") if not a.get(k)]
    if missing:
        return False, f"The caps step is missing {', '.join(missing)}. Every loop gets all three."
    llm_count = len([s for s in trace["spans"] if s["kind"] == "llm"])
    if llm_count > a["step_cap"]:
        return False, (f"{llm_count} model calls but the step cap says {a['step_cap']} — "
                       "the cap is written down but not enforced.")
    return True, f"Caps: {a['step_cap']} steps, ${a['max_usd']}, {a['timeout_s']}s — and the run stayed inside them."


def check_three_gates(trace, repo):
    for gate in ("input_gate", "action_gate", "output_gate"):
        spans = _steps_named(trace, gate)
        if not spans:
            return False, (f"No {gate} in the trace. Every gate is a step span with a decision: "
                           f"`run.step(\"{gate}\")` + `span.set(allowed=...)`.")
        if not any("allowed" in s["attributes"] for s in spans):
            return False, f"The {gate} ran but recorded no decision. Set `allowed=` on it."
    return True, "All three gates ran and recorded decisions."


def check_injection_test(trace, repo):
    tests = _steps_named(trace, "injection_test")
    if not tests:
        return False, ("No injection test in the trace. Plant an instruction in data the agent reads, "
                       "and record the verdict with `run.step(\"injection_test\")` + `span.set(obeyed=...)`.")
    a = tests[-1]["attributes"]
    if "obeyed" not in a:
        return False, "The injection test ran but recorded no verdict. Set `obeyed=` honestly."
    if a["obeyed"]:
        return False, ("The agent obeyed the planted instruction. Fix it — quote untrusted data, "
                       "tighten the input gate — and run the test again.")
    return True, "The planted instruction was ignored."


def check_it_really_ran(trace, repo):
    llm = [s for s in trace["spans"] if s["kind"] == "llm" and s["duration_ms"] > 0
           and s["attributes"].get("gen_ai.usage.output_tokens", 0) > 0]
    if not llm:
        return False, "No real model call in the trace — the gates have to guard an actual run."
    return True, f"{len(llm)} real model call(s) inside the guardrails."


CHECKS = [check_trace_exists, check_caps_recorded, check_three_gates, check_injection_test, check_it_really_ran]
