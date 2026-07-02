import { isNonEmptyArray } from "./is-non-empty-array";

/**
 * @helper firstDefined
 * @category Array
 * @signature firstDefined(array: any[])
 * @description
 * Returns the first non-undefined element in `array`.
 *
 * @param  {any[]}  array
 *     The array to search.
 *
 * @example
 * firstDefined(["a", "b"]); // "a"
 * firstDefined([undefined, undefined, "c", "d"]); // "c"
 * firstDefined([]); // undefined
 */
export function firstDefined(array) {
	if (!isNonEmptyArray(array)) {
		return undefined;
	}

	for (let i = 0; i < array.length; i++) {
		if (array[i] !== undefined) {
			return array[i];
		}
	}
}
