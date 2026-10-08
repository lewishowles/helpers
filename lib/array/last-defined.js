import { isNonEmptyArray } from "./is-non-empty-array";

/**
 * Find the last array item that is not undefined.
 *
 * @helper lastDefined
 * @category Array
 * @signature lastDefined(array: any[])
 * @description
 * Returns the last element in `array` that is not `undefined`. A `null` item
 * counts as a value, so it is returned when no other value comes after it. Use
 * `array.findLast(isDefined)` to skip `null` as well.
 *
 * @param  {any[]}  array
 *     The array to search.
 * @returns  {any}
 *     The last defined item, or undefined when none exists.
 *
 * @example
 * lastDefined(["a", "b"]); // "b"
 * lastDefined(["a", "b", undefined, undefined]); // "b"
 * lastDefined([1, null, undefined]); // null
 * lastDefined([]); // undefined
 */
export function lastDefined(array) {
	if (!isNonEmptyArray(array)) {
		return undefined;
	}

	for (let i = array.length - 1; i >= 0; i--) {
		if (array[i] !== undefined) {
			return array[i];
		}
	}
}
