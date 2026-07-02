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

printf '\n'

if ! output="$(node "$REPO_ROOT/support/generate-readme.js" --check 2>&1)"; then
	cli_style_status failed "Generated README check failed"
	command="$(cli_style_span "npm run docs:readme" info)"
	cli_style_hint "Run $command before release"

	# generate-readme.js only prints on unexpected failures (e.g. a crash);
	# the plain README mismatch case has no extra output to surface here.
	if [[ -n "$output" ]]; then
		printf '\n%s\n' "$output"
	fi

	printf '\n'
	exit 1
fi

cli_style_status success "README helper reference is current."

printf '\n'
