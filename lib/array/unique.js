import { isNonEmptyArray } from "./is-non-empty-array";

/**
 * @helper unique
 * @category Array
 * @signature unique(array: any[])
 * @description
 * Safely reduce the provided `array` to those entries which are unique.
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
