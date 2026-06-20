#!/usr/bin/env bash
# Check built package size budgets.
#
# The package publishes only dist/ and types/. Run the build before this check
# so the budgets measure the same files that consumers install.
#
# Usage:
#   ./support/check-package-size.sh

set -euo pipefail
shopt -s nullglob

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/colours.sh"

REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DIST_DIR="$REPO_ROOT/dist"
TYPES_DIR="$REPO_ROOT/types"
MAX_JS_FILE_BYTES=$((12 * 1024))
MAX_DIST_BYTES=$((120 * 1024))
MAX_PACKAGE_BYTES=$((180 * 1024))

# Format a byte count as a human-readable kilobyte value.
#
# @param  {number}  bytes
#     The byte count to format.
format_bytes() {
	local bytes="$1"

	awk -v bytes="$bytes" 'BEGIN { printf "%.1f KB", bytes / 1024 }'
}

# Return the total size of every file in the provided paths.
#
# @param  {string[]}  ...
#     Files or directories to measure.
sum_file_bytes() {
	find "$@" -type f -exec wc -c {} + | awk '{ total += $1 } END { print total + 0 }'
}

# Print a size failure and mark the check as failed.
#
# @param  {string}  label
#     The file or group that exceeded its budget.
# @param  {number}  actual_bytes
#     The measured size.
# @param  {number}  max_bytes
#     The allowed size.
print_size_failure() {
	local label="$1"
	local actual_bytes="$2"
	local max_bytes="$3"

	printf '\n  %s%s%s is %s, above the %s budget\n' \
		"$BLUE" "$label" "$RESET_COLOUR" \
		"$(format_bytes "$actual_bytes")" \
		"$(format_bytes "$max_bytes")"
}

if [[ ! -d "$DIST_DIR" ]]; then
	printf '\n%sPackage size check failed%s\n' "$PURPLE" "$RESET_COLOUR"
	printf '\nBuild output is missing. Run %sbun run build%s before checking package size.\n\n' "$BLUE" "$RESET_COLOUR"
	exit 1
fi

built_js_files=("$DIST_DIR"/*.js "$DIST_DIR"/*.cjs)

if [[ ${#built_js_files[@]} -eq 0 ]]; then
	printf '\n%sPackage size check failed%s\n' "$PURPLE" "$RESET_COLOUR"
	printf '\nNo built JavaScript files found in %sdist%s.\n\n' "$BLUE" "$RESET_COLOUR"
	exit 1
fi

failed=0

printf '%sPackage size budgets%s\n' "$PURPLE" "$RESET_COLOUR"

for built_js_file in "${built_js_files[@]}"; do
	size="$(wc -c < "$built_js_file" | tr -d ' ')"
	label="dist/$(basename "$built_js_file")"

	printf '  %s%s%s %s\n' "$BLUE" "$label" "$RESET_COLOUR" "$(format_bytes "$size")"

	if (( size > MAX_JS_FILE_BYTES )); then
		print_size_failure "$label" "$size" "$MAX_JS_FILE_BYTES"
		failed=1
	fi
done

dist_size="$(sum_file_bytes "$DIST_DIR")"
package_size="$(sum_file_bytes "$DIST_DIR" "$TYPES_DIR")"

printf '\n  %sdist total%s %s\n' "$BLUE" "$RESET_COLOUR" "$(format_bytes "$dist_size")"
printf '  %spublished files total%s %s\n' "$BLUE" "$RESET_COLOUR" "$(format_bytes "$package_size")"

if (( dist_size > MAX_DIST_BYTES )); then
	print_size_failure "dist total" "$dist_size" "$MAX_DIST_BYTES"
	failed=1
fi

if (( package_size > MAX_PACKAGE_BYTES )); then
	print_size_failure "published files total" "$package_size" "$MAX_PACKAGE_BYTES"
	failed=1
fi

if [[ $failed -ne 0 ]]; then
	printf '\nReduce package size, or raise the budget with a release-note-worthy reason.\n\n'
	exit 1
fi

printf '\n%sPackage size is within budget.%s\n' "$PURPLE" "$RESET_COLOUR"
