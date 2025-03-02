import { isNonEmptyArray } from "./is-non-empty-array";
import { isNumber } from "@number";

/**
 * Split an array into chunks of a specified size.
 *
 * @param  {array}  array
 *     The array to chunk.
 * @param  {number}  chunkSize
 *     The size of the chunks to create.
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
