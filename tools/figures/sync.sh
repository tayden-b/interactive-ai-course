#!/usr/bin/env bash
# sync.sh — the v0 <-> repo bridge.
#
#   sync.sh status              chat, latest version, and remaining message budget
#   sync.sh pull                download the current v0 version into site/   (no message cost)
#   sync.sh diff                show what differs between v0's project and site/
#   sync.sh prompt "text"       send a real generation message to v0         (COSTS 1 of 7/day)
#
# DIRECTION OF TRUTH — verified 2026-08-22:
#   v0 -> repo   works (download endpoint, exact).
#   repo -> v0   DOES NOT WORK. PATCH /versions/{id} records file entries on the version object
#                but the exported/built project is unaffected, so code written that way never
#                reaches the preview or a deployment. Do not rely on it.
#   Therefore this repo is the source of truth and deploys go from here (Vercel/GitHub).
#   v0 is a design sandbox: prompt it for layout/UI ideas, then `pull` and keep what is good.
#   `pull` OVERWRITES site/ — commit your work first, then reconcile in git.
#
set -euo pipefail

CHAT_ID="015C3OVvAZg"
API="https://api.v0.dev/v1"
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
: "${V0_API_KEY:?V0_API_KEY is not set — add it to ~/.zshrc}"
AUTH=(-H "Authorization: Bearer $V0_API_KEY")

latest_version() {
  curl -sf "${AUTH[@]}" "$API/chats/$CHAT_ID" | python3 -c 'import sys,json;print(json.load(sys.stdin)["latestVersion"]["id"])'
}

case "${1:-status}" in

status)
  curl -sf "${AUTH[@]}" "$API/chats/$CHAT_ID" | python3 -c '
import sys,json; c=json.load(sys.stdin)
print("chat    ", c["name"])
print("web     ", c["webUrl"])
print("version ", c["latestVersion"]["id"], c["latestVersion"]["status"])
print("updated ", c["updatedAt"])'
  curl -sf "${AUTH[@]}" "$API/rate-limits" | python3 -c '
import sys,json,datetime; r=json.load(sys.stdin); d=r.get("dailyLimit") or {}
print("messages", f'"'"'{d.get("remaining","?")}/{d.get("limit","?")} left today'"'"')
print("resets  ", datetime.datetime.fromtimestamp(d["reset"]/1000).strftime("%Y-%m-%d %H:%M") if d.get("reset") else "?")'
  ;;

pull)
  V="$(latest_version)"
  TMP="$(mktemp -d)"
  echo "pulling version $V ..."
  curl -sf -L "${AUTH[@]}" "$API/chats/$CHAT_ID/versions/$V/download?includeDefaultFiles=true" -o "$TMP/p.zip"
  ( cd "$TMP" && unzip -q p.zip -d proj )
  rsync -a --delete --exclude node_modules --exclude .next "$TMP/proj/" "$REPO/site/"
  rm -rf "$TMP"
  echo "site/ now matches v0 version $V"
  ;;

diff)
  V="$(latest_version)"
  TMP="$(mktemp -d)"
  curl -sf -L "${AUTH[@]}" "$API/chats/$CHAT_ID/versions/$V/download?includeDefaultFiles=true" -o "$TMP/p.zip"
  ( cd "$TMP" && unzip -q p.zip -d proj )
  echo "v0 version $V  vs  site/"
  diff -rq --exclude node_modules --exclude .next "$TMP/proj" "$REPO/site" || true
  rm -rf "$TMP"
  ;;

prompt)
  shift
  [ $# -gt 0 ] || { echo "usage: sync.sh prompt \"text\"" >&2; exit 1; }
  read -r -p "This spends 1 of your 7 daily v0 messages. Continue? [y/N] " a
  [ "$a" = "y" ] || { echo "aborted"; exit 1; }
  python3 -c 'import json,sys;json.dump({"message":sys.argv[1]},sys.stdout)' "$*" \
    | curl -sf -X POST "${AUTH[@]}" -H "Content-Type: application/json" -d @- \
        "$API/chats/$CHAT_ID/messages" \
    | python3 -c 'import sys,json;m=json.load(sys.stdin);print("sent:",m.get("id"))'
  ;;

*) sed -n '2,12p' "$0"; exit 1 ;;
esac
