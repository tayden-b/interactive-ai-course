"""The offline guide: the current module's build steps, rendered as a plain page.

Optional by design. The agent leads; this is here for anyone who wants to read ahead,
work without the website, or just see the whole module at once. Stdlib only, and it
renders the same BUILD.md the tutor teaches from, so the two can never drift.
"""

from __future__ import annotations

import html
import json
import re
from pathlib import Path

CSS = """
:root { --paper:#faf9f7; --ink:#1a1a1a; --muted:#6b6b6b; --line:#e2e0dc; --blue:#2563f0; }
* { box-sizing:border-box; }
body { margin:0; background:var(--paper); color:var(--ink); line-height:1.65;
  font-family:'Instrument Sans',system-ui,-apple-system,'Segoe UI',sans-serif; }
.wrap { max-width:46rem; margin:0 auto; padding:3rem 1.5rem 6rem; }
header { border-bottom:1px solid var(--line); padding-bottom:1.25rem; margin-bottom:2.5rem; }
.eyebrow { font-family:ui-monospace,'JetBrains Mono',Menlo,monospace; font-size:.65rem;
  letter-spacing:.18em; text-transform:uppercase; color:var(--muted); }
.eyebrow a { color:var(--blue); }
h1 { font-size:2.25rem; line-height:1.1; letter-spacing:-.02em; margin:.75rem 0 0; font-weight:500; }
h2 { font-size:1.35rem; margin:2.75rem 0 .5rem; font-weight:500; letter-spacing:-.01em;
  padding-top:1.25rem; border-top:1px solid var(--line); }
h2:first-of-type { border-top:0; padding-top:0; }
h3 { font-size:1rem; margin:1.75rem 0 .4rem; font-weight:600; }
p, li { color:#333; }
a { color:var(--blue); }
code { font-family:ui-monospace,'JetBrains Mono',Menlo,monospace; font-size:.85em;
  background:#f1efec; padding:.1em .35em; }
pre { background:#f1efec; padding:1rem; overflow-x:auto; border-left:2px solid var(--blue); }
pre code { background:none; padding:0; }
blockquote { border-left:2px solid var(--line); margin:1rem 0; padding-left:1rem; color:var(--muted); }
hr { border:0; border-top:1px solid var(--line); margin:2.5rem 0; }
strong { font-weight:600; }
.note { border:1px solid var(--line); background:#fff; padding:1rem 1.25rem; margin-bottom:2.5rem;
  font-size:.9rem; color:var(--muted); }
.note strong { color:var(--ink); }
footer { margin-top:4rem; padding-top:1.25rem; border-top:1px solid var(--line);
  font-family:ui-monospace,'JetBrains Mono',Menlo,monospace; font-size:.65rem;
  letter-spacing:.14em; text-transform:uppercase; color:var(--muted); }
"""


def _inline(t: str) -> str:
    """Escape, then re-apply the inline markdown BUILD.md actually uses."""
    t = html.escape(t)
    t = re.sub(r"`([^`]+)`", r"<code>\1</code>", t)
    t = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2">\1</a>', t)
    return t


def md_to_html(md: str) -> str:
    """A deliberately small renderer for the subset BUILD.md uses."""
    out, lines, i, in_list = [], md.split("\n"), 0, False

    def close_list():
        nonlocal in_list
        if in_list:
            out.append("</ul>")
            in_list = False

    while i < len(lines):
        line = lines[i]

        if line.startswith("```"):
            close_list()
            i += 1
            block = []
            while i < len(lines) and not lines[i].startswith("```"):
                block.append(html.escape(lines[i]))
                i += 1
            out.append("<pre><code>" + "\n".join(block) + "</code></pre>")
            i += 1
            continue

        if line.startswith("### "):
            close_list(); out.append(f"<h3>{_inline(line[4:])}</h3>")
        elif line.startswith("## "):
            close_list(); out.append(f"<h2>{_inline(line[3:])}</h2>")
        elif line.startswith("# "):
            close_list(); out.append(f"<h1>{_inline(line[2:])}</h1>")
        elif line.strip() in ("---", "***"):
            close_list(); out.append("<hr>")
        elif line.startswith("> "):
            close_list(); out.append(f"<blockquote>{_inline(line[2:])}</blockquote>")
        elif re.match(r"^[-*] ", line):
            if not in_list:
                out.append("<ul>"); in_list = True
            out.append(f"<li>{_inline(line[2:])}</li>")
        elif not line.strip():
            close_list()
        else:
            # Join hard-wrapped lines into one paragraph, the way markdown means them.
            close_list()
            para = [line]
            while (i + 1 < len(lines) and lines[i + 1].strip()
                   and not re.match(r"^(#{1,3} |[-*] |> |```|---$|\*\*\*$)", lines[i + 1])):
                i += 1
                para.append(lines[i])
            out.append(f"<p>{_inline(' '.join(x.strip() for x in para))}</p>")
        i += 1

    close_list()
    return "\n".join(out)


def render(root: Path, module: int, titles: dict[int, str]) -> str:
    build = root / "modules" / f"m{module}" / "BUILD.md"
    title = titles.get(module, f"Module {module}")

    if build.exists():
        body = md_to_html(build.read_text())
    else:
        body = (
            f"<h1>Module {module} — {html.escape(title)}</h1>"
            "<p>This module's project is not written yet. Run <code>./course status</code> "
            "to see which ones are.</p>"
        )

    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Module {module} · LLM.TEXTBOOK</title>
<style>{CSS}</style></head>
<body><div class="wrap">
<header>
  <p class="eyebrow">LLM.TEXTBOOK · offline guide ·
    <a href="https://llm-textbook.vercel.app/m/{module}">read this module online</a></p>
</header>
<div class="note">
  <strong>You do not need this page.</strong> Your coding agent leads you through these
  steps one at a time, and that is the way the course is meant to be taken. This is the
  whole module in one place, for reading ahead or working without the website.
</div>
{body}
<footer>Served from your own machine by <code>./course serve</code></footer>
</div></body></html>"""
