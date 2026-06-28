import { isObject } from "./is-object";
import { isNonEmptyArray } from "../array/is-non-empty-array";

// isObject matches any non-null, non-array object — including Date, class
// instances, and Vue refs. isPlainObject restricts recursion to literal {}
// objects, preventing class instances from being flattened to {}.
function isPlainObject(value) {
	return (
		value !== null &&
		typeof value === "object" &&
		!Array.isArray(value) &&
		value.constructor === Object
	);
}

/**
 * @helper deepMerge
 * @category Object
 * @signature deepMerge(object: object)
 * @description
 * Recursively merges two or more objects. The values of later objects override those of earlier objects.
 *
 * @example
 * deepMerge({ key: "value" }, { value: "key" }); // { key: "value", value: "key" }
 * deepMerge({ key: "value", a: { b: 2 } }, { key: "modified", a: { c: 3 } }); // { key: "modified", a { b: 2, c: 3 }}
 */
export function deepMerge(target, ...sources) {
	if (!isNonEmptyArray(sources)) {
		return target;
	}

	const source = sources.shift();

	if (!isObject(target) || !isObject(source)) {
		return deepMerge(target, ...sources);
	}

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
 * @return  {boolean}
 *     True if the target value should be replaced by the source value.
 */
function mismatchingTypes(targetValue, sourceValue) {
	return (
		typeof targetValue !== typeof sourceValue ||
		Array.isArray(targetValue) !== Array.isArray(sourceValue) ||
		isObject(targetValue) !== isObject(sourceValue)
	);
}
