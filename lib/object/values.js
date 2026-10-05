import { isNonEmptyObject } from "./is-non-empty-object";

/**
 * @helper values
 * @category Object
 * @signature values(object: object)
 * @description
 * Returns an array of the values of the given `object`.
 *
 * @param  {object}  object
 *     The object to read values from.
 *
 * @returns  {any[]}
 *     The object values, or an empty array for an invalid object.
 *
 * @example
 * values({ a: 1, b: 2, c: 3 }); // [1, 2, 3]
 * values({}); // []
 * values("string"); // []
 */
export function values(object) {
	if (!isNonEmptyObject(object)) {
		return [];
	}

	return Object.values(object);
}
