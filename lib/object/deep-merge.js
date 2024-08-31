import { isNonEmptyArray } from "@array";
import { isObject } from "@object";

/**
 * Recursively merge two or more objects. The values from later objects override
 * those from earlier.
 *
 * @param  {object}  target
 *     The starting point for our merge.
 * @param  {...object}  sources
 *     The list of objects to merge.
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
		} else if (isObject(source[key])) {
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
	return (typeof targetValue !== typeof sourceValue) ||
		(Array.isArray(targetValue) !== Array.isArray(sourceValue)) ||
		(isObject(targetValue) !== isObject(sourceValue));
}
