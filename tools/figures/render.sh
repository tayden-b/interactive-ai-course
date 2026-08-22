#!/bin/bash
# render.sh <file.svg> <out.png> [contentWidth] [pageHeight]
# Renders an SVG inside a faithful replica of the site's <Figure> frame:
# light warm paper, Instrument Sans/Serif + JetBrains Mono, bg-secondary/30, border, mono caption.
# Default content width 828px = the real reading column (860) minus the frame's p-4.
set -e
SRC="$1"; OUT="$2"; W="${3:-828}"; H="${4:-560}"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PAGE=$((W + 120))
TMP="$(mktemp -t figwrap).html"
cat > "$TMP" <<EOF
<html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500&family=Instrument+Serif&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
<style>
:root{
  --background:oklch(0.985 0.002 90);
  --foreground:oklch(0.12 0.01 60);
  --muted-foreground:oklch(0.45 0.02 60);
  --border:oklch(0.88 0.01 90);
  --secondary:oklch(0.96 0.005 90);
  --primary:oklch(0.12 0.01 60);--figure-accent:oklch(0.57 0.23 259);--figure-accent-ink:oklch(0.46 0.21 259);--figure-accent-soft:oklch(0.57 0.23 259 / 0.09);
}
html,body{margin:0;padding:0;background:var(--background);color:var(--foreground);
  font-family:'Instrument Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased;}
.page{padding:60px;}
figure{--fig-bg:color-mix(in oklab,var(--secondary) 30%,var(--background));margin:0;border:1px solid var(--border);
  background:color-mix(in oklch, var(--secondary) 30%, var(--background));padding:16px;}
figure > .box{min-height:208px;overflow:hidden;}
svg{--fig-bg:color-mix(in oklab,var(--secondary) 30%,var(--background));display:block;width:100%;height:auto;}
figcaption{margin-top:12px;font-family:'JetBrains Mono',monospace;font-size:10px;
  text-transform:uppercase;letter-spacing:.16em;color:var(--muted-foreground);}
</style></head><body><div class="page"><figure><div class="box">
$(cat "$SRC")
</div><figcaption>FIGURE — CAPTION SITS HERE, MONO, UPPERCASE</figcaption></figure></div></body></html>
EOF
"$CHROME" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
  --virtual-time-budget=4000 --screenshot="$OUT" --window-size=$PAGE,$H "file://$TMP" >/dev/null 2>&1 || true
[ -f "$OUT" ] && echo "rendered $OUT  (content ${W}px)" || { echo "RENDER FAILED"; exit 1; }
