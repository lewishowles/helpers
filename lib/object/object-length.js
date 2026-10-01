import { isNonEmptyObject } from "./is-non-empty-object";

/**
 * @helper objectLength
 * @category Object
 * @signature objectLength(object: object)
 * @description
 *     Return the number of top-level keys in `object`. Returns `0` for empty or
 *     non-objects.
 *
 * @param  {object}  object
 *     The object to count keys on.
 *
 * @returns  {number}
 *     The number of own keys, or zero for an invalid object.
 *
 * @example
 * objectLength({ a: 1, b: 2 }); // 2
 * objectLength({}); // 0
 * objectLength("string"); // 0
 */
export function objectLength(object) {
	if (!isNonEmptyObject(object)) {
		return 0;
	}

	return Object.keys(object).length;
}
