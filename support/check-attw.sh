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
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PACK_DIR="$(mktemp -d "${TMPDIR:-/tmp}/helpers-attw.XXXXXX")"

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

bun pm pack --ignore-scripts --destination "$PACK_DIR" --quiet >/dev/null
PACK_FILE="$(find "$PACK_DIR" -name "*.tgz" -print -quit)"

if [[ -z "$PACK_FILE" ]]; then
	printf 'Package tarball was not created.\n' >&2
	exit 1
fi

attw "$PACK_FILE" --profile esm-only
