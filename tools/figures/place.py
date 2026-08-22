#!/usr/bin/env python3
"""Wire generated figure components into the module components.

Modules 2-8 store `figure` as an ASCII string rendered in a <pre>. We add an optional
`node` field, render it in preference to the <pre>, and set it on the one target lesson.
lesson-one.tsx already stores `figure` as a ReactNode, so there we swap the value directly.
Idempotent: safe to re-run.
"""
import re, sys, pathlib

BOOK = pathlib.Path(__file__).resolve().parents[2] / "site" / "components" / "book"

# (file, component, anchor that identifies the target lesson)
PLACEMENTS = [
    ("module-three.tsx", "Fig03", 'title: "A model can\'t do anything"'),
    ("module-three.tsx", "Fig04", 'title: "The loop"'),
    ("module-four.tsx",  "Fig05", 'title: "Long-term memory: notes and files"'),
    ("module-six.tsx",   "Fig06", 'title: "Guardrails"'),
    ("module-eight.tsx", "Fig07", 'title: "What you’re building"'),
]

# Matches the <Figure ...><pre ...>{X.figure}</pre></Figure> shape in any module variant:
# the caption/library props differ, and module-eight binds the lesson as `item` not `lesson`.
FIG_RE = re.compile(
    r'<Figure caption=\{(?P<v>\w+)\.caption\}(?P<lib> library=\{\w+\.library\})?>'
    r'(?P<pre><pre className="[^"]*">\{\w+\.figure\}</pre>)'
    r'</Figure>'
)

def use_node(src):
    """Render `node` in preference to the <pre>, and hide the LIBRARY note when a node exists."""
    def sub(m):
        v, lib, pre = m.group("v"), m.group("lib"), m.group("pre")
        libprop = f' library={{{v}.node ? "" : {v}.library}}' if lib else ""
        return f'<Figure caption={{{v}.caption}}{libprop}>{{{v}.node ?? {pre}}}</Figure>'
    return FIG_RE.sub(sub, src, count=1)

def add_import(src, comps):
    have = re.search(r'import \{([^}]*)\} from "@/components/figures/course-figures"', src)
    if have:
        cur = {c.strip() for c in have.group(1).split(",") if c.strip()}
        cur |= set(comps)
        return src[:have.start()] + f'import {{ {", ".join(sorted(cur))} }} from "@/components/figures/course-figures"' + src[have.end():]
    m = re.search(r'^import .*?from "\./reading-frame"$', src, re.M)
    ins = m.end()
    return src[:ins] + f'\nimport {{ {", ".join(sorted(set(comps)))} }} from "@/components/figures/course-figures"' + src[ins:]

def main():
    todo = {}
    for fname, comp, anchor in PLACEMENTS:
        todo.setdefault(fname, []).append((comp, anchor))

    for fname, items in todo.items():
        p = BOOK / fname
        src = p.read_text()
        before = src
        available = []
        for comp, anchor in items:
            if f"export function {comp}" not in (BOOK.parents[0] / "figures" / "course-figures.tsx").read_text():
                print(f"  skip {comp} — not generated yet"); continue
            if anchor not in src:
                print(f"  !! anchor not found in {fname}: {anchor}"); continue
            if f"node: <{comp} />" in src:
                available.append(comp); print(f"  = {comp} already placed in {fname}"); continue
            src = src.replace(anchor, f'node: <{comp} />, {anchor}', 1)
            available.append(comp)
            print(f"  + {comp} -> {fname}")
        if not available:
            continue
        # type: allow an optional node
        if "node?: React.ReactNode" not in src:
            src = re.sub(r'(type Lesson = \{)', r'\1 node?: React.ReactNode;', src, count=1)
        # render node in preference to the <pre>
        if ".node ??" not in src:
            src = use_node(src)
        src = add_import(src, available)
        if src != before:
            p.write_text(src); print(f"  wrote {fname}")

if __name__ == "__main__":
    main()
