# Checks

**These files are the graders. Your coding agent is not allowed to edit them, and neither
should you.** `TUTOR.md` instructs every agent to refuse changes under `checks/`.

That rule is the whole reason the checks mean anything. An agent asked to "make the check
pass" will happily rewrite the check — so the check has to be the one thing it cannot touch.

Most assertions here read your **trace**, not your output. Printing the right answer does
not pass Module 3; only actually running a loop that calls a tool does. That is deliberate:
a trace is evidence of what your program did, and it is much harder to fake than a string.
