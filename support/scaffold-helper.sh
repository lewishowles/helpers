#!/usr/bin/env bash
# Scaffold helper
#
# Scaffold a new helper for the helper library, creating the implementation
# file, test file, and matching category barrel export.
#
# Usage:
#   ./support/scaffold-helper.sh <helper-name> --folder <folder-name>
#
# Parameters:
#   <helper-name>  (required)
#     The helper name in kebab-case.
#   --folder <folder-name>  (required)
#     The category folder where the helper will live, such as `array`.
#
# Example:
#   ./support/scaffold-helper.sh round --folder number
#
# Recommended alias:
#   scaffold:helper

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/colours.sh"

# Prints usage guidance for invalid input.
print_usage() {
	printf '\nUsage: %s./support/scaffold-helper.sh%s %s<helper-name>%s --folder <folder-name>\n' "$PURPLE" "$RESET_COLOUR" "$BLUE" "$RESET_COLOUR"
}

# Converts kebab-case text to camelCase.
#
# @param  {string}  value
#     The kebab-case value to convert.
to_camel_case() {
	local value="$1"

	awk -F- '{
		for (i = 1; i <= NF; i++) {
			$i = toupper(substr($i, 1, 1)) tolower(substr($i, 2))
		}
	}1' OFS='' <<< "$value" | awk '{ print tolower(substr($0, 1, 1)) substr($0, 2) }'
}

# Adds a helper export to the category barrel if it is not present.
#
# @param  {string}  barrel_file
#     The barrel file to update.
# @param  {string}  helper_name
#     The helper file name in kebab-case.
# @param  {string}  camel_case_name
#     The helper export name in camelCase.
update_barrel_export() {
	local barrel_file="$1"
	local helper_name="$2"
	local camel_case_name="$3"
	local export_line="export { ${camel_case_name} } from \"./${helper_name}.js\";"

	if [[ ! -f "$barrel_file" ]]; then
		printf 'Category barrel not found: %s\n' "$barrel_file" >&2
		exit 1
	fi

	if grep -Fxq "$export_line" "$barrel_file"; then
		return
	fi

	printf '%s\n' "$export_line" >> "$barrel_file"
	sort -o "$barrel_file" "$barrel_file"
}

if [[ "${1:-}" == "" ]]; then
	printf '\nPlease provide a %shelper-name%s for the helper.\n' "$BLUE" "$RESET_COLOUR"
	print_usage
	exit 1
fi

HELPER_NAME="$1"
CAMEL_CASE_NAME="$(to_camel_case "$HELPER_NAME")"
FOLDER_PATH=""

shift

while [[ "$#" -gt 0 ]]; do
	case "$1" in
		--folder)
			FOLDER_PATH="${2:-}"
			shift
			;;
		*)
			printf '\nUnknown parameter passed: %s\n' "$1" >&2
			print_usage
			exit 1
			;;
	esac

	shift
done

if [[ "$FOLDER_PATH" == "" ]]; then
	printf '\nPlease provide a %sfolder-name%s for the type of helper this is.\n' "$BLUE" "$RESET_COLOUR"
	print_usage
	exit 1
fi

BASE_PATH="lib/$FOLDER_PATH"
HELPER_FILE="$BASE_PATH/$HELPER_NAME.js"
TEST_FILE="$BASE_PATH/$HELPER_NAME.test.js"
BARREL_FILE="$BASE_PATH/$FOLDER_PATH.js"

if [[ ! -d "$BASE_PATH" ]]; then
	printf 'Helper category not found: %s\n' "$BASE_PATH" >&2
	exit 1
fi

if [[ -e "$HELPER_FILE" || -e "$TEST_FILE" ]]; then
	printf 'Helper already exists: %s\n' "$HELPER_NAME" >&2
	exit 1
fi

templates=(
	"helper.js"
	"helper.test.js"
)

output_files=(
	"$HELPER_FILE"
	"$TEST_FILE"
)

for i in "${!templates[@]}"; do
	template_file="$SCRIPT_DIR/templates/${templates[$i]}"
	output_file="${output_files[$i]}"

	sed "s/{{HELPER_NAME}}/$HELPER_NAME/g; s/{{CAMEL_CASE_NAME}}/$CAMEL_CASE_NAME/g" "$template_file" > "$output_file"

	if command -v code &>/dev/null; then
		code -r "$output_file"
	fi
done

update_barrel_export "$BARREL_FILE" "$HELPER_NAME" "$CAMEL_CASE_NAME"

printf '\nHelper %s%s%s scaffolded successfully in %s%s/%s%s.\n\n' "$PURPLE" "$HELPER_NAME" "$RESET_COLOUR" "$BLUE" "$BASE_PATH" "$HELPER_NAME" "$RESET_COLOUR"
printf '%s%s%s\n' "$PURPLE" "$HELPER_NAME" "$RESET_COLOUR"
printf '  ↳ %s.js\n' "$HELPER_NAME"
printf '  ↳ %s.test.js\n' "$HELPER_NAME"
printf '  ↳ %s.js export updated\n' "$FOLDER_PATH"
printf '\nRemember to add a changelog entry before release.\n'
