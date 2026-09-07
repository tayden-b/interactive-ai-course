# Module 3 — Tools and the agent loop

**Reading:** Module 3 on the course website, sections 1 to 7.

**What you end up with:** `my-agent/loop.py`, an agent that can call a tool and keep
going. The difference between a call and an agent is one loop, and by the end you will
have written it.

**Six steps.** Your tutor takes you through them one at a time.

---

## Step 1 — Start from your call

The loop is the Module 1 call, repeated.

Copy `my-agent/call.py` to `my-agent/loop.py`. Run it once to confirm it still works
before you change anything.

**Done when** `loop.py` makes one traced call and prints the reply.

## Step 2 — Write one real tool

A tool is a function your code runs on the model's behalf.

Reading: Module 3, section 2.

Write one function with an answer the model cannot know on its own: the current time, the
contents of a file on disk, a number read from a local JSON file. Not a stub that returns
a constant. Call it directly once to make sure it works.

**Done when** the function runs and returns something real.

## Step 3 — Describe it to the model

The model picks tools from their descriptions, so the description is the interface.

Reading: Module 3, sections 2 and 6.

Write the tool's schema in the API's tool-calling format: a name, a one-sentence
description that says when to use it, and its parameters. Pass it in the `tools` list.
Ask a question your tool can answer and look at the raw response: the model should ask
for the tool instead of answering.

**Done when** a response comes back with a tool call in it and `finish_reason` says so.

## Step 4 — Close the loop

The tool result has to go back to the model. That second call is what makes it an agent.

Reading: Module 3, sections 3 and 4.

Write the loop: send the conversation; if the reply asks for a tool, run it, append the
result as a tool message, and send again; if the reply is plain text, you are done. Cap
it at five turns no matter what.

**Done when** one question produces model, then tool, then model, and a final answer that
uses the tool's result.

## Step 5 — Trace every step

The trace is the evidence. It is also what the check reads.

Wrap each model call in `with run.llm(MODEL) as span:` and pass the real `finish_reason`
into `span.usage(...)`. Wrap the tool in `with run.tool("your_tool_name"):`. Call
`run.save()` at the end.

**Done when** `./course status` shows a run with two model calls and one tool call.

## Step 6 — Make it fail once

Reading: Module 3, section 6.

Break the tool on purpose (return an error string) and watch what the model does with a
bad result. Then fix it. This is the first thing Module 6 will ask you to remember.

**Done when** you have seen one bad tool result flow back into the model and can say what
happened.

---

## Check

```
./course check 3
```

Your tutor goes quiet while this runs. It reads your trace and looks for model, then
tool, then model. You cannot pass it by printing an answer; only a closed loop has that
shape.

## Explain back

Without looking at your code: why does the tool result have to go back to the model? What
happens if you skip the second call and just print the tool's output, and why is that not
an agent?
