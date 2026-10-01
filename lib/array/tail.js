import { isNonEmptyArray } from "./is-non-empty-array";

/**
 * Read the last item in a non-empty array.
 *
 * @helper tail
 * @category Array
 * @signature tail(array: any[])
 * @description
 *     Returns the last element in `array`.
 *
 * @param  {any[]}  array
 *     The array to read from.
 * @returns  {any}
 *     The last item, or undefined when the array is empty or invalid.
 *
 * @example
 * tail(["a", "b"]); // "b"
 * tail([]); // undefined
 */
export function tail(array) {
	if (!isNonEmptyArray(array)) {
		return undefined;
	}

	return array[array.length - 1];
}
