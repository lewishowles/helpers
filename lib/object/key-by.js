import { isNonEmptyArray } from "@array";
import { isNonEmptyObject } from "./is-non-empty-object";
import { isNonEmptyString } from "@string";

/**
 * @helper keyBy
 * @category Object
 * @signature keyBy(array: object[], key: string)
 * @description
 * Convert the given `array` of objects into a single object, where each object in the original array is placed under the value of its given `key`.
 *
 * @note
 * Objects without the given `key` are discarded. If an object has the same value `key` as a previous object, the previous object will be overwritten.
 *
 * @example
 * keyBy([{ a: 1 }, { a: 2 }], "a"); // { 1: { a: 1 }, 2: { a: 2 } }
 */
export function keyBy(array, key) {
	if (!isNonEmptyArray(array)) {
		return {};
	}

	if (!isNonEmptyString(key)) {
		return array;
	}

	const internalArray = array.filter((item) => isNonEmptyObject(item) && Object.hasOwn(item, key));

	return internalArray.reduce((result, item) => {
		result[item[key]] = item;

		return result;
	}, {});
}
