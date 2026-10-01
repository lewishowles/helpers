import { isNonEmptyArray } from "#array/is-non-empty-array";
import { isObject } from "./is-object";
import { isPlainObject } from "./is-plain-object";

/**
 * @helper deepMerge
 * @category Object
 * @signature deepMerge(object: object)
 * @description
 *     Recursively merges two or more objects. The values of later objects
 *     override those of earlier objects.
 *
 * @param  {object}  target
 *     The object to merge into.
 * @param  {object[]}  sources
 *     The source objects to merge from.
 *
 * @returns  {object}
 *     The recursively merged object.
 *
 * @example
 * deepMerge({ key: "value" }, { value: "key" }); // { key: "value", value: "key" }
 * deepMerge({ key: "value", a: { b: 2 } }, { key: "modified", a: { c: 3 } }); // { key: "modified", a { b: 2, c: 3 }}
 */
export function deepMerge(target, ...sources) {
	if (!isNonEmptyArray(sources)) {
		return target;
	}

	// The next source object to merge.
	const source = sources.shift();

	if (!isObject(target) || !isObject(source)) {
		return deepMerge(target, ...sources);
	}

	// The copy that receives the source properties.
	const result = { ...target };

	for (const key in source) {
		// If we have mismatching types, we simply replace the result with the
		// new source value.
		if (mismatchingTypes(result[key], source[key])) {
			result[key] = source[key];
		} else if (
			isPlainObject(source[key]) &&
			(result[key] === undefined || isPlainObject(result[key]))
		) {
			if (!result[key]) {
				result[key] = {};
			}

			result[key] = deepMerge(result[key], source[key]);
		} else {
			result[key] = source[key];
		}
	}

	return deepMerge(result, ...sources);
}

/**
 * Determine if the target value should be replaced by the source value.
 *
 * @param  {any}  targetValue
 *     The value in the target object.
 * @param  {any}  sourceValue
 *     The value in the source object.
 *
 * @returns  {boolean}
 *     True if the target value should be replaced by the source value.
 */
function mismatchingTypes(targetValue, sourceValue) {
	return (
		typeof targetValue !== typeof sourceValue ||
		Array.isArray(targetValue) !== Array.isArray(sourceValue) ||
		isObject(targetValue) !== isObject(sourceValue)
	);
}
