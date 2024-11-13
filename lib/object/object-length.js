import { isNonEmptyObject } from "./is-non-empty-object";

/**
 * Return the number of top-level keys in an object.
 *
 * @param  {object}  object
 *     The object to test.
 */
export function objectLength(object) {
	if (!isNonEmptyObject(object)) {
		return 0;
	}

	return Object.keys(object).length;
}
