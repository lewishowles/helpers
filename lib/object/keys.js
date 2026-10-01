import { isNonEmptyObject } from "./is-non-empty-object";

/**
 * @helper keys
 * @category Object
 * @signature keys(object: object)
 * @description
 *     Returns an array of the keys of the given `object`.
 *
 * @param  {object}  object
 *     The object to read keys from.
 *
 * @returns  {string[]}
 *     The object keys, or an empty array for an invalid object.
 *
 * @example
 * keys({ a: 1, b: 2, c: 3 }); // ["a", "b", "c"]
 * keys({}); // []
 * keys("string"); // []
 */
export function keys(object) {
	if (!isNonEmptyObject(object)) {
		return [];
	}

	return Object.keys(object);
}
