#!/usr/bin/env python3
"""Move each figure's accent from solid ink to the book's blue.
Rule: shapes and heavy strokes carry var(--figure-accent); text stays ink. Idempotent."""
import re, pathlib, sys
SVG = pathlib.Path(__file__).resolve().parent / "svg"
SHAPE = r'<(?:g|rect|circle|ellipse|path|polygon|polyline)\b[^>]*>'

def recolor(src: str) -> str:
    # 1) solid-filled shapes -> blue (text elements are untouched: they are <text>)
    def fill_sub(m):
        el = m.group(0)
        return el.replace('fill="currentColor"', 'fill="var(--figure-accent)"')
    src = re.sub(SHAPE, fill_sub, src)

    # 2) heavy accent strokes (2.5 / 3) on paths -> blue, and point them at a blue marker
    used_ink = set()
    def stroke_sub(m):
        el = m.group(0)
        if 'stroke="currentColor"' in el and re.search(r'stroke-width="(2\.5|3)"', el):
            el = el.replace('stroke="currentColor"', 'stroke="var(--figure-accent)"')
            mk = re.search(r'marker-end="url\(#(ink\d*)\)"', el)
            if mk:
                used_ink.add(mk.group(1))
                el = el.replace(f'url(#{mk.group(1)})', f'url(#{mk.group(1).replace("ink","acc")})')
        return el
    src = re.sub(r'<path\b[^>]*>', stroke_sub, src)

    # 3) add a blue marker for every ink marker an accent path now references
    for ink in sorted(used_ink):
        acc = ink.replace("ink", "acc")
        if f'id="{acc}"' in src: continue
        m = re.search(rf'<marker id="{ink}".*?</marker>', src, re.S)
        if not m: continue
        clone = m.group(0).replace(f'id="{ink}"', f'id="{acc}"').replace('stroke="currentColor"', 'stroke="var(--figure-accent)"')
        src = src.replace(m.group(0), m.group(0) + "\n    " + clone, 1)
    return src

for f in sorted(SVG.glob("fig-*.svg")):
    before = f.read_text(); after = recolor(before)
    f.write_text(after)
    n_fill = after.count('fill="var(--figure-accent)"'); n_stroke = after.count('stroke="var(--figure-accent)"')
    print(f"  {f.name}: {n_fill} blue fills, {n_stroke} blue strokes{'' if before!=after else '  (unchanged)'}")
