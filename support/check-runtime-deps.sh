#!/usr/bin/env bash
# Check runtime dependencies
#
# Verify that package.json has no entries in `dependencies`. This package
# should ship with zero runtime dependencies; any addition requires a deliberate
# decision. Exits 1 if any are found.
#
# Usage:
#   ./support/check-runtime-deps.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/colours.sh"

REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Extract runtime dependency names from package.json.
mapfile -t DEPS < <(
	python3 - "$REPO_ROOT/package.json" <<'EOF'
import json, sys
data = json.load(open(sys.argv[1]))
for dep in data.get("dependencies", {}).keys():
	print(dep)
EOF
)

if [[ ${#DEPS[@]} -eq 0 ]]; then
	printf '%sNo runtime dependencies found.%s\n' "$PURPLE" "$RESET_COLOUR"
	exit 0
fi

printf '\n%sRuntime dependency check failed%s\n' "$PURPLE" "$RESET_COLOUR"

for dep in "${DEPS[@]}"; do
	printf '\n  %s%s%s is listed in dependencies\n' "$BLUE" "$dep" "$RESET_COLOUR"
done

printf '\nMove runtime dependencies to devDependencies, or document the exception.\n\n'
exit 1
