#!/usr/bin/env bash
# Run all support checks and render an aggregate diagnostic report.
#
# Each check script runs with its stdout suppressed. The runner records the
# exit code and any failure detail, then renders a single diagnostic report
# through cli-style's `diagnostic-report` pattern.
#
# Usage:
#   ./support/run-all-checks.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/output.sh"

REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Checks to run, in display order. Each entry is "name|description|script".
CHECKS=(
	"README|Generated README|support/check-readme.sh"
	"Exports|Helper exports|support/check-exports.sh"
	"Runtime deps|Runtime dependencies|support/check-runtime-deps.sh"
	"Package size|Package size budgets|support/check-package-size.sh"
	"Test coverage|Test coverage|support/check-test-coverage.sh"
	"Type declarations|Type declarations|support/check-type-declarations.sh"
	"ATTW|Are the types wrong|support/check-attw.sh"
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
# @param  {string}  script
#     Repo-relative path to the check script.
run_check() {
	local name="$1"
	local description="$2"
	local script="$3"
	local output
	local exit_code

	output="$(bash "$REPO_ROOT/$script" 2>&1)" && exit_code=0 || exit_code=$?

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
	IFS='|' read -r name description script <<< "$check"
	run_check "$name" "$description" "$script"
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
