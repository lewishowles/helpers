import { isNonEmptyArray } from "./is-non-empty-array";

/**
 * Remove falsy values from the given array.
 *
 * @param  {array}  array
 *     The array to compact.
 */
export function compact(array) {
	if (!isNonEmptyArray(array)) {
		return [];
	}

	return array.filter(Boolean);
}
