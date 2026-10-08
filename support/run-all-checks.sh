#!/usr/bin/env bash
# Run all package and support checks, then render an aggregate diagnostic report.
#
# Each check runs with its stdout suppressed. The runner records the exit code
# and any failure detail, then renders a single diagnostic report through
# cli-style's `diagnostic-report` pattern.
#
# Usage:
#   ./support/run-all-checks.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/output.sh"

REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Checks to run, in display order. Each entry is "name|description|command".
CHECKS=(
	"README|Generated README|support/check-readme.sh"
	"Exports|Helper exports|check:exports"
	"Runtime deps|Runtime dependencies|check:runtime-deps"
	"Package size|Package size budgets|check:package-size"
	"Test coverage|Test coverage|check:test-coverage"
	"Type declarations|Type declarations|check:type-declarations"
	"Publint|Package publishing|publint"
	"ATTW|Are the types wrong|support/check-attw.sh"
	"Packed imports|Packed Node imports|check:packed-imports"
)

# Accumulate JSON fragments for the diagnostic report.
check_json=""
findings_json=""
has_failures=0

# Run a check, capture its exit code and any stderr, and accumulate JSON.
#
# @param  {string}  name
#     Short check name for the report.
# @param  {string}  description
#     Human-readable description for the report.
# @param  {string}  command
#     Package script name or repo-relative support-script path.
run_check() {
	local name="$1"
	local description="$2"
	local command="$3"
	local output
	local exit_code

	if [[ "$command" == support/* ]]; then
		output="$(bash "$REPO_ROOT/$command" 2>&1)" && exit_code=0 || exit_code=$?
	else
		output="$(bun run --silent "$command" 2>&1)" && exit_code=0 || exit_code=$?
	fi

	local result
	if [[ $exit_code -eq 0 ]]; then
		result="success"
	else
		result="failed"
		has_failures=1
	fi

	# Build the check object.
	local check_entry
	check_entry="{\"name\":$(cli_style_json_string "$description"),\"result\":\"$result\"}"
	if [[ -n "$check_json" ]]; then
		check_json+=","
	fi
	check_json+="$check_entry"

	# On failure, extract the first meaningful line as a finding.
	# Strip ANSI escape codes and the leading status symbol (e.g. "× ")
	# so the finding message is plain text without doubled result symbols.
	if [[ $exit_code -ne 0 ]]; then
		local first_line
		first_line="$(echo "$output" \
			| sed $'s/\x1b\[[0-9;]*m//g' \
			| sed 's/^[^ ]* //' \
			| grep -v '^$' \
			| head -1)"
		if [[ -z "$first_line" ]]; then
			first_line="$description check failed"
		fi
		local finding_entry
		finding_entry="{\"result\":\"failed\",\"message\":$(cli_style_json_string "$first_line")}"
		if [[ -n "$findings_json" ]]; then
			findings_json+=","
		fi
		findings_json+="$finding_entry"
	fi
}

for check in "${CHECKS[@]}"; do
	IFS='|' read -r name description command <<< "$check"
	run_check "$name" "$description" "$command"
done

# Build the nextActions array — empty on success, guidance on failure.
next_actions_json=""
if [[ $has_failures -ne 0 ]]; then
	next_actions_json='"Fix the failing checks above before committing."'
else
	next_actions_json=""
fi

# Assemble and render the diagnostic report.
report_json="{\"title\":\"Release checks\",\"checks\":[$check_json]"

if [[ -n "$findings_json" ]]; then
	report_json+=",\"findings\":[$findings_json]"
fi

if [[ -n "$next_actions_json" ]]; then
	report_json+=",\"nextActions\":[$next_actions_json]"
fi

report_json+="}"

printf '\n'
cli_style_render_json diagnostic-report "$report_json"
printf '\n'

if [[ $has_failures -ne 0 ]]; then
	exit 1
fi
