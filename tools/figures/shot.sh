#!/usr/bin/env bash
# shot.sh <route> <out.png> [width] [height]
# Screenshots a page of the RUNNING dev server (localhost:3077) with headless Chrome.
# The figure sits ~600px down on a section page, so the default height captures it.
set -e
ROUTE="$1"; OUT="$2"; W="${3:-1280}"; H="${4:-1500}"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --virtual-time-budget=6000 --screenshot="$OUT" --window-size=$W,$H "http://localhost:3077$ROUTE" >/dev/null 2>&1 || true
[ -f "$OUT" ] && echo "shot $ROUTE -> $OUT" || { echo "SHOT FAILED for $ROUTE"; exit 1; }
