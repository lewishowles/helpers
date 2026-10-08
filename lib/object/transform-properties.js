import { isNonEmptyObject } from "./is-non-empty-object";
import { isPlainObject } from "./is-plain-object";

/**
 * @helper transformProperties
 * @category Object
 * @signature transformProperties(object: object, transforms: object)
 * @description
 * Returns a shallow copy of an object with the values of named own properties
 * replaced by the results of their transform functions. Other properties and
 * their order stay the same. The original object is not mutated.
 *
 * @param  {object}  object
 *     The object whose property values to transform.
 * @param  {object}  transforms
 *     Property names mapped to functions that take the current value and return
 *     the new one.
 *
 * @returns  {object}
 *     A copy with the named property values transformed.
 *
 * @note
 * Only existing properties are transformed, and entries that are not functions
 * are ignored. A non-plain input is returned as-is.
 *
 * @example
 * transformProperties({ date: "2026-01-01", page: 2 }, { date: Date.parse });
 * // { date: 1767225600000, page: 2 }
 */
export function transformProperties(object, transforms) {
	if (!isPlainObject(object)) {
		return object;
	}

	// The copy keeps unchanged properties in their original order.
	const result = { ...object };

	if (!isNonEmptyObject(transforms)) {
		return result;
	}

	for (const [key, transform] of Object.entries(transforms)) {
		if (!Object.hasOwn(result, key) || typeof transform !== "function") {
			continue;
		}

		result[key] = transform(object[key]);
	}

	return result;
}
