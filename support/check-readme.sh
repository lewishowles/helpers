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
source "$SCRIPT_DIR/output.sh"

REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

if ! output="$(node "$REPO_ROOT/support/generate-readme.js" --check 2>&1)"; then
	output_failure "Generated README check failed"
	printf '\n%s\n' "$output"
	output_hint "Run $(output_value "npm run docs:readme") and commit the updated README."
	exit 1
fi

output_success "README helper reference is current."
