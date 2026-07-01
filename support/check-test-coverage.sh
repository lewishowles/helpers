#!/usr/bin/env bash
# Check test coverage
#
# Verify that every helper exported from a category barrel has a colocated test
# file. Exits 1 if any are missing.
#
# Usage:
#   ./support/check-test-coverage.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/output.sh"

REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Get a list of all helper categories from the `lib` folder.
CATEGORIES=()

while IFS= read -r category; do
	[[ -z "$category" ]] && continue
	CATEGORIES+=("$category")
done < <(
	for dir in "$REPO_ROOT/lib"/*/; do
		category="$(basename "$dir")"
		[[ -f "${dir}${category}.js" ]] && printf '%s\n' "$category"
	done
)

missing=0

for category in "${CATEGORIES[@]}"; do
	barrel="$REPO_ROOT/lib/$category/$category.js"

	if [[ ! -f "$barrel" ]]; then
		continue
	fi

	# Extract source file paths from barrel re-exports.
	while IFS= read -r source_file; do
		[[ -z "$source_file" ]] && continue

		helper_path="$REPO_ROOT/lib/$category/$source_file"
		test_path="${helper_path%.js}.test.js"

		if [[ ! -f "$test_path" ]]; then
			if [[ $missing -eq 0 ]]; then
				output_failure "Test coverage check failed"
			fi

			output_item "lib/$category/$source_file" "has no test file"

			missing=1
		fi
	done < <(grep -oE 'from "\./[^"]+\.js"' "$barrel" \
		| grep -oE '[^"/]+\.js"' \
		| tr -d '"')
done

if [[ $missing -ne 0 ]]; then
	output_hint "Add a test file for each helper before pushing."
	exit 1
fi

output_success "All helpers have tests."
