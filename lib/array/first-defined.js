import { isNonEmptyArray } from "./is-non-empty-array";

/**
 * Find the first array item that is not undefined.
 *
 * @helper firstDefined
 * @category Array
 * @signature firstDefined(array: any[])
 * @description
 * Returns the first element in `array` that is not `undefined`. A `null` item
 * counts as a value, so it is returned when no other value comes before it. Use
 * `array.find(isDefined)` to skip `null` as well.
 *
 * @param  {any[]}  array
 *     The array to search.
 * @returns  {any}
 *     The first defined item, or undefined when none exists.
 *
 * @example
 * firstDefined(["a", "b"]); // "a"
 * firstDefined([undefined, undefined, "c", "d"]); // "c"
 * firstDefined([undefined, null, 1]); // null
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
