# How to work with your tutor

You are not reading a course alone. You have a coding agent that has been given this
course's teaching manual, and it leads. You build by talking to it.

This page is the manual for that. What is in this folder, what to say when you are
stuck, what your tutor will refuse to do, and how to get moving again when you are lost.

---

## How a session actually goes

Your tutor opens by telling you where you left off, asks you a quick question about
something you learned earlier, then names one goal for today and starts on step 1.

From there the loop is always the same:

1. It tells you which step you are on and what it is for.
2. It asks what you think before it explains anything.
3. You try. It waits.
4. You show it what you wrote. It reads your actual code before reacting.
5. It confirms the step is done and names the next one.

**You never have to ask "what now?"** If you ever do, something went wrong. Say so, and
it will re-orient you.

## What to say

Copy these. They work better than being polite and vague.

**When you are stuck**

> I'm stuck on step 2. I don't know what to write first.

Do not open with "can you write this for me". You will get a question back, which is
slower than just saying where you are stuck.

**When you do not understand the explanation**

> Explain that again, simpler, and use an example.

Or better:

> I think it works like [your guess]. Where am I wrong?

Being wrong out loud is the fastest way to learn here. Your tutor is told to correct you
directly rather than agree politely.

**When you want to know why**

> Why that way and not [the other way you were thinking]?

**When you disagree**

> I don't think that's right, because [reason].

It is told to hold its position if it is right, and to change its mind if you are. Push
back when something smells wrong.

**When you want to check your work**

> Check my work before I run the check.

**When you want to move on**

> I'm done with this step, what's next?

**At the end of a module**

> Quiz me on this module before I move on.

## What it will not do

**It will not write your solution.** Not on the third ask, not if you say you are in a
hurry, not if you say you already understand it. You will get a hint, then a shape, then
at most one line with the reason for that line. That is the deal, and it is the whole
reason this works.

**It will not touch the graders.** Everything in `checks/` is off limits to it, and it
will refuse if you ask. Those files decide whether you actually built the thing.

**It will not open with praise.** It is told to find one concrete flaw before saying
anything nice. If it says "this is good", it means it.

**It will not put your API key anywhere except `.env`**, and it will never invent one.

## When you are lost

Say so plainly:

> I'm lost. Where am I?

It will run `./course status`, tell you where you are, ask one question to find what
actually broke, and pick up from that step. It will not restart the module on you.

If the whole session has gone sideways, close it and start a new one with:

> Read TUTOR.md and pick up where I left off.

Your progress is on disk, not in the conversation. Nothing is lost.

## What is in this folder

| | |
|---|---|
| `my-agent/` | **Your code.** One project that grows across all eight modules. |
| `modules/mN/BUILD.md` | The steps for each module. Your tutor teaches from these. |
| `checks/` | The graders. Off limits to you and to your tutor. |
| `traces/` | A record of every run you make. This is what gets graded. |
| `tracing.py` | The small library you wrap your model calls in. Read it, it is short. |
| `.env` | Your API key and your spend cap. Never committed, never uploaded. |
| `TUTOR.md` | The teaching manual your agent follows. Read it if you are curious. |

## Commands you can run

```
./course status      where you are, and what you have passed
./course check 1     grade a module (your tutor goes quiet for this)
./course serve       let the website show your runs, and serve this page
./course doctor      check your setup when something feels broken
```

You will not need these often. Your tutor runs them for you.

## Why the checks read your traces

Your checks do not look at what your program printed. They look at `traces/latest.json`,
which records what your program actually did: every model call, every tool call, how long
each took, what it cost.

That means you cannot pass by printing the right answer. Module 3's check looks for
model, then tool, then model again, because that shape only exists if you really built a
loop.

It also means the grading survives the obvious question: it does not matter who typed the
code, it matters whether the system behaves. That is the skill worth having.

## The one habit worth forming

After each step, before you move on, say what you just built in one sentence without
looking at the code. If you cannot, you are not done, whatever the check says. Your tutor
will ask you to do this anyway at the end of each module. Do it more often than that.
