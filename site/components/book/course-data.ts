// The course's table of contents, plus the copy each module page opens with.
// `build` is the one-word answer to "what do you walk away with"; `minutes` is per section,
// in section order; `projectSection` is the 1-based section that is the project (0 = the whole module).
export const courseModules = [
  {
    title: "What is an LLM?", description: "Tokens, probabilities, and how a model turns your words into a reply.", project: "Your first call.", build: "A call",
    sections: ["What an LLM is", "Tokens: what the model reads", "A probability machine", "One token at a time", "Temperature: choosing from the list", "Where the model came from", "The context window", "Talking to it: prompts and conversations", "What it gets wrong", "The whole picture", "Project: your first call"],
    minutes: [6, 7, 8, 6, 7, 8, 6, 8, 7, 5, 25], projectSection: 11,
    intro: "Everything else in this book sits on top of a language model, so this module is about the model itself: what it reads, what it produces, where it came from, and what it gets wrong. No installation, no code, no math beyond a percentage. About ninety minutes.",
    outcomes: ["Explain what a language model does in one sentence.", "Read a next-word probability chart and say what temperature does to it.", "Say why a model can be confidently wrong, and what that means for everything built on it."],
    projectTitle: "Your first call", projectBlurb: "At the end of this module you set up your lab and make one real call to a model — and the same probability chart you read in Section 3 shows your prompt and your numbers.", projectCta: "Open project →",
  },
  {
    title: "Working with a model", description: "The API, the system prompt, examples, and getting answers in a shape your code can use.", project: "The note-to-actions tool.", build: "A tool",
    sections: ["The API: a model you call from code", "The system prompt", "Show, don't tell: examples", "Structured output", "When the output is wrong", "Streaming and latency", "What it costs, and caching", "Project: the note-to-actions tool"],
    minutes: [7, 6, 6, 8, 7, 5, 6, 30], projectSection: 8,
    intro: "In Module 1 you learned what a model does. This module is about driving one from code: calling it, steering it with instructions and examples, and getting answers back in a shape your program can use. By the end you'll have written a small, honest tool that turns messy text into clean data — and you'll understand why that skill is the foundation of every agent.",
    outcomes: ["Call a model from a script and read what comes back.", "Steer a model with a system prompt and examples instead of trial and error.", "Get structured, validated output — and handle it when the model gets it wrong."],
    projectTitle: "The note-to-actions tool", projectBlurb: "A script that takes messy meeting notes and returns a validated list of action items as JSON, retrying when the model's answer doesn't fit the shape.", projectCta: "Open project →",
  },
  {
    title: "Tools and the agent loop", description: "How a model that can only talk becomes one that can act.", project: "An agent that can look things up.", build: "An agent",
    sections: ["A model can't do anything", "A tool is three things", "The round trip", "The loop", "The window is the loop variable", "When it picks the wrong tool", "MCP, briefly", "Project: an agent that can look things up"],
    minutes: [5, 7, 7, 8, 6, 7, 5, 40], projectSection: 8,
    intro: "A model can only produce text. This module is about giving it hands: describing a tool, letting the model ask for it, running it yourself, and sending the result back — then doing that in a loop until the job is done. By the end, you'll have built one and watched every step of it.",
    outcomes: ["Explain what a tool is and who actually runs it.", "Draw the loop — gather, decide, act, observe — and say when it stops.", "Diagnose the most common reason an agent picks the wrong tool."],
    projectTitle: "An agent that can look things up", projectBlurb: "A small agent with three tools — a clock, a search, and a file reader — that answers questions it couldn't answer alone, with every step recorded.", projectCta: "Open project →",
  },
  {
    title: "Memory and context", description: "What the model can see, what it forgets, and how to give it a memory.", project: "An agent that remembers.", build: "Memory",
    sections: ["The window is all it has", "Short-term memory: the transcript", "Long-term memory: notes and files", "Retrieval", "Context rot", "Context engineering", "Project: an agent that remembers"],
    minutes: [6, 7, 7, 8, 7, 8, 40], projectSection: 7,
    intro: "Your agent's only memory is the window, and the window fills. This module is about working inside that limit on purpose: keeping the transcript short, giving the agent notes it can write and read, finding the right thing to put in front of it, and recognizing the four ways a full window goes wrong. By the end, your agent remembers across runs.",
    outcomes: ["Say the difference between short-term and long-term memory for an agent, and where each lives.", "Summarize a transcript without losing what matters.", "Explain retrieval in one paragraph and know when you need it."],
    projectTitle: "An agent that remembers", projectBlurb: "Your Module 3 agent, with notes it writes for itself, a summary step when the transcript gets long, and a small retrieval step that finds the right note.", projectCta: "Open project →",
  },
  {
    title: "Evals", description: "How you know it worked.", project: "A test suite for your agent.", build: "A test suite",
    sections: ["It seemed fine is not a test", "Golden cases", "Three ways to grade", "Traces are evidence", "Compounding errors", "Every time, automatically", "Project: a test suite for your agent"],
    minutes: [5, 7, 8, 8, 6, 6, 40], projectSection: 7,
    intro: "You've built an agent that works when you watch it. This module is about knowing it works when you don't: writing down what 'correct' means before you build, grading automatically, reading traces to find out why it failed, and running all of that every time the code changes. Evals are the difference between a demo and something you'd put your name on.",
    outcomes: ["Write a set of golden cases for a task before building it.", "Pick the right grader — exact match, a code check, or a model judging — for each case.", "Read twenty traces and name the step where things go wrong."],
    projectTitle: "A test suite for your agent", projectBlurb: "Golden cases, three kinds of grader, assertions on the trace, and a command that runs it all — then a change that makes it fail, on purpose.", projectCta: "Open project →",
  },
  {
    title: "Failure modes and guardrails", description: "Hallucinated results, runaway loops, injection, cost blowups — and the checks that catch them.", project: "Guardrails.", build: "Guardrails",
    sections: ["Make it break on purpose", "Made-up facts and made-up results", "Loops that never stop", "Prompt injection and the lethal trifecta", "Cost and latency blowups", "Guardrails", "Project: guardrails for your agent"],
    minutes: [5, 7, 6, 8, 6, 8, 40], projectSection: 7,
    intro: "Agents fail in a small number of recognizable ways: they make things up, they loop, they get tricked by text, and they spend. This module is about breaking your own agent on purpose so you recognize each failure, and then building the checks that catch them — before the model acts, after it answers, and around what it's allowed to do.",
    outcomes: ["Name the four failure modes and reproduce each one.", "Explain prompt injection and the lethal trifecta in plain words.", "Design guardrails as checks around the loop, not pleas inside the prompt."],
    projectTitle: "Guardrails for your agent", projectBlurb: "Input, output, and action checks; a step cap, a budget cap, and a timeout; and an injection test that your agent now passes.", projectCta: "Open project →",
  },
  {
    title: "Workflows and orchestration", description: "Chaining, routing, parallel, orchestrator–workers, and when not to use an agent at all.", project: "A two-agent system.", build: "Two agents",
    sections: ["Workflows first", "Chaining and routing", "Parallel: fan out, fan in", "Orchestrator and workers", "A critic in the loop", "Humans in the loop", "Project: a two-agent system"],
    minutes: [7, 7, 6, 8, 6, 6, 45], projectSection: 7,
    intro: "One agent in one loop is the right shape for some jobs and the wrong shape for most. This module is the catalog of other shapes: fixed workflows when the steps are known, routing, running things in parallel, a lead agent directing specialists, a critic checking a generator, and a person in the loop where it matters. By the end you'll have built a two-agent system and know why it's two.",
    outcomes: ["Decide whether a task needs an agent at all.", "Draw the five workflow patterns and say when each fits.", "Explain why splitting work across agents is a context decision, not a cleverness decision."],
    projectTitle: "A two-agent system", projectBlurb: "An orchestrator that routes requests, fans out independent work to a worker in parallel, and synthesizes — with the trace showing both agents.", projectCta: "Open project →",
  },
  {
    title: "Capstone: The Desk", description: "A production multi-agent research system you deploy, trace, and show.", project: "The whole module.", build: "The Desk",
    sections: ["What you're building", "The orchestrator", "The specialists", "The harness", "Memory across runs", "Observability", "Evals and guardrails in CI", "Deploy and show it"],
    minutes: [8, 8, 8, 8, 6, 8, 7, 8], projectSection: 0,
    intro: "Everything in this book, in one system you can show. The Desk is a production multi-agent research service: someone submits a question, an orchestrator plans, specialist agents research in parallel with real tools, a checker verifies every claim against its source, a writer produces the brief, and the whole run is visible as a live trace — with memory across runs, evals and guardrails in CI, a budget, and a public page anyone can use. It's the portfolio piece. It's also the proof that the seven modules before it were one idea.",
    outcomes: ["Design a multi-agent system from the context windows outward.", "Explain every span in a production trace, and what it cost.", "Deploy an agent service with evals, guardrails, and observability, and talk about it in an interview."],
    projectTitle: "The Desk", projectBlurb: "Eight sections, one system. At the end it's deployed, traced, tested, and public.", projectCta: "Start capstone →",
  },
] as const

export const courseTotals = {
  modules: courseModules.length,
  sections: courseModules.reduce((n, m) => n + m.sections.length, 0),
  figures: 14,
  capstones: 1,
}
