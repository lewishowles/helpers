import { isNonEmptyArray } from "./is-non-empty-array";
import { isNonEmptyString } from "../string/is-non-empty-string";
import { getPathValue } from "../object/get-path-value.js";

/**
 * @helper groupBy
 * @category Array
 * @signature groupBy(array: object[], property: string)
 * @description
 * Group the given `array` of objects into sub-arrays keyed by the value at
 * `property`. Supports dot-path notation for nested properties.
 *
 * @note
 * Items where `property` resolves to `undefined` are grouped under the key
 * `"undefined"`.
 *
 * @example
 * groupBy([{ type: "a", val: 1 }, { type: "b", val: 2 }, { type: "a", val: 3 }], "type");
 * // { a: [{ type: "a", val: 1 }, { type: "a", val: 3 }], b: [{ type: "b", val: 2 }] }
 *
 * groupBy([{ addr: { city: "York" } }, { addr: { city: "York" } }, { addr: { city: "Leeds" } }], "addr.city");
 * // { York: [{ addr: { city: "York" } }, { addr: { city: "York" } }], Leeds: [{ addr: { city: "Leeds" } }] }
 */
export function groupBy(array, property) {
	if (!isNonEmptyArray(array) || !isNonEmptyString(property)) {
		return {};
	}

	return array.reduce((result, item) => {
		const value = getPathValue(item, property);

		if (!(value in result)) {
			result[value] = [];
		}

		result[value].push(item);

		return result;
	}, {});
}
