#!/usr/bin/env bash
# sheet.sh [out.png] — renders every figure into one contact sheet, in the site's real frame.
set -e
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT="${1:-$HERE/png/sheet.png}"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
TMP="$(mktemp -t sheet).html"
{
cat <<'EOF'
<html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500&family=Instrument+Serif&family=JetBrains+Mono&display=swap" rel="stylesheet">
<style>
:root{--background:oklch(0.985 0.002 90);--foreground:oklch(0.12 0.01 60);
--muted-foreground:oklch(0.45 0.02 60);--border:oklch(0.88 0.01 90);--secondary:oklch(0.96 0.005 90);}
html,body{margin:0;background:var(--background);color:var(--foreground);
font-family:'Instrument Sans',system-ui,sans-serif;}
.wrap{width:860px;margin:0 auto;padding:48px 0;}
figure{--fig-bg:color-mix(in oklab,var(--secondary) 30%,var(--background));margin:0 0 40px;border:1px solid var(--border);
background:color-mix(in oklch,var(--secondary) 30%,var(--background));padding:16px;}
svg{--fig-bg:color-mix(in oklab,var(--secondary) 30%,var(--background));display:block;width:100%;height:auto;}
figcaption{margin-top:12px;font-family:'JetBrains Mono',monospace;font-size:10px;
text-transform:uppercase;letter-spacing:.16em;color:var(--muted-foreground);}
</style></head><body><div class="wrap">
EOF
for f in "$HERE"/svg/fig-*.svg; do
  [ -e "$f" ] || continue
  n=$(basename "$f" .svg)
  echo "<figure>"; cat "$f"; echo "<figcaption>$n</figcaption></figure>"
done
echo '</div></body></html>'
} > "$TMP"
"$CHROME" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --virtual-time-budget=5000 --screenshot="$OUT" --window-size=900,2600 "file://$TMP" >/dev/null 2>&1 || true
echo "sheet -> $OUT"
