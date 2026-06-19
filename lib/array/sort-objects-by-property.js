import { isNonEmptyArray } from "./is-non-empty-array";
import { get } from "../object/get";
import { isNonEmptyString } from "../string/is-non-empty-string";

/**
 * @helper sortObjectsByProperty
 * @category Array
 * @signature sortObjectsByProperty(array: any[], property: string, { ascending: boolean: true })
 * @description
 * Returns a new array containing the `array` of objects, sorted by the value of property `property`, with optional direction.
 *
 * @example
 * sortObjectsByProperty([{ name: "Lewis" }, { name: "Alice" }], "name"); // [{ name: "Alice" }, { name: "Lewis" }]
 * sortObjectsByProperty([{ name: "Lewis" }, { name: "Alice" }], "age"); // [{ name: "Lewis" }, { name: "Alice" }]
 * sortObjectsByProperty([{ name: "Lewis" }, { name: "Alice" }], "name", { ascending: false }); // [{ name: "Lewis" }, { name: "Alice" }]
 */
export function sortObjectsByProperty(array, property, { ascending = true } = {}) {
	if (!isNonEmptyArray(array) || !isNonEmptyString(property)) {
		return array;
	}

	const order = ascending ? 1 : -1;

	return [...array].sort((a, b) => {
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
