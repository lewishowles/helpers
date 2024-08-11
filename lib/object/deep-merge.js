import { isNonEmptyArray } from "../array/is-non-empty-array";
import { isObject } from "./is-object";

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
		if (isObject(source[key])) {
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
