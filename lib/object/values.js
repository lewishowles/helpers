import { isNonEmptyObject } from "./is-non-empty-object";

/**
 * Safely retrieve the values of an object.
 */
export function values(object) {
	if (!isNonEmptyObject(object)) {
		return [];
	}

	return Object.values(object);
}
