import { isNonEmptyArray } from "./is-non-empty-array";

/**
 * Keep the first occurrence of each array value.
 *
 * @helper unique
 * @category Array
 * @signature unique(array: any[])
 * @description
 *     Safely reduce the provided `array` to those entries which are unique.
 *
 * @param  {any[]}  array
 *     The array to reduce to unique entries.
 * @returns  {any[]}
 *     A new array of unique values.
 *
 * @example
 * unique([1, 2, 2, 3, 4, 4, 5]); // [1, 2, 3, 4, 5]
 * unique(["a", "b", "a", "c"]); // ["a", "b", "c"]
 * unique([]); // []
 */
export function unique(array) {
	if (!isNonEmptyArray(array)) {
		return [];
	}

	return [...new Set(array)];
}
