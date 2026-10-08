import { isNonEmptyArray } from "./is-non-empty-array";

/**
 * Keep only the truthy items in an array.
 *
 * @helper compact
 * @category Array
 * @signature compact(array: any[])
 * @description
 * Remove falsy values from the given array, including `0`, `false`, `""`,
 * `null`, `undefined`, and `NaN`. Use `array.filter(isDefined)` to remove only
 * `null` and `undefined`.
 *
 * @param  {any[]}  array
 *     The array to remove falsy values from.
 * @returns  {any[]}
 *     A new array containing the truthy items.
 *
 * @example
 * compact([0, 1, false, 2, "", 3]); // [1, 2, 3]
 * compact([true, true, true]); // [true, true, true]
 * const values = [0, false, "", null, undefined, NaN, "a"];
 * compact(values); // ["a"]
 * values.filter(isDefined); // [0, false, "", NaN, "a"]
 */
export function compact(array) {
	if (!isNonEmptyArray(array)) {
		return [];
	}

	return array.filter(Boolean);
}
