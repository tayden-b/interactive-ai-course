# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "marimo>=0.24,<0.25",
#     "openai",
#     "matplotlib",
# ]
# ///

import marimo

__generated_with = "0.24.0"
app = marimo.App(width="medium")


@app.cell(hide_code=True)
def _():
    # Setup. Nothing to change here.
    import json
    import math
    import os
    import random
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

    DATA = Path(__file__).resolve().parent / "data"
    DATA.mkdir(exist_ok=True)
    MODEL = "gpt-4o-mini"
    return DATA, MODEL, Run, json, mo


@app.cell(hide_code=True)
def _(mo):
    mo.md("""
    # Lesson 2. Temperature is how the list gets picked from

    The model does not produce one answer. It produces a score for every token it
    could say next, and then one gets picked. Temperature reshapes that pick.

    First, fetch the real list once. One API call, cached to disk, and every slider
    move after that is free.
    """)
    return


@app.cell
def _(mo):
    # marimo rule you will meet a lot: a cell may not read the value of a UI element
    # it created. So the button lives here, and the cell below reads it.
    fetch_go = mo.ui.run_button(label="Fetch the real list (one API call)")
    fetch_go
    return (fetch_go,)


@app.cell(hide_code=True)
def _(DATA, MODEL, Run, fetch_go, json, mo):
    # Fetches the top 20 next-token candidates for one fixed prompt, once. Cached to
    # data/logprobs.json so the slider below never calls the API.
    _cache = DATA / "logprobs.json"

    def _fetch():
        from openai import OpenAI

        _client = OpenAI()
        _run = Run(module=1)
        with _run.llm(MODEL, temperature=0.0) as _span:
            _resp = _client.chat.completions.create(
                model=MODEL,
                messages=[{"role": "user", "content": "The capital of France is"}],
                max_tokens=1,
                logprobs=True,
                top_logprobs=20,
            )
            _u = _resp.usage
            _span.usage(
                input_tokens=_u.prompt_tokens,
                output_tokens=_u.completion_tokens,
                finish_reason=_resp.choices[0].finish_reason,
            )
        _run.save()
        _top = _resp.choices[0].logprobs.content[0].top_logprobs
        return [[_t.token, _t.logprob] for _t in _top]

    if _cache.exists():
        logprobs = json.loads(_cache.read_text())
    elif fetch_go.value:
        logprobs = _fetch()
        _cache.write_text(json.dumps(logprobs, indent=1))
    else:
        logprobs = None

    mo.md(
        f"**{len(logprobs)} candidates loaded.** The prompt was: *The capital of France is*"
    ) if logprobs is not None else mo.md("*Press the button above to fetch the list once.*")
    return (logprobs,)


@app.cell
def _(logprobs, mo):
    # ---- your turn ----
    # Stuck? Ask your tutor in its window. It can read this cell and your last run.
    #
    # Two small functions.
    #
    # reweight(logprobs, t) takes the list of [token, logprob] pairs and a
    # temperature t, and returns [token, probability] pairs. The recipe, in order:
    #   1. new_score = logprob / t          for each pair
    #   2. weight = math.exp(new_score)     for each pair
    #   3. probability = weight / (sum of all the weights)
    #
    # sample(probs, k) picks k tokens at random using those probabilities.
    # random.choices(tokens, weights=..., k=k) does the picking for you.
    mo.stop(logprobs is None, mo.md("*Fetch the list above first.*"))

    def reweight(logprobs, t):
        return None

    def sample(probs, k=8):
        return None

    return reweight, sample


@app.cell
def _(mo):
    t = mo.ui.slider(0.1, 2.0, step=0.05, value=0.7, label="Temperature")
    t
    return (t,)


@app.cell(hide_code=True)
def _(logprobs, mo, reweight, sample, t):
    _probs = None if logprobs is None else reweight(logprobs, t.value)
    if _probs is None:
        _out = mo.md("*Waiting for your reweight function above.*")
    else:
        import matplotlib.pyplot as plt

        _tokens = [_p[0] for _p in _probs[:12]]
        _values = [_p[1] for _p in _probs[:12]]
        _fig, _ax = plt.subplots(figsize=(8, 3.2))
        _ax.bar(range(len(_tokens)), _values, color="#2563f0")
        _ax.set_xticks(range(len(_tokens)), _tokens, rotation=35, ha="right")
        _ax.set_ylabel("probability")
        _ax.set_title(f"Next token at temperature {t.value}")
        _ax.spines[["top", "right"]].set_visible(False)
        _picks = sample(_probs, 8)
        _line = (
            mo.md(f"Eight samples at this temperature: **{' · '.join(_p.strip() for _p in _picks)}**")
            if _picks
            else mo.md("*Add your sample function to see picks.*")
        )
        _out = mo.vstack([_ax, _line])
    _out
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md("""
    ## What to notice

    Drag the slider to 0.1 and the tallest bar takes everything: the model becomes
    nearly deterministic. Drag it to 2.0 and the floor rises: unlikely tokens start
    getting picked. Nothing about the model changed. Only the pick did.

    **Explain back:** why does temperature 0 give you the same answer every time, and
    what would a temperature above 1 be useful for?
    """)
    return


if __name__ == "__main__":
    app.run()
