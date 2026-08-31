# Module 2 — Working with a model

**Reading:** Module 2 on the course website, sections 1 to 7.

**What you end up with:** `my-agent/actions.py`, a script that turns messy meeting notes
into a validated list of action items — and retries when the model gets the shape wrong.
This is the call–validate–retry pattern, and every agent in this course is built on it.

**Six steps.** Your tutor takes you through them one at a time.

---

## Step 1 — Write the brief

A system prompt is a brief, not a law: role, rules, format.

Reading: Module 2, section 2.

Start `my-agent/actions.py` from your Module 1 `call.py`. Write a system prompt with all
three parts: the role (what this tool is), the rules (only use what is in the notes; if
no owner is named, leave the field empty — never invent one), and the format (JSON only,
nothing else).

**Done when** you can point at the role, the rules, and the format in your prompt.

## Step 2 — Show it two examples

The model continues patterns. Give it the pattern you want.

Reading: Module 2, section 3.

Add two worked examples to the prompt: notes in, JSON out. One easy. One tricky — notes
with no action items at all, so the model learns that an empty list is a valid answer.

**Done when** a run on fresh notes comes back in the same shape as your examples.

## Step 3 — Ask for the shape

Programs can't read prose. They need fields.

Reading: Module 2, section 4.

Decide the schema: a list of actions, each with `owner`, `task`, `due`. Ask for exactly
that. Then parse the reply with `json.loads` and print the Python object, not the text.

**Done when** you are printing parsed data — and you have seen what happens when you
feed the parser something that is not JSON.

## Step 4 — Validate, then retry with the error

Never trust the shape. Check it, and tell the model what was wrong.

Reading: Module 2, section 5.

Write a `validate(data)` function that checks the shape yourself: the top level is a
list, every item has the three fields, every `task` is a non-empty string. Wrap the
whole attempt in a loop of at most three tries: call, parse, validate — and on failure,
send the model the error message and ask again.

Trace it so the retry is visible. Number every model call, and record each validation:

```
with run.llm(MODEL) as span:
    ...
    span.usage(...).set(attempt=attempt)
with run.step("validate") as span:
    span.set(valid=ok, attempt=attempt)
```

**Done when** a clean run shows attempt 1 passing — and you can explain what the second
attempt's prompt would contain.

## Step 5 — Make a run cost something you know

You pay per token, in and out.

Reading: Module 2, section 7.

After each run, print one line: input tokens, output tokens, and the cost estimate from
your trace. Then look at your prompt: which part is the same every time? Put the stable
part (system prompt, examples) first, so a provider cache can make it cheap.

**Done when** you know what one run of your tool costs, to the cent.

## Step 6 — Feed it real notes

Toy input proves nothing.

Take the messiest real notes you have — a meeting, a to-do braindump, a group chat — and
run the tool on them. Read the output next to the input. Did it invent an owner? Miss an
action? Fix the prompt, not the code, and run it again.

**Done when** you would trust the output enough to paste it somewhere that matters.

---

## Check

```
./course check 2
```

Your tutor goes quiet while this runs. It reads your trace: numbered attempts and a
validation step that passed. A printed answer with no validation will not pass.

## Explain back

Without looking at your code: why does the retry send the error message back instead of
just asking again? Where does the reliability of this tool actually live — in the model,
or somewhere else?
