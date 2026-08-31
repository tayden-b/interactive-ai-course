"""Module 4 — the agent remembers.

Passing this means all three memory mechanisms ran in one trace: the agent wrote a
note (long-term), compaction shrank the transcript (short-term), and retrieval chose
which notes to load. The notes file has to exist on disk because the agent maintains
a real one.
"""

TITLE = "Module 4 · Memory and context"


def check_trace_exists(trace, repo):
    if not trace:
        return False, "No trace found. Run your agent once, then run `./course check 4` again."
    if trace.get("module") != 4:
        return False, (f"The latest trace is from Module {trace.get('module')}. "
                       "Run your Module 4 agent (`Run(module=4)`) so it is the most recent run.")
    return True, f"Found a Module 4 trace from {trace['started_at']}."


def check_notes_file(trace, repo):
    notes = repo / "my-agent" / "notes.md"
    if not notes.exists() or not notes.read_text().strip():
        return False, ("No `my-agent/notes.md` with content. The agent's long-term memory is a file "
                       "it writes via its `remember` tool.")
    lines = [l for l in notes.read_text().splitlines() if l.strip()]
    return True, f"notes.md exists with {len(lines)} line(s)."


def check_remember_fired(trace, repo):
    remembers = [s for s in trace["spans"] if s["kind"] == "tool" and "remember" in s["name"].lower()]
    if not remembers:
        return False, ("No `remember` tool call in the trace. Tell the agent something worth keeping "
                       "during the run, and wrap the tool in `with run.tool(\"remember\"):`.")
    return True, f"The agent wrote {len(remembers)} note(s) itself."


def check_compaction(trace, repo):
    compacts = [s for s in trace["spans"] if s["kind"] == "step" and "compact" in s["name"].lower()]
    if not compacts:
        return False, ("No compaction step in the trace. Run a conversation long enough to pass your "
                       "threshold, and record it with `run.step(\"compact\")`.")
    shrunk = [s for s in compacts
              if s["attributes"].get("tokens_before", 0) > s["attributes"].get("tokens_after", 0) > 0]
    if not shrunk:
        return False, ("Compaction ran but the transcript did not shrink. Record real numbers with "
                       "`span.set(tokens_before=..., tokens_after=...)` — after should be smaller.")
    s = shrunk[-1]["attributes"]
    return True, f"Compacted {s['tokens_before']} → {s['tokens_after']} tokens."


def check_retrieval_chose(trace, repo):
    retrieves = [s for s in trace["spans"] if s["kind"] == "step" and "retriev" in s["name"].lower()]
    if not retrieves:
        return False, ("No retrieval step in the trace. Score the notes against the current message "
                       "and record the choice with `run.step(\"retrieve\")`.")
    a = retrieves[-1]["attributes"]
    loaded, total = a.get("notes_loaded", 0), a.get("notes_total", 0)
    if not loaded:
        return False, ("Retrieval ran but loaded nothing. Record `span.set(notes_total=..., "
                       "notes_loaded=...)` with at least one note chosen.")
    return True, f"Retrieval loaded {loaded} of {total} note(s)."


CHECKS = [check_trace_exists, check_notes_file, check_remember_fired, check_compaction, check_retrieval_chose]
