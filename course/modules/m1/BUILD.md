# Module 1 — What is an LLM?

**Reading:** Module 1 on the course website, sections 1 to 10.

**What you end up with:** `my-agent/call.py`, a program that calls a model, records what
it cost, and proves it ran. Every later module builds on this file.

**Six steps.** Your tutor takes you through them one at a time. Work with it rather than
racing ahead; the point is understanding each piece, not finishing.

---

## Step 1 — Make one call

Text goes out, text comes back.

Write `my-agent/call.py`. Load your key from `.env` (the standard library can do this, no
package needed), create the client, send one user message to a small model, print the
reply.

**Done when** you run it and see a reply.

## Step 2 — Record what it cost

Now the call becomes evidence.

Read the top of `tracing.py`, then wrap your call in a span:

```
run = Run(module=1)
with run.llm(MODEL, temperature=...) as span:
    ...the call...
    span.usage(input_tokens=..., output_tokens=..., finish_reason=...)
run.save()
```

Every number comes off the response object. Do not estimate the token counts. A trace is
evidence of what your program actually did, and invented evidence is worse than none.

**Done when** a file appears in `traces/` and `./course status` shows the run.

## Step 3 — Change the temperature

The model does not have one answer. It has a distribution.

Reading: Module 1, section 5.

Run the same prompt three times, at temperature 0, 0.7, and 1.5, and read the three
replies side by side. Before you run it, predict which one will be identical every time.

**Done when** you can say what temperature actually changes. Not "creativity". What it
does to the pick.

## Step 4 — Count the tokens

The model reads tokens, not words, and tokens are the bill.

Reading: Module 1, sections 2 and 3.

Print a rough estimate (characters divided by four) next to the exact count from
`response.usage`. Then look at `tracing.PRICES` and work out what one run cost you.

**Done when** you can explain why the input count is bigger than what you typed.

## Step 5 — Fill the window

The model has no memory. What it knows is only what you sent this time.

Reading: Module 1, section 7.

Send a short conversation where your name appears in the first message, then ask "what is
my name?" Then drop that first message and ask again.

**Done when** it fails the second time and you can say why. This is not the model
forgetting. It never saw it.

## Step 6 — Clean it up

Make it something you would show someone.

Tidy `my-agent/call.py`: the model name in one place, the prompt easy to change, no stray
prints, a comment at the top saying what it does.

**Done when** it still runs and still writes a trace.

---

## Check

```
./course check 1
```

Your tutor goes quiet while this runs. It reads your trace, not your output: a real call
passes, a printed answer does not.

## Explain back

Without looking at your code: what exactly did you send the model, what came back, why is
the input token count bigger than what you typed, and what did temperature change?
