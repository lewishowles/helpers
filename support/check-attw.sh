#!/usr/bin/env bash
# Check package types with Are The Types Wrong.
#
# ATTW's --pack mode shells out to npm pack, which can run prepare scripts.
# This repo already builds before ATTW in release checks, so pack with Bun and
# ignore lifecycle scripts to keep the check read-only.
#
# Usage:
#   ./support/check-attw.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/output.sh"

REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PACK_DIR="$(mktemp -d "${TMPDIR:-/tmp}/helpers-attw.XXXXXX")"
ATTW_BIN="$REPO_ROOT/node_modules/.bin/attw"

# Remove the temporary package tarball directory created for ATTW.
cleanup() {
	if command -v trash &>/dev/null; then
		trash "$PACK_DIR" >/dev/null 2>&1 || rm -rf "$PACK_DIR"
	else
		rm -rf "$PACK_DIR"
	fi
}

trap cleanup EXIT

cd "$REPO_ROOT"

if [[ ! -x "$ATTW_BIN" ]]; then
	printf '\n'
	cli_style_status failed "Are The Types Wrong check failed"
	cli_style_hint "attw binary not found. Run bun install to restore devDependencies."
	printf '\n'
	exit 1
fi

bun pm pack --ignore-scripts --destination "$PACK_DIR" --quiet >/dev/null
PACK_FILE="$(find "$PACK_DIR" -name "*.tgz" -print -quit)"

if [[ -z "$PACK_FILE" ]]; then
	printf '\n'
	cli_style_status failed "Are The Types Wrong check failed"
	cli_style_hint "Package tarball was not created."
	printf '\n'
	exit 1
fi

printf '\n'
cli_style_divider "Are The Types Wrong"

if ! "$ATTW_BIN" "$PACK_FILE" --profile esm-only; then
	printf '\n'
	cli_style_status failed "Are The Types Wrong check failed"
	cli_style_hint "Fix the type export issues reported above before releasing."
	printf '\n'
	exit 1
fi

printf '\n'
cli_style_status success "Package types are correct."
printf '\n'
