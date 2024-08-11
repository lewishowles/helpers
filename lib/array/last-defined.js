import { isNonEmptyArray } from "./is-non-empty-array";

/**
 * Retrieve the ;ast defined item of the given array. Any undefined entries at
 * the end of the array are ignored.
 *
 * @param  {array}  array
 *     The array from which to retrieve the last defined item.
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
