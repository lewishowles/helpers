import { isNonEmptyObject } from "./is-non-empty-object";

/**
 * @helper keys
 * @category Object
 * @signature keys(object: object)
 * @description
 * Returns an array of the keys of the given `object`.
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
