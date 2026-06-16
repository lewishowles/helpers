import { isNonEmptyObject } from "./is-non-empty-object";

/**
 * @helper values
 * @category Object
 * @signature values(object: object)
 * @description
 * Returns an array of the values of the given `object`.
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
