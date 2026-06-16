/**
 * @helper ensureArray
 * @category Array
 * @signature ensureArray(variable: any)
 * @description
 * Ensure that the given variable is an array.
 *
 * @note
 * Arrays are returned unchanged. Any non-array value is returned as a single-item array.
 *
 * Note that `null` and `undefined` are preserved as values, returning `[null]` and `[undefined]`. Combine with `compact` when falsy values should be removed.
 *
 * @example
 * ensureArray(["one", "two"]); // ["one", "two"]
 * ensureArray("one"); // ["one"]
 * ensureArray({ key: "value" }); // [{ key: "value" }]
 * ensureArray(null); // [null]
 * ensureArray(undefined); // [undefined]
 */
export function ensureArray(maybeArray) {
	if (Array.isArray(maybeArray)) {
		return maybeArray;
	}

	return [maybeArray];
}
