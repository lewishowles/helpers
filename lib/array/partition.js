import { isNonEmptyArray } from "./is-non-empty-array";
import { isFunction } from "#general/is-function";

/**
 * @helper partition
 * @category Array
 * @signature partition(array: any[], predicate: function)
 * @description
 * Split an array into two arrays based on a predicate. Returns a tuple of
 * [matching[], nonMatching[]].
 *
 * @param  {any[]}  array
 *     The array to split.
 * @param  {function}  predicate
 *     The function used to decide which output array receives each item.
 *
 * @example
 * partition([1, 2, 3, 4, 5], (n) => n % 2 === 0); // [[2, 4], [1, 3, 5]]
 * partition([], () => true); // [[], []]
 */
export function partition(array, predicate) {
	if (!isNonEmptyArray(array) || !isFunction(predicate)) {
		return [[], []];
	}

	const matching = [];
	const nonMatching = [];

	for (let i = 0; i < array.length; i++) {
		if (predicate(array[i], i, array)) {
			matching.push(array[i]);
		} else {
			nonMatching.push(array[i]);
		}
	}

	return [matching, nonMatching];
}
