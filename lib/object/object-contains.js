import { isNonEmptyObject } from "./is-non-empty-object";
import { isNonEmptyArray } from "../array/is-non-empty-array";

/**
 * @helper objectContains
 * @category Object
 * @signature objectContains(object: object, needle: any, { exclude: string[] = null, include: string[] = null, caseInsensitive: boolean = true, allowPartial: boolean = false })
 * @description
 * Returns true if one of the `object`'s values is `needle`. Also works when `object` is an array.
 *
 * @note
 * String `needle`s are checked case-insensitively by default, and partial matches can be enabled via option.
 *
 * `exclude` defines an array of properties to exclude from the search, while `include` defines an array of properties which are searched exclusively. If `include` is defined, `exclude` is ignored.
 *
 * @example
 * objectContains({ name: "Merida" }, "merida"); // true
 * objectContains({ name: "Moana" }, "merida"); // false
 * objectContains({ name: "Mulan" }, "mulan", { caseInsensitive: false }); // false
 * objectContains({ name: { first: "Tiana" } }, "tia"); // false
 * objectContains({ name: { first: "Tiana" } }, "tia", { allowPartial: true }); // true
 * objectContains({ names: ["Ariel", "Jasmine"] }, "ariel"); // true
 * objectContains({ length: 52 }, 5); // false
 */
export function objectContains(
	object,
	needle,
	{ exclude = null, include = null, caseInsensitive = true, allowPartial = false } = {},
) {
	if (!isNonEmptyObject(object) && !isNonEmptyArray(object)) {
		return false;
	}

	if (isNonEmptyArray(object)) {
		return object.some((value) => isMatch(value, needle, { caseInsensitive, allowPartial }));
	}

	let haystack;

	if (isNonEmptyArray(include)) {
		haystack = Object.keys(object)
			.filter((key) => include.includes(key))
			.map((key) => object[key]);
	} else if (isNonEmptyArray(exclude)) {
		haystack = Object.keys(object)
			.filter((key) => !exclude.includes(key))
			.map((key) => object[key]);
	} else {
		haystack = Object.values(object);
	}

	return haystack.some((value) => isMatch(value, needle, { caseInsensitive, allowPartial }));
}

/**
 * Determine whether two values match. If the needle is a string, we allow
 * allowPartial and case-insensitive matches.
 *
 * @param  {unknown}  needle
 *     The value to find.
 * @param  {unknown}  comparator
 *     The value to compare against.
 * @param  {object}  options
 *     The options for matching.
 * @param  {boolean}  options.caseInsensitive
 *     Whether to perform a case insensitive comparison for strings.
 * @param  {boolean}  options.allowPartial
 *     Whether to perform a strict comparison for strings.
 */
function isMatch(comparator, needle, { caseInsensitive = true, allowPartial = false } = {}) {
	if (isNonEmptyObject(comparator) || isNonEmptyArray(comparator)) {
		return objectContains(comparator, needle, { caseInsensitive, allowPartial });
	}

	if (typeof needle === "string") {
		if (typeof comparator !== "string") {
			return false;
		}

		if (caseInsensitive === true) {
			needle = needle.toLowerCase();
			comparator = comparator.toLowerCase();
		}

		if (allowPartial === true) {
			return comparator.includes(needle);
		}
	}

	return comparator === needle;
}
