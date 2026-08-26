"""Generates the demo's canned data: the real top-20 next-token candidates for one
fixed prompt. Run once, locally, with a real key in course/.env. The committed JSON is
what the browser demo uses; visitors never make an API call."""

import json
import os
import sys
from pathlib import Path

COURSE = Path(__file__).resolve().parents[2] / "course"
sys.path.insert(0, str(COURSE))

for line in (COURSE / ".env").read_text().splitlines():
    line = line.strip()
    if line and not line.startswith("#") and "=" in line:
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip())

from openai import OpenAI

PROMPT = "The capital of France is"

client = OpenAI()
resp = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": PROMPT}],
    max_tokens=1,
    logprobs=True,
    top_logprobs=20,
)
top = resp.choices[0].logprobs.content[0].top_logprobs
data = {"prompt": PROMPT, "model": "gpt-4o-mini", "source": "real",
        "logprobs": [[t.token, t.logprob] for t in top]}
out = Path(__file__).parent / "public" / "logprobs.json"
out.write_text(json.dumps(data, indent=1))
print(f"wrote {out} with {len(data['logprobs'])} candidates")
