import { get } from "@object";
import { isNonEmptyArray } from "./is-non-empty-array";
import { isNonEmptyString } from "@string";

/**
 * Sorts an array of objects by a given property. For now, this function only
 * sorts by a top-level object property, and only supports strings and numbers.
 *
 * @param  {array}  array
 *     The array to sort.
 *
 * @param  {string}  property
 *     The name of the property by which to sort.
 *
 * @param  {boolean}  options.ascending
 *     Whether to sort ascending (true), or descending (false).
 */
export function sortObjectsByProperty(array, property, { ascending = true } = {}) {
	if (!isNonEmptyArray(array) || !isNonEmptyString(property)) {
		return array;
	}

	const order = ascending ? 1 : -1;

	return array.sort((a, b) => {
		const aValue = get(a, property);
		const bValue = get(b, property);

		if (aValue == null && bValue == null) {
			return 0;
		}

		if (aValue == null) {
			return -1;
		}

		if (bValue == null) {
			return 1;
		}

		if (typeof aValue !== "string" && typeof aValue !== "number") {
			return 0;
		}

		if (typeof bValue !== "string" && typeof bValue !== "number") {
			return 0;
		}

		if (aValue < bValue) {
			return -order;
		}

		if (aValue > bValue) {
			return order;
		}

		return 0;
	});
}
