import { isNonEmptyArray } from "./is-non-empty-array";

/**
 * Determine the length of the given array. Returns 0 if the input is not an
 * array.
 *
 * arrayLength(['A', 'B', 'C', 'D']); // 4
 * arrayLength([]); // 0
 * arrayLength(undefined); // 0
 *
 * @param  {array}  array
 *     The array to get the length of
 */
export function arrayLength(array) {
	if (!isNonEmptyArray(array)) {
		return 0;
	}

	return array.length;
}
