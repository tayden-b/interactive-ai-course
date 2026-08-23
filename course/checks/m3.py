"""Module 3 — you built a loop, not a single call.

The interesting assertion is `check_the_loop_closed`. A tool call sandwiched between two
model calls is the signature of a real agent loop: the model asked for the tool, your code
ran it, and the result went back in. You cannot produce that shape by printing an answer.
"""

TITLE = "Module 3 · Tools and the agent loop"


def check_trace_exists(trace, repo):
    if not trace:
        return False, "No trace found. Run your agent once, then run `./course check 3` again."
    return True, f"Found a trace from {trace['started_at']}."


def check_a_tool_ran(trace, repo):
    tools = [s for s in trace["spans"] if s["kind"] == "tool"]
    if not tools:
        return False, ("No tool call in the trace. Wrap the function you run on the model's "
                       "behalf in `with run.tool(name):`.")
    names = sorted({s["name"] for s in tools})
    return True, f"{len(tools)} tool call(s): {', '.join(names)}."


def check_the_loop_closed(trace, repo):
    """A tool call between two model calls — the model asked, you ran it, it saw the result."""
    kinds = [s["kind"] for s in trace["spans"] if s["kind"] in ("llm", "tool")]
    for i, k in enumerate(kinds):
        if k == "tool" and "llm" in kinds[:i] and "llm" in kinds[i + 1:]:
            return True, "Model → tool → model. The loop closed."
    return False, ("Found calls, but never model → tool → model. The tool result has to go "
                   "back to the model for another turn — that is what makes it a loop.")


def check_model_asked_for_the_tool(trace, repo):
    llm = [s for s in trace["spans"] if s["kind"] == "llm"]
    asked = [s for s in llm
             if "tool" in " ".join(s["attributes"].get("gen_ai.response.finish_reasons", [])).lower()]
    if not asked:
        return False, ("No model call finished with a tool-call reason. Pass the real "
                       "finish_reason into `span.usage(...)` so the trace shows the model "
                       "chose the tool — rather than your code calling it unconditionally.")
    return True, "The model chose the tool itself."


CHECKS = [check_trace_exists, check_a_tool_ran, check_the_loop_closed, check_model_asked_for_the_tool]
