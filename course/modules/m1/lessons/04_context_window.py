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


@app.cell
def _():
    # Setup. Nothing to change here.
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


@app.cell
def _(mo):
    mo.md("""
    # Lesson 4. Out of the window is out of the world

    A model has no memory between calls. What it knows on any turn is exactly what
    you send on that turn, and what you can send has a fixed size: the context
    window. Below is a ten turn conversation. The name is stated in the first turn.
    Shrink the window and watch the model lose it.
    """)
    return


@app.cell
def _():
    # The transcript. Turn 1 carries the fact that matters.
    transcript = [
        {"role": "user", "content": "Hi, I'm Priya. I'm planning a trip to Japan in April."},
        {"role": "assistant", "content": "Nice to meet you, Priya. April is cherry blossom season, a great pick."},
        {"role": "user", "content": "I want to split time between Tokyo and Kyoto."},
        {"role": "assistant", "content": "A common split is four days in Tokyo and three in Kyoto, connected by the shinkansen."},
        {"role": "user", "content": "What neighborhoods should I look at for a hotel in Tokyo?"},
        {"role": "assistant", "content": "Shinjuku for transit, Asakusa for old Tokyo, Shibuya if you want to be in the middle of it."},
        {"role": "user", "content": "And in Kyoto?"},
        {"role": "assistant", "content": "Downtown Kawaramachi is practical; Gion is atmospheric; near the station is easiest with luggage."},
        {"role": "user", "content": "How much cash should I carry day to day?"},
        {"role": "assistant", "content": "Cards work in cities, but around ten thousand yen in cash covers small shops and shrines."},
    ]

    def count_tokens(messages):
        # The naive rule from lesson 3: about four characters per token.
        return sum(max(1, round(len(m["content"]) / 4)) for m in messages)

    return count_tokens, transcript


@app.cell
def _(count_tokens, mo, transcript):
    window = mo.ui.slider(
        30, 400, step=10, value=400, label="Context window, in tokens"
    )
    mo.vstack([
        window,
        mo.md(f"The full transcript is about **{count_tokens(transcript)} tokens**."),
    ])
    return (window,)


@app.cell
def _(mo, transcript, window):
    # ---- your turn ----
    #
    # fit_window(messages, max_tokens): return the messages that fit, keeping the
    # MOST RECENT ones. Walk the transcript from the end, adding turns while their
    # running total (use count_tokens on the kept list) stays within max_tokens,
    # then return them in their original order.
    def fit_window(messages, max_tokens):
        return None

    kept = fit_window(transcript, window.value)
    mo.stop(
        kept is None,
        mo.md("*Waiting for your fit_window function. The transcript view and the call below unlock when it works.*"),
    )
    return (kept,)


@app.cell
def _(kept, mo, transcript):
    _kept_ids = {id(m) for m in kept}
    _rows = []
    for _m in transcript:
        _text = f"**{_m['role']}** · {_m['content']}"
        if id(_m) in _kept_ids:
            _rows.append(mo.md(_text))
        else:
            _rows.append(
                mo.md(f"<span style='opacity:.35'>{_text} <em>(dropped)</em></span>")
            )
    mo.vstack(_rows)
    return


@app.cell
def _(mo):
    ask_go = mo.ui.run_button(label="Ask: what is my name? (one API call)")
    ask_go
    return (ask_go,)


@app.cell
def _(ask_go, mo):
    # ---- your turn ----
    #
    # Ask the model "What is my name?" sending ONLY the kept turns plus that question
    # as the final user message. Keep the mo.stop line first. Trace it the same way
    # as lesson 1: with run.llm(MODEL) as span, span.usage(...), run.save(). Set
    # `answer` to the reply text.
    mo.stop(not ask_go.value, mo.md("*Press the button when your code is ready.*"))

    answer = None
    return (answer,)


@app.cell
def _(answer, kept, mo, transcript):
    if answer is None:
        _out = mo.md("*Run the question above at a large window, then again at a small one.*")
    else:
        _dropped = len(transcript) - len(kept)
        _out = mo.md(
            f"""
    With {_dropped} turn{"s" if _dropped != 1 else ""} dropped, the model answered:

    > {answer}
    """
        )
    _out
    return


@app.cell
def _(mo):
    mo.md("""
    ## What to notice

    At a full window the model knows the name. Shrink the window until turn one falls
    out and ask again: the model does not get worse at remembering, it never saw the
    name at all. Nothing you did not send exists.

    **Explain back:** the model answered wrong at a small window. Was that a memory
    failure? What actually happened?
    """)
    return


if __name__ == "__main__":
    app.run()
