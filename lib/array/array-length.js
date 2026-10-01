import { isNonEmptyArray } from "./is-non-empty-array";

/**
 * Count the items in an array, treating other values as empty.
 *
 * @helper arrayLength
 * @category Array
 * @signature arrayLength(array: any[])
 * @description
 *     Determine the number of items in the given `array`.
 *
 * @param  {any[]}  array
 *     The array to measure.
 * @returns  {number}
 *     The number of items, or zero for non-arrays.
 *
 * @note
 *     If the provided input is not an array, returns `0`.
 *
 * @example
 * arrayLength(["A", "B", "C", "D"]); // 4
 * arrayLength([]); // 0
 * arrayLength(undefined); // 0
 */
export function arrayLength(array) {
	if (!isNonEmptyArray(array)) {
		return 0;
	}

	return array.length;
}
