import { isNonEmptyArray } from "@array";

/**
 * Retrieve the first defined item of the given array. Any undefined entries at
 * the start of the array are ignored.
 *
 * @param  {array}  array
 *     The array from which to retrieve the first defined item.
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
