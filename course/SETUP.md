# Setup — instructions for the coding agent

You are setting up **LLM.TEXTBOOK**, an interactive course on LLMs and agents, for the
person you are talking to. Follow these steps in order. Do not improvise and do not skip
ahead.

If a step fails, stop and tell the user exactly which step failed and what the error was.
Do not work around a failure silently. A broken install that looks fine is worse than an
obvious one.

---

## Step 1 — Check Python

```
python3 --version
```

Needs 3.9 or newer. If it is missing or older, stop and tell the user to install Python
from python.org, then start again.

## Step 2 — Get the course

```
git clone https://github.com/tayden-b/interactive-ai-course.git llm-textbook
cd llm-textbook/course
```

If the folder already exists, do not re-clone. `cd` into it, run `git pull` to bring the
course up to date, and continue. They are returning, not starting over.

## Step 3 — Run init

```
./course init
```

This detects which coding agent is in use, writes the adapter file for it, creates
`.env`, and sets the current module. Read what it prints.

## Step 4 — Ask for an API key, and stop

The user needs an API key from OpenAI or Anthropic in `.env`. **You must not invent one,
guess one, reuse one you have seen elsewhere, or take one from another file on this
machine.**

Ask them for it directly and wait. Tell them:

- it goes in `.env`, which is git-ignored and never leaves their machine
- it is their own account and their own (small) spend; this course does not bill them
- `MAX_USD` in `.env` is a hard per-run cap, and the early modules cost a few cents

When they give it to you, write it into `.env` and continue. If they would rather paste
it themselves, let them, then wait for them to say they are done.

## Step 5 — Verify

```
./course doctor
```

Every line must pass. If one does not, it prints the exact fix. Do that, then run it
again. Do not proceed while `doctor` is failing.

## Step 6 — Start the bridge

```
./course serve &
```

**Run it in the background with `&`** so it does not block you. It does two things: it
lets the course website show the user their own runs, and it serves a plain reading
guide for the current module at `http://localhost:4747/guide`.

Confirm it came up:

```
curl -s http://localhost:4747/ | head -c 60
```

If the port is busy the server takes the next free one (4748 to 4750) and prints which.

## Step 7 — Become the tutor, and lead

Read `TUTOR.md` in this folder, in full. It governs everything about how you teach from
here: you lead, you never hand over solutions, and you never edit anything in `checks/`.

Then read `modules/m<N>/BUILD.md` for the module the user asked for and start teaching
from step 1 of it.

**If that module folder does not exist**, say so plainly. That module's project is not
written yet. Offer the ones that are (`./course status` marks them). Do not invent a
project.

Before you begin, tell the user briefly:

- where the folder is on their machine
- that you will lead them through this module step by step, and they should just talk to
  you here
- that the reading for each module lives on the course website, and a plain text version
  of this module's build steps is at `http://localhost:4747/guide` if they want it
- that you will not write their code for them

Then start. Open with a question, not an explanation.
