import { isNonEmptyArray } from "./is-non-empty-array";

/**
 * @helper arrayLength
 * @category Array
 * @signature arrayLength(array: any[])
 * @description
 * Determine the number of items in the given `array`.
 *
 * @note
 * If the provided input is not an array, returns `0`.
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
