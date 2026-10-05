import { getPathValue } from "#object/get-path-value";
import { isNonEmptyString } from "#string/is-non-empty-string";
import { isNonEmptyArray } from "./is-non-empty-array";

/**
 * Sort objects by one or more property paths.
 *
 * @helper sortByProperty
 * @category Array
 * @signature sortByProperty(array: any[], property: string, { ascending: boolean: true })
 * @signature sortByProperty(array: any[], criteria: object[])
 * @description
 * Returns a new array containing the `array` of objects, sorted by the value at
 * `property`, with optional direction. When an array of criteria objects is
 * passed, sorts by each criterion in order, using the first non-zero
 * comparison.
 *
 * @param  {any[]}  array
 *     The array of objects to sort.
 * @param  {string}  property
 *     The property path to sort by.
 * @param  {object}  options
 *     The direction for a single-property sort.
 * @param  {boolean}  [options.ascending=true]
 *     Whether to sort from lowest to highest.
 * @param  {object[]}  criteria
 *     An array of criteria objects to sort by, in priority order.
 * @param  {string}  criteria[].property
 *     The property path to sort by.
 * @param  {boolean}  criteria[].ascending
 *     Whether to sort from lowest to highest.
 * @returns  {any[]}
 *     A sorted copy, or the original array for invalid criteria.
 *
 * @example
 * sortByProperty([{ name: "Lewis" }, { name: "Alice" }], "name"); // [{ name: "Alice" }, { name: "Lewis" }]
 * sortByProperty([{ name: "Lewis" }, { name: "Alice" }], "name", { ascending: false }); // [{ name: "Lewis" }, { name: "Alice" }]
 * sortByProperty([{ last: "Smith", first: "Alice" }, { last: "Jones", first: "Bob" }], [
 *   { property: "last", ascending: true },
 *   { property: "first", ascending: true },
 * ]); // [{ last: "Jones", first: "Bob" }, { last: "Smith", first: "Alice" }]
 */
export function sortByProperty(array, property, { ascending = true } = {}) {
	if (!isNonEmptyArray(array)) {
		return [];
	}

	if (Array.isArray(property)) {
		return sortByMultipleCriteria(array, property);
	}

	if (!isNonEmptyString(property)) {
		return array;
	}

	// Reverses each comparison when sorting in descending order.
	const order = ascending ? 1 : -1;

	return [...array].sort((a, b) => compareByProperty(a, b, property, order));
}

/**
 * Sort an array by multiple criteria, returning the first non-zero comparison.
 *
 * @param  {any[]}  array
 *     The array to sort.
 * @param  {object[]}  criteria
 *     The criteria to sort by, in priority order.
 *
 * @returns  {any[]}
 *     A sorted copy, or the original array when no criteria are valid.
 */
function sortByMultipleCriteria(array, criteria) {
	// The criteria that name a property path, with each direction stored as 1
	// for ascending or -1 for descending.
	const validCriteria = criteria
		.filter((criteria) => isNonEmptyString(criteria?.property))
		.map((criteria) => ({
			property: criteria.property,
			order: criteria.ascending === false ? -1 : 1,
		}));

	if (validCriteria.length === 0) {
		return array;
	}

	return [...array].sort((a, b) => {
		for (const { property, order } of validCriteria) {
			// The first property that distinguishes these items decides their
			// order.
			const result = compareByProperty(a, b, property, order);

			if (result !== 0) {
				return result;
			}
		}

		return 0;
	});
}

/**
 * Compare two objects by the value at a property path.
 *
 * Null or missing values sort before present values in either direction. Values
 * other than strings and numbers compare as equal.
 *
 * @param  {object}  a
 *     The first object to compare.
 * @param  {object}  b
 *     The second object to compare.
 * @param  {string}  property
 *     The property path to compare by.
 * @param  {number}  order
 *     Use 1 for ascending order and -1 for descending order.
 *
 * @returns  {number}
 *     A negative, positive, or zero comparison result.
 */
function compareByProperty(a, b, property, order) {
	// The value at the property path in the first object.
	const aValue = getPathValue(a, property);
	// The value at the property path in the second object.
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
}
