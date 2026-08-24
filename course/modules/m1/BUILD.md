# Module 1 — Your first call

**Read first:** Module 1 on the site, sections 1–10. This is section 11.

## What you're building
One Python file that sends a prompt to a model, prints the reply, and records what happened
as a trace.

## Steps
1. Create `my-agent/call.py`.
2. Load your key from `.env` (the standard library can do this; you do not need a package).
3. Make one chat completion call to a small, cheap model.
4. Wrap the call in a span:
   ```python
   run = Run(module=1)
   with run.llm("gpt-4o-mini", temperature=0.7) as span:
       ...
       span.usage(input_tokens=..., output_tokens=..., finish_reason=...)
   run.save()
   ```
   The token counts come off the API response — do not estimate them.
5. Run it three times, at temperature 0, 0.7, and 1.5. Read the three replies.

## Check
```
./course check 1
```

## Explain back
Without looking at your code: what exactly did you send, and what exactly came back? Where
did the token numbers come from, and why is the input count larger than your prompt?
