#!/usr/bin/env bash
# Check generated README
#
# Verify that README.md matches the helper reference generated from structured
# JSDoc. Exits 1 if the README needs regenerating.
#
# Usage:
#   ./support/check-readme.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/colours.sh"

REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

if ! output="$(node "$REPO_ROOT/support/generate-readme.js" --check 2>&1)"; then
	printf '\n%sGenerated README check failed%s\n' "$PURPLE" "$RESET_COLOUR"
	printf '\n%s\n' "$output"
	printf '\nRun %snpm run docs:readme%s and commit the updated README.\n\n' "$BLUE" "$RESET_COLOUR"
	exit 1
fi

printf '%sREADME helper reference is current.%s\n' "$PURPLE" "$RESET_COLOUR"
