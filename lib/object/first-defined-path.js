import { isNonEmptyArray } from "#array/is-non-empty-array";
import { isDefined } from "#general/is-defined";
import { getPathValue } from "./get-path-value";
import { isNonEmptyObject } from "./is-non-empty-object";

/**
 * @helper firstDefinedPath
 * @category Object
 * @signature firstDefinedPath(object: object, paths: string[])
 * @description
 *     Try each dot-notation `path` in turn, returning the first defined value
 *     found. Values that are `null` or `undefined` are skipped, so a path that
 *     exists but holds `null` does not short-circuit the search. Returns
 *     `undefined` when no path yields a defined value, or when the input is not
 *     a non-empty object with a non-empty `paths` array.
 *
 * @param  {object}  object
 *     The object to inspect.
 * @param  {string[]}  paths
 *     The dot-notation paths to try.
 *
 * @returns  {any}
 *     The first defined path value, or undefined when none exists.
 *
 * @example
 * firstDefinedPath({ a: 1, b: 2 }, ["a"]); // 1
 * firstDefinedPath({ a: 1, b: 2 }, ["c", "a"]); // 1
 * firstDefinedPath({ a: null, b: 2 }, ["a", "b"]); // 2
 * firstDefinedPath({ a: { b: { c: "deep" } } }, ["a.b.c"]); // "deep"
 * firstDefinedPath({ a: 1 }, ["c", "d"]); // undefined
 * firstDefinedPath([], ["a"]); // undefined
 */
export function firstDefinedPath(object, paths) {
	if (!isNonEmptyObject(object) || !isNonEmptyArray(paths)) {
		return undefined;
	}

	for (const path of paths) {
		// The value at the current candidate path.
		const value = getPathValue(object, path);

		if (isDefined(value)) {
			return value;
		}
	}

	return undefined;
}
