import { isNonEmptyArray } from "#array/is-non-empty-array";
import { isNonEmptyString } from "#string/is-non-empty-string";
import { isNonEmptyObject } from "./is-non-empty-object";

/**
 * @helper keyBy
 * @category Object
 * @signature keyBy(array: object[], key: string)
 * @description
 * Convert the given `array` of objects into a single object, where each object
 * in the original array is placed under the value of its given `key`.
 *
 * @param  {object[]}  array
 *     The objects to index.
 * @param  {string}  key
 *     The property whose value becomes each output key.
 *
 * @returns  {object | array}
 *     The indexed object, or the original array when the key is invalid.
 *
 * @note
 * Objects without the given `key` are discarded. When several objects share a
 * key value, the last one is kept. Key values that match built-in property
 * names, such as `__proto__` or `toString`, are stored as ordinary keys.
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

	// The items that have the requested key.
	const internalArray = array.filter((item) => isNonEmptyObject(item) && Object.hasOwn(item, key));

	return internalArray.reduce((result, item) => {
		// Defining the entry, rather than assigning it, keeps a key such as
		// "__proto__" as an ordinary key instead of replacing the prototype.
		Object.defineProperty(result, item[key], {
			value: item,
			writable: true,
			enumerable: true,
			configurable: true,
		});

		return result;
	}, {});
}
