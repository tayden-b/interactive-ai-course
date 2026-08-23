# Module 3 — Tools and the agent loop

**Read first:** Module 3 on the site, sections 1–3. This is section 4.

## What you're building
An agent that can call one tool and keep going. Not a single call — a loop.

## Steps
1. Copy `my-agent/call.py` to `my-agent/loop.py`.
2. Write one real tool. Something with an answer your model cannot know: the current time,
   a file on disk, a number from a local JSON file. Not a stub that returns a constant.
3. Describe the tool to the model in its tool-calling format.
4. Write the loop:
   - send the conversation
   - if the model asked for a tool, run it, append the result, and **send it back**
   - if it didn't, you're done
   - stop after 5 turns no matter what
5. Trace every step:
   ```python
   with run.llm(MODEL) as span:
       ...
       span.usage(..., finish_reason=response.choices[0].finish_reason)
   with run.tool("get_time"):
       ...
   ```
   Pass the **real** `finish_reason` — the check looks for the model choosing the tool itself.

## Check
```
./course check 3
```
This one reads your trace, not your output. It looks for **model → tool → model**: the model
asked, your code ran it, the model saw the result. You cannot pass by printing an answer.

## Explain back
Why does the tool result have to go back to the model? What happens if you skip the second
model call and just print the tool's output — and why isn't that an agent?
