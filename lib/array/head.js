import { isNonEmptyArray } from "@array";

/**
 * Get the first element of an array.
 *
 * @param  {array}  array
 *     The array from which to retrieve the first item,
 */
export function head(array) {
	if (!isNonEmptyArray(array)) {
		return undefined;
	}

	return array[0];
}
