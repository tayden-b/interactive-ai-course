# Visual language — non-negotiable
*Derived from the site's real globals.css. Do not deviate.*

The site is a **light, warm, editorial book**: near-white paper, near-black warm ink, and
**no colour at all** — `--primary` is byte-identical to `--foreground`. Type is Instrument Serif
(display), Instrument Sans (body), JetBrains Mono (eyebrows/captions). Figures must look
letterpressed onto that page.

## Colour — only these strings
- `currentColor`              → main structure the figure is about (= foreground, near-black).
- `var(--muted-foreground)`   → context, inherited parts, connectors, quiet labels.
- `var(--border)`             → hairlines, dashed enclosures, grid.
- `var(--background)`         → knockout text sitting on a filled shape.

**Never** a hex code, `rgb()`, `hsl()`, a named colour, or `var(--primary)` — primary is
indistinguishable from foreground and is therefore useless. Opacity is allowed for de-emphasis.

## The accent — how to make ONE thing pop without colour
Exactly one element per figure is **filled solid**: `fill="currentColor"`, with its label knocked
out in `fill="var(--background)"`. Everything else in the figure is outline-only. A solid black
shape on warm paper surrounded by outlines is unmistakable at any size — this is the whole accent
system. Optionally the accent's connector may be `stroke-width="2.5"` in `currentColor`.
Never fill two things. Never fill nothing.

Hierarchy, darkest to lightest:
1. the filled accent shape
2. `currentColor` 2px outlines — the parts this figure is about
3. `var(--muted-foreground)` 1.5px — context carried over from earlier figures
4. `var(--border)` 1px dashed — enclosures and ground

## Canvas
- `viewBox="0 0 960 H"`, H ∈ {360, 420, 480}. `fill="none"` on the root `<svg>`.
- No `width`/`height` on the root svg — it scales to its container.
- **It renders ~828px wide** inside the figure frame, and ~360px on mobile. Design for that.
- Keep 56px clear inside all four edges. At least 55% of the canvas stays empty.

## Shapes — identical across the whole series
- **model** — `<rect rx="16">` 200×120, `stroke="currentColor" stroke-width="2"`. Label centred inside.
- **text** — 3 stacked bars, height 6, rx 3, widths ~92/66/78, `fill="var(--muted-foreground)"` opacity .5. Never real words.
- **window / tray** — `<rect rx="10">` ~150×260, contents = stacked horizontal bars.
- **tool** — `<rect rx="8">` 64×64 with a small bolt polyline.
- **memory** — cylinder: ellipse + rect + ellipse, ~120×80.
- **check** — diamond, 44px across.
- **loop** — circle/arc, `stroke-width="2"`, ONE arrowhead for direction.
- **boundary ("your code")** — `<rect rx="14">` `stroke-dasharray="5 5"` `stroke="var(--border)"`, label top-left.
- **arrow** — `stroke-width="1.5"`, straight or ONE right-angle bend, open head (~8px, 28°).
  Define `<marker>` once per colour and reuse. Arrows must touch shape edges exactly.

## Type
- Labels `font-size="15"`; edge labels `font-size="13"` in `var(--muted-foreground)`.
- **No `font-family` attribute** — inherit Instrument Sans from the page.
- Lowercase, one or two words. **Ten words maximum in the whole figure.** Count them.
- Never a sentence inside a shape. Captions live outside the SVG.

## Structure
- Wrap every logical part in `<g id="...">` so the site can stagger a reveal.
- No `<style>`, classes, script, animation, gradient, filter, shadow, or `<foreignObject>`.

## The bar it must clear
1. **Half-size test** — unmistakable at 414px wide.
2. **One accent** — a stranger can point to the single filled shape and say what the figure is about.
3. **Not UI** — cards, chips, rows, dashboards, toolbars, tables = automatic fail.
4. **Nothing overlaps or touches** that shouldn't. Verify in the render, not in your head.
5. **Aligned** — shared centrelines; arrows meet edges exactly; the whole composition optically centred.
