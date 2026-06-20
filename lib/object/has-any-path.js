import { getPathValue } from "./get-path-value";
import { isNonEmptyObject } from "./is-non-empty-object";
import { NOT_FOUND } from "./path-traversal";
import { isNonEmptyArray } from "../array/is-non-empty-array";

/**
 * @helper hasAnyPath
 * @category Object
 * @signature hasAnyPath(object: object, paths: string[])
 * @description
 * Determine if the given object has any of the properties at `paths`.
 *
 * @example
 * hasAnyPath({ a: { b: { c: 1 } } }, ["a.b.c"]); // true
 * hasAnyPath({ a: { b: { c: 1 } } }, ["a.b.d", "a.b.c"]); // true
 * hasAnyPath({ a: { b: { c: 1 } } }, ["a.b.d"]); // false
 * hasAnyPath({ a: { b: { c: 1 } } }, ["a.b.e", "a.b.f"]); // false
 */
export function hasAnyPath(object, paths) {
	if (!isNonEmptyObject(object) || !isNonEmptyArray(paths)) {
		return false;
	}

	return paths.some((path) => getPathValue(object, path, NOT_FOUND) !== NOT_FOUND);
}
