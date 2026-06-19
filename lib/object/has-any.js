import { get } from "./get";
import { isNonEmptyObject } from "./is-non-empty-object";
import { isNonEmptyArray } from "../array/is-non-empty-array";

/**
 * @helper hasAny
 * @category Object
 * @signature hasAny(object: object, paths: string[])
 * @description
 * Determine if the given object has any of the (optionally deeply nested) properties.
 *
 * @example
 * hasAny({ a: { b: { c: 1 } } }, ["a.b.c"]); // true
 * hasAny({ a: { b: { c: 1 } } }, ["a.b.d", "a.b.c"]); // true
 * hasAny({ a: { b: { c: 1 } } }, ["a.b.d"]); // false
 * hasAny({ a: { b: { c: 1 } } }, ["a.b.e", "a.b.f"]); // false
 */
export function hasAny(object, paths) {
	if (!isNonEmptyObject(object) || !isNonEmptyArray(paths)) {
		return false;
	}

	return paths.some((path) => get(object, path) !== null);
}
