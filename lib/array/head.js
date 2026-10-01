import { isNonEmptyArray } from "./is-non-empty-array";

/**
 * Read the first item in a non-empty array.
 *
 * @helper head
 * @category Array
 * @signature head(array: any[])
 * @description
 *     Returns the first element in `array`.
 *
 * @param  {any[]}  array
 *     The array to read from.
 * @returns  {any}
 *     The first item, or undefined when the array is empty or invalid.
 *
 * @example
 * head(["a", "b"]); // "a"
 * head([]); // undefined
 */
export function head(array) {
	if (!isNonEmptyArray(array)) {
		return undefined;
	}

	return array[0];
}
