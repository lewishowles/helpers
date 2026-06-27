import { isNonEmptyArray } from "./is-non-empty-array";
import { isNonEmptyString } from "../string/is-non-empty-string";
import { getPathValue } from "../object/get-path-value";

/**
 * @helper uniqueBy
 * @category Array
 * @signature uniqueBy(array: object[], property: string)
 * @description
 * Remove duplicate objects from an array based on a property value. Supports
 * dot-path notation for nested properties. The first occurrence of each value
 * is kept.
 *
 * @note
 * Items where the resolved value is `undefined` are treated as equal, with only
 * the first occurrence kept.
 *
 * @example
 * uniqueBy([{ id: 1, name: "A" }, { id: 2, name: "B" }, { id: 1, name: "C" }], "id");
 * // [{ id: 1, name: "A" }, { id: 2, name: "B" }]
 * uniqueBy([{ address: { city: "London" } }, { address: { city: "Paris" } }, { address: { city: "London" } }], "address.city");
 * // [{ address: { city: "London" } }, { address: { city: "Paris" } }]
 * uniqueBy([{ id: 1 }, { id: 1 }, { id: 1 }], "id");
 * // [{ id: 1 }]
 * uniqueBy([], "id");
 * // []
 */
export function uniqueBy(array, property) {
	if (!isNonEmptyArray(array) || !isNonEmptyString(property)) {
		return [];
	}

	const seen = new Set();
	const result = [];

	for (const item of array) {
		const value = getPathValue(item, property);

		if (!seen.has(value)) {
			seen.add(value);
			result.push(item);
		}
	}

	return result;
}
