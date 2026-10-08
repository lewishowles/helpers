#!/usr/bin/env bash
# Check that the packed package imports from a plain Node consumer.
#
# Run the build first: this check packs whatever dist currently holds. Bun skips
# lifecycle scripts so packing does not change the package during this check.
# Test the published entries in temporary consumers with and without Vue.
#
# Usage:
#   ./support/check-packed-imports.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"  # Directory containing the support scripts.
source "$SCRIPT_DIR/output.sh"

REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"  # Source of the package and local dependencies.
WORK_DIR="$(mktemp -d "${TMPDIR:-/tmp}/helpers-packed-imports.XXXXXX")"  # Isolated consumers and tarball.

# Remove the temporary consumers and tarball after the check.
cleanup() {
	if command -v trash &>/dev/null; then
		trash "$WORK_DIR" >/dev/null 2>&1 || rm -rf "$WORK_DIR"
	else
		rm -rf "$WORK_DIR"
	fi
}

trap cleanup EXIT

cd "$REPO_ROOT"
bun pm pack --ignore-scripts --destination "$WORK_DIR" --quiet >/dev/null

PACK_FILE="$(find "$WORK_DIR" -maxdepth 1 -name '*.tgz' -print -quit)"  # Package tarball made by Bun.

if [[ -z "$PACK_FILE" ]]; then
	cli_style_status failed "Packed import check failed: Bun did not create a tarball."
	exit 1
fi

# Import every entry in the packed package's exports map and check that only
# the vue entry needs the optional Vue peer.
cat > "$WORK_DIR/check-imports.mjs" <<'NODE'
import { readFile } from "node:fs/promises";

// The packed package.json, so a newly exported entry is checked without editing this script.
const packageManifest = JSON.parse(await readFile(new URL("./node_modules/@lewishowles/helpers/package.json", import.meta.url), "utf8"));
// Every published subpath, such as "." or "./array".
const entries = Object.keys(packageManifest.exports);
// Whether this consumer has Vue installed.
const hasVue = process.argv[2] === "with-vue";

for (const entry of entries) {
	// The import a user would write for this entry.
	const specifier = `@lewishowles/helpers${entry === "." ? "" : entry.slice(1)}`;

	try {
		await import(specifier);
	} catch (error) {
		if (!hasVue && entry === "./vue" && error.code === "ERR_MODULE_NOT_FOUND" && error.message.includes("'vue'")) {
			continue;
		}

		console.error(`Cannot import ${specifier} ${hasVue ? "with" : "without"} Vue: ${error.message}`);
		process.exitCode = 1;
		break;
	}

	if (!hasVue && entry === "./vue") {
		console.error(`${specifier} loaded without Vue`);
		process.exitCode = 1;
		break;
	}
}
NODE

# Install the packed package into one consumer with Vue and one without it.
for scenario in with-vue without-vue; do  # Current consumer's optional Vue availability.
	CONSUMER_DIR="$WORK_DIR/$scenario"  # Package root for the current consumer.
	MODULES_DIR="$CONSUMER_DIR/node_modules"  # Dependencies visible to the packed package.
	PACKAGE_DIR="$MODULES_DIR/@lewishowles/helpers"  # Published package as installed by a consumer.

	mkdir -p "$PACKAGE_DIR"
	tar -xzf "$PACK_FILE" -C "$PACKAGE_DIR" --strip-components=1
	ln -s "$REPO_ROOT/node_modules/dayjs" "$MODULES_DIR/dayjs"
	ln -s "$REPO_ROOT/node_modules/temporal-polyfill" "$MODULES_DIR/temporal-polyfill"

	if [[ "$scenario" == with-vue ]]; then
		ln -s "$REPO_ROOT/node_modules/vue" "$MODULES_DIR/vue"
	fi

	cp "$WORK_DIR/check-imports.mjs" "$CONSUMER_DIR/check-imports.mjs"

	# Keep Node's error message in import_error and print it inside the failed
	# status, so check:all reports a status line that names the failing entry.
	if ! import_error="$(node "$CONSUMER_DIR/check-imports.mjs" "$scenario" 2>&1)"; then
		printf '\n'
		cli_style_status failed "Packed Node imports failed for $scenario: $import_error"
		cli_style_hint "Fix the import error, then rebuild and rerun this check."
		printf '\n'
		exit 1
	fi
done

printf '\n'
cli_style_status success "All packed entries import in Node with Vue, and every entry except vue imports without it."
printf '\n'
