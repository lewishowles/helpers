import { isObject } from "./is-object";

/**
 * @helper flattenObject
 * @category Object
 * @signature flattenObject(object: object)
 * @description
 * Flattens a nested object into a single-level object with dot-notation keys.
 *
 * @param  {object}  object
 *     The object to flatten.
 *
 * @returns  {object}
 *     An object with nested keys expressed as dot-separated paths.
 *
 * @note
 * Arrays are preserved as leaf values — they are not flattened into indexed
 * keys (e.g. `"items.0"`).
 *
 * Only own enumerable properties are included.
 *
 * @example
 * flattenObject({ a: { b: 1, c: 2 }, d: 3 });
 * // { "a.b": 1, "a.c": 2, "d": 3 }
 *
 * flattenObject({ items: [1, 2, 3] });
 * // { "items": [1, 2, 3] }
 */
export function flattenObject(object) {
	if (!isObject(object)) {
		return {};
	}

	// The flattened property map.
	const result = {};

	/**
	 * Add the leaf values under their full paths.
	 *
	 * @param  {object}  current
	 *     The object to visit.
	 * @param  {string}  prefix
	 *     The path to the current object.
	 */
	function walk(current, prefix) {
		for (const key of Object.keys(current)) {
			// The value at the current object key.
			const value = current[key];
			// The full dot-separated path for this key.
			const path = prefix ? `${prefix}.${key}` : key;

			if (isObject(value)) {
				walk(value, path);
			} else {
				result[path] = value;
			}
		}
	}

	walk(object, "");

	return result;
}
