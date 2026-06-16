import { isNonEmptyArray } from "./is-non-empty-array";
import { isNumber } from "@number";

/**
 * @helper chunk
 * @category Array
 * @signature chunk(array: any[], chunkSize: number)
 * @description
 * Split an array into chunks of a specified size
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

	const chunks = [];

	for (let i = 0; i < array.length; i += chunkSize) {
		chunks.push(array.slice(i, i + chunkSize));
	}

	return chunks;
}
