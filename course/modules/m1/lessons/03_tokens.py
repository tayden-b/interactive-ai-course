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

    from tracing import PRICES, Run

    MODEL = "gpt-4o-mini"
    return MODEL, mo


@app.cell(hide_code=True)
def _(mo):
    mo.md("""
    # Lesson 3. The model reads tokens, not letters

    Everything you send is chopped into tokens before the model sees it, and tokens
    are what you pay for. A rough rule: one token is about four characters of
    English. The only exact count comes from the API itself.

    Type anything below. The naive estimate updates as you type; the exact count
    costs one small API call.
    """)
    return


@app.cell
def _(mo):
    text_in = mo.ui.text_area(
        value="The quick brown fox jumps over the lazy dog.",
        label="Any text",
        rows=4,
    )
    text_in
    return (text_in,)


@app.cell
def _(mo, text_in):
    _chars = len(text_in.value)
    _words = len(text_in.value.split())
    naive_tokens = max(1, round(_chars / 4))
    mo.md(
        f"{_chars} characters · {_words} words · naive estimate about **{naive_tokens} tokens**"
    )
    return (naive_tokens,)


@app.cell
def _(MODEL):
    # ---- your turn ----
    #
    # estimate_cost(input_tokens, output_tokens, model) returns the dollars for one
    # call. PRICES[model] gives you a pair:
    #   (dollars per MILLION input tokens, dollars per MILLION output tokens)
    # Multiply each count by its price, divide by 1_000_000, add the two.
    def estimate_cost(input_tokens, output_tokens, model=MODEL):
        return None

    return (estimate_cost,)


@app.cell
def _(mo):
    count_go = mo.ui.run_button(label="Get the exact count (one API call)")
    count_go
    return (count_go,)


@app.cell
def _(count_go, mo):
    # ---- your turn ----
    #
    # Get the exact count from the API. Same shape as lesson 1: a traced call with
    # text_in.value as the user message and max_tokens=1. Then:
    #   real_counts = (response.usage.prompt_tokens, response.usage.completion_tokens)
    # Keep the mo.stop line first.
    mo.stop(not count_go.value, mo.md("*Press the button when your code is ready.*"))

    real_counts = None
    return (real_counts,)


@app.cell(hide_code=True)
def _(estimate_cost, mo, naive_tokens, real_counts):
    if real_counts is None:
        _out = mo.md("*Waiting for your exact count above.*")
    else:
        _in, _outn = real_counts
        _cost = estimate_cost(_in, _outn) if estimate_cost(_in, _outn) is not None else None
        _cost_row = f"| estimated cost | ${_cost:.6f} |\n" if _cost is not None else ""
        _out = mo.md(
            f"""
    | | |
    |---|---|
    | naive estimate | {naive_tokens} tokens |
    | exact, from the API | {_in} tokens in |
    {_cost_row}
    The gap between the estimate and the exact count is the tokenizer at work.
    """
        )
    _out
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md("""
    ## What to notice

    Reword your text without changing its meaning and get the exact count again.
    Punctuation, rare words, and code all tokenize differently from plain prose.

    **Explain back:** why does the API bill in tokens instead of words, and why can
    two sentences of the same length cost differently?
    """)
    return


if __name__ == "__main__":
    app.run()
