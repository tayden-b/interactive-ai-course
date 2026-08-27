# Payments design (not built yet)

The seam is designed so the paid rail bolts on with no rework. Nothing in this document
is implemented except the two things marked BUILT.

## The boundary

- The public repo permanently contains the platform (the `course` CLI, tracing.py, the
  bridge, TUTOR.md, SETUP.md, checks for free modules) plus **Module 1 complete**.
  Module 3 stays public until the rail ships, then moves.
- Locked content (modules 2 to 8: BUILD.md, lessons, checks) lives in a private repo,
  `llm-textbook-content`, packaged as one tarball per module attached to GitHub
  releases. Never in this repo: everything here is public and therefore free.

## The flow

1. Polar.sh hosted checkout (one organization, one one-time product "LLM.TEXTBOOK,
   modules 2 to 8", Polar as merchant of record so tax is handled, with a License Key
   benefit).
2. Buyer gets a license key.
3. `./course unlock <key>` (stdlib only: urllib.request, tarfile, json) calls the
   unlock API for each entitled module, extracts into `modules/`, stores the key in
   `.course/license` (git-ignored) so `--refresh` can pull content updates later.
4. The unlock API is `site/app/api/unlock/route.ts`, the one runtime function in an
   otherwise static site. POST {key, module}: validate the key server-side against
   Polar's license validation endpoint, then stream the module tarball from the
   private repo's release using a server-side GITHUB_TOKEN. The client never sees the
   token; the public repo never contains paid bytes.

## Why no rework is needed later (BUILT)

- `cli.py` computes availability by scanning for `modules/mN/BUILD.md` on disk, so
  extracted modules light up in init, check, and status with zero code change.
- Each module is a self-contained directory (BUILD.md plus lessons/), so a tarball can
  drop straight in.

## Pricing direction (from RESEARCH.md R7, decided elsewhere)

One-time purchase, roughly $79 to $149, PPP, 30-day refund. Presell only once two or
three paid modules actually exist.
