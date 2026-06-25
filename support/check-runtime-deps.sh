#!/usr/bin/env bash
# Check runtime dependencies
#
# Verify that package.json only has approved entries in `dependencies`. This
# package usually ships with zero runtime dependencies; any addition requires a
# deliberate decision and an allowlist entry here.
#
# Usage:
#   ./support/check-runtime-deps.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/output.sh"

REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

ALLOWED_DEPS=(
	"dayjs"
	"temporal-polyfill"
)

# Returns 0 when the dependency has been deliberately approved.
#
# @param  {string}  dependency
#     The dependency name to inspect.
is_allowed_dependency() {
	local dependency="$1"
	local allowed_dependency

	for allowed_dependency in "${ALLOWED_DEPS[@]}"; do
		if [[ "$dependency" == "$allowed_dependency" ]]; then
			return 0
		fi
	done

	return 1
}

# Extract runtime dependency names from package.json.
mapfile -t DEPS < <(
	python3 - "$REPO_ROOT/package.json" <<'EOF'
import json, sys
data = json.load(open(sys.argv[1]))
for dep in data.get("dependencies", {}).keys():
	print(dep)
EOF
)

unexpected=0

for dep in "${DEPS[@]}"; do
	if is_allowed_dependency "$dep"; then
		continue
	fi

	if [[ $unexpected -eq 0 ]]; then
		output_failure "Unexpected runtime dependency found"
	fi

	output_item "$dep" "is listed in dependencies but is not allowlisted"
	unexpected=1
done

if [[ $unexpected -eq 0 ]]; then
	output_success "Runtime dependencies are approved."
	exit 0
fi

output_hint "Move runtime dependencies to devDependencies, or document the exception in ALLOWED_DEPS."
exit 1
