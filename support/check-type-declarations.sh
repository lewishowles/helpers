#!/usr/bin/env bash
# Check type declarations
#
# Verify that every helper exported from a category barrel has a corresponding
# declaration in the matching types file. Exits 1 if any are missing.
#
# Usage:
#   ./support/check-type-declarations.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/output.sh"

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
	types_file="$REPO_ROOT/types/$category.d.ts"

	if [[ ! -f "$barrel" ]]; then
		continue
	fi

	if [[ ! -f "$types_file" ]]; then
		output_failure "Missing types file"
		output_item "types/$category.d.ts" "does not exist"
		missing=1
		continue
	fi

	# Extract all exported names from the barrel, handling multi-name braces.
	barrel_exports=$(grep 'export {' "$barrel" \
		| sed 's/.*{\([^}]*\)}.*/\1/' \
		| tr ',' '\n' \
		| tr -d ' \t' \
		| grep -v '^$' \
		| sort) || true

	# Extract all declared names from the types file.
	types_exports=$(grep '^export declare' "$types_file" \
		| grep -oE '(function|class|const) [a-zA-Z_][a-zA-Z0-9_]*' \
		| grep -oE '[a-zA-Z_][a-zA-Z0-9_]*$' \
		| sort) || true

	while IFS= read -r name; do
		[[ -z "$name" ]] && continue

		if ! echo "$types_exports" | grep -qx "$name"; then
			if [[ $missing -eq 0 ]]; then
				output_failure "Type declaration check failed"
			fi

			output_item "$name" "is exported from lib/$category/$category.js but has no declaration in types/$category.d.ts"

			missing=1
		fi
	done <<< "$barrel_exports"
done

if [[ $missing -ne 0 ]]; then
	output_hint "Add the missing declarations to the types file before committing."
	exit 1
fi

output_success "All helpers have type declarations."
