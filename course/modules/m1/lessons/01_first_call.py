# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "marimo>=0.24,<0.25",
#     "openai",
# ]
# ///

import marimo

__generated_with = "0.24.0"
app = marimo.App(width="medium")


@app.cell(hide_code=True)
def _():
    # Setup. Finds the course folder, loads your .env, and imports the trace library.
    # You do not need to change anything here.
    import os
    import sys
    from pathlib import Path

    import marimo as mo

    COURSE = Path(__file__).resolve().parents[3]
    if str(COURSE) not in sys.path:
        sys.path.insert(0, str(COURSE))

    def _load_env(path):
        if not path.exists():
            return
        for _line in path.read_text().splitlines():
            _line = _line.strip()
            if _line and not _line.startswith("#") and "=" in _line:
                _k, _v = _line.split("=", 1)
                os.environ.setdefault(_k.strip(), _v.strip())

    _load_env(COURSE / ".env")

    from tracing import Run

    MODEL = "gpt-4o-mini"
    return (mo,)


@app.cell(hide_code=True)
def _(mo):
    mo.md("""
    # Lesson 1. Your first call

    A language model over an API is a function: text goes in, text comes back, and you
    are billed by the token. In this lesson you make that call yourself, three times,
    and record what happened.

    Type a prompt, set the temperature, and press Run. The cell marked **your turn**
    is yours to write. Your tutor will not write it for you.
    """)
    return


@app.cell
def _(mo):
    prompt_box = mo.ui.text_area(
        value="Finish this sentence in one line: The capital of France is",
        label="Your prompt",
        rows=3,
    )
    temp = mo.ui.slider(0.0, 2.0, step=0.1, value=0.7, label="Temperature")
    go = mo.ui.run_button(label="Run the call")
    mo.vstack([prompt_box, temp, go])
    return go, temp


@app.cell
def _(go, mo):
    # ---- your turn ----
    # Stuck? Ask your tutor in its window. It can read this cell and your last run.
    #
    # Send your prompt to the model and record what it cost. The shape:
    #
    #   run = Run(module=1)
    #   with run.llm(MODEL, temperature=temp.value) as span:
    #       response = client.chat.completions.create(...)   your prompt is
    #           prompt_box.value, sent as one user message
    #       span.usage(input_tokens=..., output_tokens=..., finish_reason=...)
    #           the numbers come from response.usage
    #   run.save()
    #
    # Finish with:  reply = response.choices[0].message.content
    #
    # Keep the mo.stop line first. It waits for the Run button, so nothing spends
    # money while you type.
    mo.stop(not go.value, mo.md("*Press **Run the call** when your code is ready.*"))

    reply = None
    return (reply,)


@app.cell(hide_code=True)
def _(mo, reply, temp, usage):
    if reply is None:
        _out = mo.md(
            """
    *Waiting for your code above. When your call works, the reply and its real token
    counts appear here.*
    """
        )
    else:
        _rows = ""
        if usage is not None:
            _rows = (
                f"| input tokens | {usage.prompt_tokens} |\n"
                f"| output tokens | {usage.completion_tokens} |\n"
            )
        _out = mo.md(
            f"""
    **The model said, at temperature {temp.value}:**

    > {reply}

    | | |
    |---|---|
    {_rows}
    """
        )
    _out
    return


@app.cell(hide_code=True)
def _(mo, reply):
    # Your runs, read straight from the trace files this notebook writes. The course
    # site shows the same thing; you do not need it open while you build.
    from tracing import load_latest

    _t = load_latest()
    if _t is None:
        _line = "*No runs recorded yet. Your traced calls will show up here.*"
    else:
        _tot = _t["totals"]
        _line = (
            f"**Your runs so far:** {_tot['llm_calls']} model call(s) · "
            f"{_tot['input_tokens'] + _tot['output_tokens']} tokens · "
            f"about ${_tot['usd_estimate']:.4f}"
        )
    _ = reply
    mo.md(_line)
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md("""
    ## Run it three times

    Run your prompt at temperature **0**, **0.7**, and **1.5**. Read the three replies
    side by side. Every run wrote a trace file into `traces/` in your course folder,
    and the course website can show it back to you.

    When you have your three runs, tell your tutor you are done. It will go quiet and
    grade you with `./course check 1`. The check reads your trace, not your output, so
    only a real call passes.

    **Explain back, without looking at your code:** what exactly did you send, what came
    back, and why is the input token count larger than the words you typed?
    """)
    return


if __name__ == "__main__":
    app.run()
