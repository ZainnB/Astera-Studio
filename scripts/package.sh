#!/usr/bin/env bash
# Builds the submission zip: release/ZainBaig_FAST_2026.zip
#
#   ZainBaig_FAST_2026/
#     index.html   ← the whole mockup in one file; double-click to open
#     README.md
#     NOTE.md      ← the one-page design note
#     source/      ← the code (no node_modules, no working docs)
set -euo pipefail

NAME="ZainBaig_FAST_2026"
OUT="release/$NAME"

rm -rf release
mkdir -p "$OUT/source"

npm run build:single
cp dist-single/index.html "$OUT/index.html"
cp README.md NOTE.md "$OUT/"

# Every file git knows about (committed or not), minus ignored files and the
# working docs we don't submit.
git ls-files --cached --others --exclude-standard \
  | grep -v -E '^(PLAN|PROMPTS)\.md$' \
  | rsync -a --files-from=- . "$OUT/source/"

(cd release && zip -rq "$NAME.zip" "$NAME")
echo "Created release/$NAME.zip"
