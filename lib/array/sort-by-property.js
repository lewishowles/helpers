import { isNonEmptyArray } from "./is-non-empty-array";
import { getPathValue } from "../object/get-path-value";
import { isNonEmptyString } from "../string/is-non-empty-string";

/**
 * @helper sortByProperty
 * @category Array
 * @signature sortByProperty(array: any[], property: string, { ascending: boolean: true })
 * @description
 * Returns a new array containing the `array` of objects, sorted by the value at `property`, with optional direction.
 *
 * @example
 * sortByProperty([{ name: "Lewis" }, { name: "Alice" }], "name"); // [{ name: "Alice" }, { name: "Lewis" }]
 * sortByProperty([{ name: "Lewis" }, { name: "Alice" }], "age"); // [{ name: "Lewis" }, { name: "Alice" }]
 * sortByProperty([{ name: "Lewis" }, { name: "Alice" }], "name", { ascending: false }); // [{ name: "Lewis" }, { name: "Alice" }]
 */
export function sortByProperty(array, property, { ascending = true } = {}) {
	if (!isNonEmptyArray(array)) {
		return [];
	}

	if (!isNonEmptyString(property)) {
		return array;
	}

	const order = ascending ? 1 : -1;

	return [...array].sort((a, b) => {
		const aValue = getPathValue(a, property);
		const bValue = getPathValue(b, property);

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
