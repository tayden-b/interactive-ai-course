# Figure families
*Extends VISUAL-LANGUAGE.md, which still governs colour, type, canvas and the accent rule.
Read that first. Nothing here overrides it.*

The book has five families. **architecture** is the original series (fig-01 … fig-07) and owns the
model rect, the window tray, tool squares, the memory cylinder, the ring and the check diamond.
The four below exist because some claims are not topological, and forcing them into boxes and arrows
would destroy the claim. A family is a licence to use a different *arrangement*, never a licence to
use a different *vocabulary*: every mark below is already in the book.

## The shared mark
One shape carries almost everything: `<rect height="16" rx="3">`. It is the tray-contents bar in
fig-02 and fig-05. Stacked vertically it is content; laid horizontally it is a magnitude; placed on
a time axis it is a span. Keeping that one mark across families is what makes them look like one
hand rather than four chart libraries.

---

## quantity — when SIZE is the point
Horizontal bars sharing a left baseline, longest at top, drawn straight onto the ground.
- Bars: the shared mark. Same left x for every bar. Gap 12 between bars.
- Label at the left of each bar, `font-size="13"`, `var(--muted-foreground)`, `text-anchor="end"`.
- **At most one number in the whole figure**, on the top bar only.
- A tail: 5–7 hairline bars (`height="2"`, `var(--border)`) of decreasing length below the labelled
  ones, with a quiet edge label, to say "and thousands more". The tail is what makes the point.
- ACCENT: the top bar, filled solid, its label knocked out in `var(--fig-bg)`.
- **Never** an axis, gridlines, ticks, a frame around the bars, or a second number.

## state — when something CHANGES under pressure
Parallel horizontal rails, one per condition, read top to bottom.
- Rail: a `var(--border)` hairline the full working width, with small step ticks along it.
- On each rail, one bar (the shared mark) whose LENGTH is what survives. Length is the whole message.
- Left label = the condition. One right-edge label on the accented rail only.
- Rails are ordered so the surprising one is last and shortest — the eye falls down to it.
- ACCENT: the shortest/worst bar, filled solid. Everything else outline.
- **Never** a curve, an axis, a legend, or a number on more than one rail.

## sequence — when ORDER or GROWTH is the point
Two or three instances of the SAME object, left to right, showing one change between them.
- Reuse the tray exactly as fig-02 draws it: same width, same rx, same contents bars.
- Inherited bars keep identical x, width and y across instances, so the eye reads *the same lines
  again* rather than new content. Only the change moves.
- A thin muted arrow between instances. One short label on the arrow naming the transformation.
- ACCENT: the one bar that is new or transformed, filled solid.
- **Never** more than three instances, and never a model rect in the same figure — the tray is the
  subject. Two tray figures must differ in gesture (accumulate vs. fold vs. excurse) or one must go.

## trace — when a RUN is read back
Indented rows on one shared time axis. This family appears exactly once in the book.
- Row = a label at left (13px muted, indented by depth × 20) and one span (the shared mark) whose
  x-position is when it started and whose width is how long it took.
- Nesting is indentation. Concurrency is overlap in x. Those two readings are the entire point.
- One `var(--border)` hairline beneath all rows as the axis. No tick labels, no durations, no counts.
- ACCENT: the single longest span, filled solid — where the time actually went.
- **Never** a table, a header row, rules between rows, or right-aligned numeric columns. Those are UI.
