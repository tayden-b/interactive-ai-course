# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "marimo>=0.24,<0.25",
#     "matplotlib",
# ]
# ///

import marimo

__generated_with = "0.24.0"
app = marimo.App(width="medium")


@app.cell(hide_code=True)
def _():
    import json
    import math
    import random
    import urllib.request

    import marimo as mo

    _loc = mo.notebook_location()
    _url = str(_loc / "public" / "logprobs.json")
    if _url.startswith("http"):
        with urllib.request.urlopen(_url) as _r:
            data = json.loads(_r.read().decode())
    else:
        from pathlib import Path

        data = json.loads((Path(_url)).read_text())
    logprobs = data["logprobs"]
    PROMPT = data["prompt"]
    IS_REAL = data.get("source") == "real"
    return IS_REAL, PROMPT, logprobs, math, mo, random


@app.cell(hide_code=True)
def _(IS_REAL, PROMPT, mo):
    _origin = (
        "We asked a real model to continue this prompt and saved its actual top 20 candidates."
        if IS_REAL
        else "Below is the kind of list a model makes for this prompt, with 20 candidates."
    )
    mo.md(f"""
    ### The model made a list. Temperature is how it picks from it.

    The prompt: *"{PROMPT}"*. {_origin} Drag the slider. Nothing here calls an API;
    the list is re-weighted live in your browser.
    """)
    return


@app.cell(hide_code=True)
def _(mo):
    t = mo.ui.slider(0.1, 2.0, step=0.05, value=0.7, label="Temperature")
    t
    return (t,)


@app.cell(hide_code=True)
def _(logprobs, math, mo, random, t):
    _scaled = [(_tok, _lp / t.value) for _tok, _lp in logprobs]
    _weights = [math.exp(_s) for _, _s in _scaled]
    _total = sum(_weights)
    probs = [(_tok, _w / _total) for (_tok, _), _w in zip(_scaled, _weights)]

    import matplotlib.pyplot as plt

    _tokens = [_p[0] for _p in probs[:12]]
    _values = [_p[1] for _p in probs[:12]]
    _fig, _ax = plt.subplots(figsize=(8, 3.0))
    _ax.bar(range(len(_tokens)), _values, color="#2563f0")
    _ax.set_xticks(range(len(_tokens)), _tokens, rotation=35, ha="right")
    _ax.set_ylabel("probability")
    _ax.set_title(f"Next token at temperature {t.value}")
    _ax.spines[["top", "right"]].set_visible(False)

    _picks = random.choices(
        [_p[0] for _p in probs], weights=[_p[1] for _p in probs], k=8
    )
    mo.vstack([
        _ax,
        mo.md(f"Eight samples at this temperature: **{' · '.join(_p.strip() for _p in _picks)}**"),
    ])
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md("""
    At 0.1 the tallest bar takes everything and the model repeats itself. At 2.0 the
    floor rises and unlikely tokens start getting picked. In the course you build this
    yourself, on your own machine, with your own numbers.
    """)
    return


if __name__ == "__main__":
    app.run()
