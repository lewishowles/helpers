import { isNonEmptyObject } from "./is-non-empty-object";

/**
 * Safely retrieve the keys of an object.
 */
export function keys(object) {
	if (!isNonEmptyObject(object)) {
		return [];
	}

	return Object.keys(object);
}
