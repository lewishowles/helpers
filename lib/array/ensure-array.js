/**
 * Ensure that the given variable is an array, returning any non-array value as
 * a single-item array.
 *
 * @param  {any}  maybeArray
 *     The element to ensure.
 *
 * @returns  {array}
 */
export function ensureArray(maybeArray) {
	if (Array.isArray(maybeArray)) {
		return maybeArray;
	}

	return [maybeArray];
}
