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
 * @helper deepMergeWith
 * @category Object
 * @signature deepMergeWith(target: object, sources: array, options?: object)
 * @description
 * Works like `deepMerge`, but lets you decide what happens when the same key
 * holds an array in both the target and a source.
 *
 * @note
 * Pick the behaviour with `options.arrayStrategy`:
 *
 * - `"replace"` (default): the source array wins, just like `deepMerge`.
 * - `"concatenate"`: the two arrays are joined together, target items first.
 * - `"merge"`: the arrays are combined item by item, deep-merging the ones that
 * line up.
 *
 * Everything else matches `deepMerge` — objects merge recursively, class
 * instances stay intact, and your inputs are never changed. The only difference
 * is that you pass the sources as a single array (instead of one after
 * another), which keeps `options` neatly at the end.
 *
 * @example
 * deepMergeWith({ tags: ["a"] }, [{ tags: ["b"] }], { arrayStrategy: "concatenate" });
 * // { tags: ["a", "b"] }
 *
 * @example
 * deepMergeWith({ a: { b: 1 } }, [{ a: { c: 2 } }]);
 * // { a: { b: 1, c: 2 } }
 */
export function deepMergeWith(target, sources, options) {
	let sourceArray;

	if (Array.isArray(sources)) {
		sourceArray = sources;
	} else if (isPlainObject(sources)) {
		sourceArray = [sources];
	} else {
		sourceArray = [];
	}

	const arrayStrategy = (isObject(options) ? options.arrayStrategy : undefined) || "replace";

	if (!isObject(target)) {
		return target;
	}

	if (!isNonEmptyArray(sourceArray)) {
		return deepClone(target);
	}

	let result = { ...target };

	for (const source of sourceArray) {
		if (!isObject(source)) {
			continue;
		}
		result = mergeInternal(result, source, arrayStrategy);
	}

	return result;
}

function mergeInternal(target, source, arrayStrategy) {
	const result = { ...target };

	for (const key in source) {
		if (mismatchingTypes(result[key], source[key])) {
			result[key] = source[key];
		} else if (
			isPlainObject(source[key]) &&
			(result[key] === undefined || isPlainObject(result[key]))
		) {
			if (!result[key]) {
				result[key] = {};
			}

			result[key] = mergeInternal(result[key], source[key], arrayStrategy);
		} else if (Array.isArray(source[key]) && Array.isArray(result[key])) {
			if (arrayStrategy === "concatenate") {
				result[key] = [...result[key], ...source[key]];
			} else if (arrayStrategy === "merge") {
				result[key] = mergeArrays(result[key], source[key], arrayStrategy);
			} else {
				result[key] = source[key];
			}
		} else {
			result[key] = source[key];
		}
	}

	return result;
}

function mergeArrays(targetArray, sourceArray, arrayStrategy) {
	const maxLen = Math.max(targetArray.length, sourceArray.length);
	const result = [];

	for (let i = 0; i < maxLen; i++) {
		if (i >= sourceArray.length) {
			result[i] = targetArray[i];
		} else if (i >= targetArray.length) {
			result[i] = sourceArray[i];
		} else if (isPlainObject(targetArray[i]) && isPlainObject(sourceArray[i])) {
			result[i] = mergeInternal(targetArray[i], sourceArray[i], arrayStrategy);
		} else {
			result[i] = sourceArray[i];
		}
	}

	return result;
}

function deepClone(value) {
	if (!isPlainObject(value)) {
		return value;
	}

	const result = {};

	for (const key in value) {
		if (isPlainObject(value[key])) {
			result[key] = deepClone(value[key]);
		} else if (Array.isArray(value[key])) {
			result[key] = [...value[key]];
		} else {
			result[key] = value[key];
		}
	}

	return result;
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
