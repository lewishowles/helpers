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
source "$SCRIPT_DIR/colours.sh"

REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Get a list of all helper categories from the `lib` folder.
mapfile -t CATEGORIES < <(
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
				printf '\n%sTest coverage check failed%s\n' "$PURPLE" "$RESET_COLOUR"
			fi

			printf '\n  %s%s%s has no test file\n' \
				"$BLUE" "lib/$category/$source_file" "$RESET_COLOUR"

			missing=1
		fi
	done < <(grep -oE 'from "\./[^"]+\.js"' "$barrel" \
		| grep -oE '[^"/]+\.js"' \
		| tr -d '"')
done

if [[ $missing -ne 0 ]]; then
	printf '\nAdd a test file for each helper before pushing.\n\n'
	exit 1
fi

printf '%sAll helpers have tests.%s\n' "$PURPLE" "$RESET_COLOUR"
