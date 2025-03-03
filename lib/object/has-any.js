import { get } from "./get";
import { isNonEmptyArray } from "@array";
import { isNonEmptyObject } from "./is-non-empty-object";

/**
 * Determine if the given object has any of the (optionally deeply nested)
 * properties.
 */
export function hasAny(object, paths) {
	if (!isNonEmptyObject(object) || !isNonEmptyArray(paths)) {
		return false;
	}

	return paths.some(path => get(object, path) !== null);
}
