import { isNonEmptyArray } from "./is-non-empty-array";

/**
 * Safely reduce the provided array to those entries which are unique.
 */
export function unique(array) {
	if (!isNonEmptyArray(array)) {
		return [];
	}

	return [...new Set(array)];
}
