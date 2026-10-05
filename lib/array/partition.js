import { isFunction } from "#general/is-function";
import { isNonEmptyArray } from "./is-non-empty-array";

/**
 * Separate array items according to a predicate.
 *
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
 * @returns  {any[][]}
 *     A pair containing matching items, then non-matching items.
 *
 * @example
 * partition([1, 2, 3, 4, 5], (n) => n % 2 === 0); // [[2, 4], [1, 3, 5]]
 * partition([], () => true); // [[], []]
 */
export function partition(array, predicate) {
	if (!isNonEmptyArray(array) || !isFunction(predicate)) {
		return [[], []];
	}

	// Items the predicate accepts, in input order.
	const matching = [];
	// Items the predicate rejects, in input order.
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
