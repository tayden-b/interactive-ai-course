"""Module 2 — call, validate, retry.

Passing this means the reliability lives in the learner's code: model calls carry
numbered attempts, and a validation step ran and passed. A printed answer produces
none of that shape.
"""

TITLE = "Module 2 · Working with a model"


def check_trace_exists(trace, repo):
    if not trace:
        return False, "No trace found. Run your tool once, then run `./course check 2` again."
    if trace.get("module") != 2:
        return False, (f"The latest trace is from Module {trace.get('module')}. "
                       "Run your Module 2 tool (`Run(module=2)`) so it is the most recent run.")
    return True, f"Found a Module 2 trace from {trace['started_at']}."


def check_llm_call_with_usage(trace, repo):
    llm = [s for s in trace["spans"] if s["kind"] == "llm"]
    real = [s for s in llm if s["attributes"].get("gen_ai.usage.output_tokens", 0) > 0
            and s["duration_ms"] > 0]
    if not real:
        return False, ("No model call with recorded usage. Wrap the call in "
                       "`with run.llm(model) as span:` and call `span.usage(...)` from the response.")
    return True, f"{len(real)} model call(s) with real token usage."


def check_attempts_numbered(trace, repo):
    llm = [s for s in trace["spans"] if s["kind"] == "llm"]
    unnumbered = [s for s in llm if "attempt" not in s["attributes"]]
    if unnumbered:
        return False, ("A model call has no attempt number. Add `.set(attempt=attempt)` to every "
                       "call so the retry loop is visible in the trace.")
    return True, "Every model call carries its attempt number."


def check_validation_passed(trace, repo):
    validates = [s for s in trace["spans"] if s["kind"] == "step" and "validate" in s["name"].lower()]
    if not validates:
        return False, ("No validation step in the trace. Wrap your validator in "
                       "`with run.step(\"validate\") as span:` and record `span.set(valid=...)`.")
    last = validates[-1]
    if not last["attributes"].get("valid"):
        return False, ("The last validation failed. The tool should retry with the error until the "
                       "shape is right — the final validation in the trace has to pass.")
    return True, f"Validation ran {len(validates)} time(s); the last one passed."


CHECKS = [check_trace_exists, check_llm_call_with_usage, check_attempts_numbered, check_validation_passed]
