import { isNonEmptyArray } from "./is-non-empty-array";

/**
 * Get the last element of an array.
 *
 * @param  {array}  array
 *     The array from which to retrieve the last item,
 */
export function tail(array) {
	if (!isNonEmptyArray(array)) {
		return undefined;
	}

	return array[array.length - 1];
}
