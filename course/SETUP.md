# Setup — instructions for the coding agent

You are setting up **LLM.TEXTBOOK**, an interactive course on LLMs and agents,
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

Needs 3.10 or newer; the lesson notebooks require it. If it is missing or older, stop
and tell the user to install Python from python.org, then start again.

## Step 2 — Clone the course

Clone into the directory the user is currently in, unless they have said otherwise:

```
git clone https://github.com/tayden-b/interactive-ai-course.git model-and-loop
cd model-and-loop/course
```

If the folder already exists, do not re-clone. `cd` into it, run `git pull` to bring the
course up to date, and continue. They are returning, not starting over.

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

## Step 5 — Create the lesson environment

The lessons are interactive notebooks. Their dependencies live in a virtual
environment so nothing touches the system Python:

```
python3 -m venv .venv
.venv/bin/python -m pip install -q "marimo>=0.24,<0.25" openai matplotlib
```

If pip itself is broken and `uv` is installed, `uv venv && uv pip install
"marimo>=0.24,<0.25" openai matplotlib` does the same job. The `./course` command does
not need any of this; it runs on the system Python with no installs.

## Step 6 — Verify

```
./course doctor
```

Every line must pass. If one does not, it prints the exact fix — do that, then run it again.
Do not proceed while `doctor` is failing.

## Step 7 — Start the bridge

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

## Step 8 — Open the first lesson

Start the notebook server, in the background, and leave it running:

```
.venv/bin/marimo edit modules/m1/lessons/01_first_call.py -p 2718 --headless --no-token --watch > .course/marimo.log 2>&1 &
```

Then tell the user: **open http://localhost:2718 in your browser.** That page is the
lesson. When you edit a lesson file and save it, the change appears and runs in their
browser on its own; that is how you will teach.

Suggest the arrangement plainly: this window on one half of the screen, the lesson on
the other half, side by side. Tell them they do not need the course website while
building; it is for reading the modules, and it will show their runs whenever they go
back to it.

If the user asked to start at a different module, open that module's first notebook
instead, if it exists.

Optional, Claude Code only: if `npx` is on PATH you may run
`npx skills add marimo-team/marimo-pair` to gain live-kernel access to the notebook
(run cells, read variables). If it fails for any reason, skip it. Editing the files
works for every agent.

## Step 9 — Become the tutor

Read `TUTOR.md` in this folder, in full, and follow it for the rest of your work with this
person. It governs how you teach: hint-first, never hand over a finished solution, never
edit anything under `checks/`.

Then read `modules/m<N>/BUILD.md` for the module the user asked for and begin.

**If that folder does not exist**, say so plainly — that module's project has not been
written yet — and offer them the modules that do have one (run `./course status`; they are
marked). Do not invent a project. Do not guess at what the build should be.

## Step 10 — Hand back

Tell the user, briefly:

- where the folder is
- that the lesson is open at http://localhost:2718
- that the bridge is running, so their runs will appear on the site
- that you are now their tutor, and you will not write their code for them
- the first thing you want them to try

Then start teaching. Open with a question, not an explanation.
