# Setup — instructions for the coding agent

You are setting up **The Model and the Loop**, an interactive course on LLMs and agents,
for the person you are talking to. Follow these steps in order. Do not improvise, do not
skip ahead, and do not substitute your own idea of how a course folder should look.

If a step fails, stop and tell the user exactly which step failed and what the error was.
Do not work around a failure silently — a broken install that looks fine is worse than an
obvious one.

---

## Step 1 — Check Python

```
python3 --version
```

Needs 3.9 or newer. If it is missing or older, stop and tell the user to install Python
from python.org, then start again.

## Step 2 — Clone the course

Clone into the directory the user is currently in, unless they have said otherwise:

```
git clone https://github.com/tayden-b/interactive-ai-course.git model-and-loop
cd model-and-loop/course
```

If the folder already exists, do not re-clone. `cd` into it and continue — they are
returning, not starting over.

## Step 3 — Run init

```
./course init
```

This detects which coding agent is in use, writes the adapter file for it, creates `.env`,
and sets the current module. Read what it prints.

## Step 4 — Ask for an API key, and stop

The user needs an API key from OpenAI or Anthropic in `.env`. **You must not invent one,
guess one, reuse one you have seen elsewhere, or take one from another file on this machine.**

Ask them for it directly and wait. Tell them:

- it goes in `.env`, which is git-ignored and never leaves their machine
- it is their own account and their own (small) spend — this course does not bill them
- `MAX_USD` in `.env` is a hard per-run cap, and the first modules cost a few cents at most

When they give it to you, write it into `.env` and continue. If they would rather paste it
themselves, let them — then wait for them to say they are done.

## Step 5 — Verify

```
./course doctor
```

Every line must pass. If one does not, it prints the exact fix — do that, then run it again.
Do not proceed while `doctor` is failing.

## Step 6 — Start the bridge

```
./course serve &
```

**Run it in the background with `&`** — it is a long-running server and it must not block
you. It lets the course website read the traces the user's own agent produces, over
localhost. Nothing is uploaded.

Confirm it came up:

```
curl -s http://localhost:4747/ | head -c 60
```

If the port is busy the server picks the next free one (4748–4750) and prints which. That
is fine; the website tries all four.

## Step 7 — Become the tutor

Read `TUTOR.md` in this folder, in full, and follow it for the rest of your work with this
person. It governs how you teach: hint-first, never hand over a finished solution, never
edit anything under `checks/`.

Then read `modules/m1/BUILD.md` and begin Module 1.

## Step 8 — Hand back

Tell the user, briefly:

- where the folder is
- that the bridge is running, so their runs will appear on the site
- that you are now their tutor, and you will not write their code for them
- the first thing you want them to try

Then start teaching. Open with a question, not an explanation.
