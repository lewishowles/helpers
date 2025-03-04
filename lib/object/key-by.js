import { isNonEmptyArray } from "@array";
import { isNonEmptyObject } from "./is-non-empty-object";
import { isNonEmptyString } from "@string";

/**
 * Convert the given `array` of objects into a single object, where each object
 * in the original array is placed under the value of its given `key`.
 *
 * Objects without the given `key` are discarded. If an object has the same
 * value `key` as a previous object, the previous object will be overwritten.
 *
 * @param  {array}  array
 *     The array to convert into an object
 * @param  {string}  key
 *     The key from which to retrieve values
 */
export function keyBy(array, key) {
	if (!isNonEmptyArray(array)) {
		return {};
	}

	if (!isNonEmptyString(key)) {
		return array;
	}

	const internalArray = array.filter(item => isNonEmptyObject(item) && Object.hasOwn(item, key));

	return internalArray.reduce((result, item) => {
		result[item[key]] = item;

		return result;
	}, {});
}
