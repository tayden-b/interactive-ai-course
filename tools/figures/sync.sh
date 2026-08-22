#!/usr/bin/env bash
# sync.sh — the v0 <-> repo bridge.
#
#   sync.sh status              show chat, latest version, plan and remaining message budget
#   sync.sh pull                download the current v0 version into site/  (no message cost)
#   sync.sh push <file>...      write files into the v0 version, locked    (no message cost)
#   sync.sh prompt "text"       send an actual generation message          (COSTS 1 of 7/day)
#
# Paths for push are repo-relative, e.g. site/components/figures/course-figures.tsx
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

push)
  shift
  [ $# -gt 0 ] || { echo "usage: sync.sh push <file>..." >&2; exit 1; }
  V="$(latest_version)"
  PAYLOAD="$(python3 - "$REPO" "$@" <<'PY'
import json,sys,os
repo=sys.argv[1]; files=[]
for p in sys.argv[2:]:
    ap = p if os.path.isabs(p) else os.path.join(repo,p)
    rel = os.path.relpath(ap, os.path.join(repo,"site"))
    if rel.startswith(".."):
        sys.exit(f"refusing: {p} is outside site/")
    files.append({"name": rel, "content": open(ap).read(), "locked": True})
    print(f"  {rel}  ({os.path.getsize(ap)} bytes)", file=sys.stderr)
json.dump({"files":files}, sys.stdout)
PY
)"
  echo "pushing to version $V ..."
  curl -sf -X PATCH "${AUTH[@]}" -H "Content-Type: application/json" \
    -d "$PAYLOAD" "$API/chats/$CHAT_ID/versions/$V" \
    | python3 -c 'import sys,json;v=json.load(sys.stdin);print("ok — version",v.get("id"),"now has",len(v.get("files",[])),"tracked files")'
  echo "files are locked: v0 generation will not overwrite them."
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
