import { isNumber } from "#number/is-number";
import { isNonEmptyArray } from "./is-non-empty-array";

/**
 * @helper chunk
 * @category Array
 * @signature chunk(array: any[], chunkSize: number)
 * @description
 *     Split an array into chunks of a specified size.
 *
 * @param  {any[]}  array
 *     The array to split into chunks.
 * @param  {number}  chunkSize
 *     The number of items to include in each chunk.
 * @returns  {any[][]}
 *     The array split into chunks, or the original array for a non-numeric
 *     size.
 *
 * @example
 * chunk([1, 2, 3], 2); // [[1, 2], [3]]
 * chunk([1, 2, 3], 1); // [[1], [2], [3]]
 * chunk([1, 2, 3], 5); // [[1, 2, 3]]
 */
export function chunk(array, chunkSize) {
	if (!isNonEmptyArray(array)) {
		return [];
	}

	if (!isNumber(chunkSize)) {
		return array;
	}

	// The chunks, in input order.
	const chunks = [];

	for (let i = 0; i < array.length; i += chunkSize) {
		chunks.push(array.slice(i, i + chunkSize));
	}

	return chunks;
}
