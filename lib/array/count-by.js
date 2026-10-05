import { getPathValue } from "#object/get-path-value";
import { isNonEmptyString } from "#string/is-non-empty-string";
import { isNonEmptyArray } from "./is-non-empty-array";

/**
 * Count items by the value at a property path.
 *
 * @helper countBy
 * @category Array
 * @signature countBy(array: object[], property: string)
 * @description
 * Count the occurrences in `array` of each distinct value at `property`.
 * Supports dot-path notation for nested properties.
 *
 * @param  {object[]}  array
 *     The array of objects to count.
 * @param  {string}  property
 *     The property path to count items by. Dot paths are supported.
 * @returns  {object}
 *     An object mapping each resolved value to its count.
 *
 * @note
 * Items where `property` resolves to `undefined` are counted under the key
 * `"undefined"`.
 *
 * @example
 * countBy([{ type: "a" }, { type: "b" }, { type: "a" }], "type");
 * // { a: 2, b: 1 }
 *
 * countBy([{ address: { city: "York" } }, { address: { city: "Leeds" } }, { address: { city: "York" } }], "address.city");
 * // { York: 2, Leeds: 1 }
 */
export function countBy(array, property) {
	if (!isNonEmptyArray(array) || !isNonEmptyString(property)) {
		return {};
	}

	return array.reduce((result, item) => {
		// The resolved value becomes the count's object key.
		const value = getPathValue(item, property);

		if (!(value in result)) {
			result[value] = 0;
		}

		result[value] += 1;

		return result;
	}, {});
}
