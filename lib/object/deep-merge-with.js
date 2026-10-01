import { isNonEmptyArray } from "#array/is-non-empty-array";
import { isObject } from "./is-object";
import { isPlainObject } from "./is-plain-object";

/**
 * @helper deepMergeWith
 * @category Object
 * @signature deepMergeWith(target: object, sources: array, options?: object)
 * @description
 *     Works like `deepMerge`, but lets you decide what happens when the same
 *     key holds an array in both the target and a source.
 *
 * @param  {object}  target
 *     The object to merge into.
 * @param  {object[]}  sources
 *     The source objects to merge from.
 * @param  {object}  options
 *     Merge behaviour.
 * @param  {string}  options.arrayStrategy
 *     How arrays are combined when both objects contain arrays at the same key.
 *
 * @returns  {object}
 *     The merged object without changing the inputs.
 *
 * @note
 *     Set `options.arrayStrategy` to `"replace"` (the default) so the source
 *     array wins, just like `deepMerge`; `"concatenate"` to join both arrays
 *     with target items first; or `"merge"` to combine arrays position by
 *     position, deep-merging plain objects at the same position.
 *
 *     Other values merge like `deepMerge`: objects merge recursively, class
 *     instances stay intact, and the inputs are not changed. Sources are passed
 *     as one array so `options` stays at the end.
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
	// The sources normalised to an array.
	let sourceArray;

	if (Array.isArray(sources)) {
		sourceArray = sources;
	} else if (isPlainObject(sources)) {
		sourceArray = [sources];
	} else {
		sourceArray = [];
	}

	// The requested way to combine matching arrays.
	const arrayStrategy = (isObject(options) ? options.arrayStrategy : undefined) || "replace";

	if (!isObject(target)) {
		return target;
	}

	if (!isNonEmptyArray(sourceArray)) {
		return deepClone(target);
	}

	// The copy that receives each source.
	let result = { ...target };

	for (const source of sourceArray) {
		if (!isObject(source)) {
			continue;
		}

		result = mergeInternal(result, source, arrayStrategy);
	}

	return result;
}

/**
 * Merge a source object into a copy of the target.
 *
 * @param  {object}  target
 *     The existing values to keep when the source has no matching key.
 * @param  {object}  source
 *     The values to add or merge into the target copy.
 * @param  {string}  arrayStrategy
 *     How matching arrays are combined.
 *
 * @returns  {object}
 *     The merged copy.
 */
function mergeInternal(target, source, arrayStrategy) {
	// The copy that receives the source properties.
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

/**
 * Combine two arrays item by item for the `"merge"` strategy. Plain objects at
 * the same position are merged, any other source item replaces the target item,
 * and extra items from the longer array are kept.
 *
 * @param  {array}  targetArray
 *     The target array.
 * @param  {array}  sourceArray
 *     The source array.
 * @param  {string}  arrayStrategy
 *     How arrays inside the merged items are combined.
 *
 * @returns  {array}
 *     The combined array.
 */
function mergeArrays(targetArray, sourceArray, arrayStrategy) {
	// The number of positions to combine.
	const maxLen = Math.max(targetArray.length, sourceArray.length);
	// The combined array.
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

/**
 * Recursively copy plain objects, shallowly copy their array properties, and
 * return other values unchanged.
 *
 * @param  {any}  value
 *     The value to copy.
 *
 * @returns  {any}
 *     The copied value.
 */
function deepClone(value) {
	if (!isPlainObject(value)) {
		return value;
	}

	// The copy of the plain object's own properties.
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
