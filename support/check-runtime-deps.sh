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
source "$SCRIPT_DIR/output.sh"

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
	output_success "No runtime dependencies found."
	exit 0
fi

output_failure "Runtime dependency check failed"

for dep in "${DEPS[@]}"; do
	output_item "$dep" "is listed in dependencies"
done

output_hint "Move runtime dependencies to devDependencies, or document the exception."
exit 1
