# Module 4 — Memory and context

**Reading:** Module 4 on the course website, sections 1 to 6.

**What you end up with:** your Module 3 agent in `my-agent/loop.py`, now with a memory:
notes it writes for itself, a compaction step when the transcript gets long, and a
retrieval step that loads only the notes that matter. An agent that remembers you
next week.

**Six steps.** Your tutor takes you through them one at a time.

---

## Step 1 — Give it a place to write

Long-term memory is a file. That is not a simplification; that is the state of the art.

Reading: Module 4, section 3.

Add a second tool to your loop: `remember(note)`, which appends one short dated line to
`my-agent/notes.md`. Describe it to the model, and add one rule to your system prompt
about what deserves a note: preferences, decisions, facts learned — not chit-chat.

Trace it like any tool:

```
with run.tool("remember"):
    ...append the line...
```

**Done when** you tell the agent something worth keeping ("I prefer short answers"),
and the line appears in `notes.md` — written by the agent, not by you.

## Step 2 — Read it back at the start

Memory that is never read is a diary, not a memory.

At the start of each run, read `notes.md` and put its contents into the system prompt.
Then start a fresh run and ask a question the notes should change the answer to.

**Done when** the agent honors, in a brand-new run, something you told it in an old one.

## Step 3 — Watch the window fill

Before you fix the transcript problem, see it.

Reading: Module 4, sections 1 and 2.

Give your loop a scripted conversation of ten or more turns (a list of user messages it
works through). After each turn, record the transcript size:

```
with run.step("turn") as span:
    span.set(turn=i, transcript_tokens=rough_count)
```

A rough count — total characters divided by four — is fine here; this number is a gauge,
not a bill.

**Done when** you can say how fast your transcript grows per turn, and roughly when it
would drown the window.

## Step 4 — Compact

Throw detail away on purpose. Keep the thread.

Reading: Module 4, section 2.

Pick a threshold. When the transcript passes it, ask the model to summarize the older
turns — decisions, open questions, facts to remember, not a narrative — then replace
those turns with the summary. Keep the recent turns word-for-word.

Trace the moment:

```
with run.step("compact") as span:
    ...summarize and swap...
    span.set(tokens_before=..., tokens_after=...)
```

**Done when** a long run shows the transcript dropping at the threshold — and the agent
still knows what the task is afterward.

## Step 5 — Retrieve instead of loading everything

Don't load the library. Load the three pages that matter.

Reading: Module 4, section 4.

Your notes file will outgrow the window eventually, so stop loading all of it. Score
each note against the user's current message — simplest version: count shared words —
and load only the top few. Embeddings can replace the scoring later; the shape of the
step is what matters.

```
with run.step("retrieve") as span:
    ...pick the notes...
    span.set(notes_total=..., notes_loaded=...)
```

**Done when** a run loads fewer notes than exist, and the right ones.

## Step 6 — Run the whole thing

One run that uses every kind of memory.

Script a conversation that: tells the agent something worth remembering, runs long
enough to trigger compaction, and ends with a question that needs a retrieved note.
Watch the trace: the `remember` call, the compaction drop, the retrieval count.

**Done when** one trace shows all three — and `notes.md` reads like something a
colleague could skim.

---

## Check

```
./course check 4
```

Your tutor goes quiet while this runs. It reads your trace and your notes file: a
`remember` that fired, a compaction that shrank the transcript, a retrieval that chose.

## Explain back

Without looking at your code: where does each kind of memory live, and what dies when
the run ends? Why keep the recent turns verbatim and summarize the old ones — why not
the other way around?
