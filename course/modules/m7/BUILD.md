# Module 7 — Workflows and orchestration

**Reading:** Module 7 on the course website, sections 1 to 6.

**What you end up with:** `my-agent/team.py`, a two-agent system: an orchestrator that
plans, workers that each do one part in their own small window, and a synthesis at the
end. For the first time, your trace will show two context windows — and the thing to
look at is how small each one stays.

**Six steps.** Your tutor takes you through them one at a time.

---

## Step 1 — Route before you reason

If you can write down the steps, write a workflow.

Reading: Module 7, sections 1 and 2.

Start `my-agent/team.py`. First piece: a router. One cheap model call that classifies
an incoming request into two or three types you choose (for a research assistant:
"single fact", "comparison", "not our job"). Structured output, validated — Module 2,
back again. Simple requests will skip the orchestrator entirely.

**Done when** three test requests land in three different buckets, and you can say why
the router is a workflow step and not an agent.

## Step 2 — The orchestrator plans

The orchestrator's power is a small window.

Reading: Module 7, section 4.

For requests the router marks as big, one model call turns the request into a plan:
two or three parts that can be answered independently, each with a one-line goal.
Structured output, validated before anything runs. The orchestrator never uses tools
and never reads a source — it sees the request, the plan, and later the summaries.

**Done when** a real request produces a plan you would delegate yourself: independent
parts, no overlap, nothing missing.

## Step 3 — One worker, one part

A worker is your Module 6 agent with a narrower job description.

Write the worker as a function: it takes one part of the plan, runs its own small loop
with its own transcript and tools, and returns a compact result — a summary of a few
sentences, never its whole transcript. Nest its trace inside a named span so the
architecture is visible:

```
with run.step("orchestrator") as span:
    ...the planning call...
with run.step("worker 1") as span:
    ...the worker's own llm and tool calls happen inside this block...
```

**Done when** one worker completes one part, and its spans sit nested under the worker
in the trace.

## Step 4 — Fan out

Independent work doesn't have to wait.

Reading: Module 7, section 3.

Run the workers concurrently — Python's `ThreadPoolExecutor` is enough. Each worker
still traces into its own span. Compare wall-clock time against running them one after
another; the total tokens are the same, the waiting isn't.

**Done when** all workers complete and the trace shows every worker's window separately.

## Step 5 — Fan back in

The aggregator is the step to distrust.

One final model call gets the request and the workers' summaries — never their
transcripts — and synthesizes the answer:

```
with run.step("synthesize") as span:
    ...the synthesis call...
```

Then look at what the synthesis was given. If one worker returned something wrong, would
the aggregator notice or repeat it? Add one honesty rule to its prompt: name
disagreements between workers instead of papering over them.

**Done when** the end-to-end run works, and the orchestrator's side of the trace — plan
plus summaries plus synthesis — is a fraction of the tokens any single worker spent.

## Step 6 — Justify the architecture

Two agents is a cost. Know what it bought.

Reading: Module 7, sections 4 and 5.

Run the same big request through your Module 6 single agent, then through the team.
Compare the traces: total tokens, wall time, and the size of the biggest single window
in each. The team's win is isolation — no worker's reading crowds the planner's window.

**Done when** you can say, with numbers from your own traces, what the second agent
bought and what it cost.

---

## Check

```
./course check 7
```

Your tutor goes quiet while this runs. It reads your trace: an orchestrator that
planned, at least two workers with their own model calls nested inside, and a synthesis
at the end.

## Explain back

Without looking at your code: why is splitting work across agents a context decision
rather than a cleverness decision? What does the orchestrator never see, and why is
that the point?
