/**
 * Wrap a value in an array unless it is already one.
 *
 * @helper ensureArray
 * @category Array
 * @signature ensureArray(maybeArray: any)
 * @description
 * Ensure that `maybeArray` is an array.
 *
 * @param  {any}  maybeArray
 *     The value to return as an array.
 * @returns  {any[]}
 *     The original array or a new array containing the value.
 *
 * @note
 * Arrays are returned unchanged. Any non-array value is returned as a
 * single-item array.
 *
 * Note that `null` and `undefined` are preserved as values, returning `[null]`
 * and `[undefined]`. Combine with `compact` when falsy values should be
 * removed.
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
