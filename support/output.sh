#!/usr/bin/env bash
# Shared support-script output helpers.
#
# These helpers keep diagnostics readable without adding anything to the
# runtime package. Set NO_COLOR to any value to disable ANSI colours.

if [[ -n "${NO_COLOR:-}" ]]; then
	SUPPORT_HEADING=""
	SUPPORT_VALUE=""
	SUPPORT_RESET=""
else
	SUPPORT_HEADING=$'\033[1;35m'
	SUPPORT_VALUE=$'\033[1;34m'
	SUPPORT_RESET=$'\033[0m'
fi

# Print a highlighted heading.
#
# @param  {string}  message
#     The heading text.
output_heading() {
	local message="$1"

	printf '%s%s%s\n' "$SUPPORT_HEADING" "$message" "$SUPPORT_RESET"
}

# Print a highlighted success message.
#
# @param  {string}  message
#     The success text.
output_success() {
	local message="$1"

	output_heading "$message"
}

# Print a highlighted failure heading with surrounding whitespace.
#
# @param  {string}  message
#     The failure heading text.
output_failure() {
	local message="$1"

	printf '\n'
	output_heading "$message"
}

# Print an indented detail item with a highlighted label.
#
# @param  {string}  label
#     The item label.
# @param  {string}  detail
#     The detail text after the label.
output_item() {
	local label="$1"
	local detail="$2"

	printf '\n  %s%s%s %s\n' "$SUPPORT_VALUE" "$label" "$SUPPORT_RESET" "$detail"
}

# Print an indented key/value row with a highlighted key.
#
# @param  {string}  label
#     The row label.
# @param  {string}  value
#     The row value.
output_row() {
	local label="$1"
	local value="$2"

	printf '  %s%s%s %s\n' "$SUPPORT_VALUE" "$label" "$SUPPORT_RESET" "$value"
}

# Print a plain follow-up instruction with surrounding whitespace.
#
# @param  {string}  message
#     The instruction text.
output_hint() {
	local message="$1"

	printf '\n%s\n\n' "$message"
}

# Highlight an inline value for use inside another message.
#
# @param  {string}  value
#     The value to highlight.
output_value() {
	local value="$1"

	printf '%s%s%s' "$SUPPORT_VALUE" "$value" "$SUPPORT_RESET"
}
