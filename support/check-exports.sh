#!/usr/bin/env bash
# Check helper exports
#
# Verify that every public helper implementation file is exported from its
# category barrel. Exits 1 if any are missing.
#
# Usage:
#   ./support/check-exports.sh

set -euo pipefail
shopt -s nullglob

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/colours.sh"

REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

INTERNAL_HELPERS=(
	"lib/object/path-traversal.js"
)

# Returns 0 when the helper file is intentionally internal.
#
# @param  {string}  helper_path
#     The repo-relative helper path to check.
is_internal_helper() {
	local helper_path="$1"
	local internal_helper

	for internal_helper in "${INTERNAL_HELPERS[@]}"; do
		if [[ "$helper_path" == "$internal_helper" ]]; then
			return 0
		fi
	done

	return 1
}

# Returns 0 when the helper file is exported from its category barrel.
#
# @param  {string}  helper_path
#     The repo-relative helper path to check.
# @param  {string[]}  ...
#     Exported helper paths passed as remaining arguments.
is_exported_helper() {
	local helper_path="$1"
	shift
	local exported_helper

	for exported_helper in "$@"; do
		if [[ "$helper_path" == "$exported_helper" ]]; then
			return 0
		fi
	done

	return 1
}

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
	exported_helpers=()

	while IFS= read -r source_file; do
		[[ -z "$source_file" ]] && continue
		exported_helpers+=("lib/$category/$source_file")
	done < <(grep -oE 'from "\./[^"]+\.js"' "$barrel" \
		| grep -oE '[^"/]+\.js"' \
		| tr -d '"')

	for helper_file in "$REPO_ROOT/lib/$category"/*.js; do
		helper_name="$(basename "$helper_file")"
		helper_path="lib/$category/$helper_name"

		if [[ "$helper_name" == "$category.js" ]]; then
			continue
		fi

		if [[ "$helper_name" == *.test.js ]]; then
			continue
		fi

		if is_internal_helper "$helper_path"; then
			continue
		fi

		if ! is_exported_helper "$helper_path" "${exported_helpers[@]}"; then
			if [[ $missing -eq 0 ]]; then
				printf '\n%sHelper export check failed%s\n' "$PURPLE" "$RESET_COLOUR"
			fi

			printf '\n  %s%s%s is not exported from lib/%s/%s.js\n' \
				"$BLUE" "$helper_path" "$RESET_COLOUR" \
				"$category" "$category"

			missing=1
		fi
	done
done

if [[ $missing -ne 0 ]]; then
	printf '\nExport each public helper from its category barrel, or add intentional internals to INTERNAL_HELPERS.\n\n'
	exit 1
fi

printf '%sAll public helpers are exported.%s\n' "$PURPLE" "$RESET_COLOUR"
