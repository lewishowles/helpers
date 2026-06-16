import { isNonEmptyArray } from "./is-non-empty-array";

/**
 * @helper compact
 * @category Array
 * @signature compact(array: any[])
 * @description
 * Remove falsy values from the given array.
 *
 * @example
 * compact([0, 1, false, 2, "", 3]); // [1, 2, 3]
 * compact([true, true, true]); // [true, true, true]
 */
export function compact(array) {
	if (!isNonEmptyArray(array)) {
		return [];
	}

	return array.filter(Boolean);
}
