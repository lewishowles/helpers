import { isNonEmptyArray } from "#array/is-non-empty-array";
import { isNonEmptyObject } from "./is-non-empty-object";

/**
 * @helper objectContains
 * @category Object
 * @signature objectContains(object: object, needle: any, { exclude: string[] = null, include: string[] = null, caseInsensitive: boolean = true, allowPartial: boolean = false })
 * @description
 * Returns true if one of the `object`'s values is `needle`. Also works when
 * `object` is an array.
 *
 * @param  {object}  object
 *     The object or array to search.
 * @param  {any}  needle
 *     The value to find.
 * @param  {object}  options
 *     The search options.
 * @param  {string[]}  [options.exclude=null]
 *     The object keys to omit from the search.
 * @param  {string[]}  [options.include=null]
 *     The only object keys to search.
 * @param  {boolean}  [options.caseInsensitive=true]
 *     Whether string comparisons ignore case.
 * @param  {boolean}  [options.allowPartial=false]
 *     Whether string comparisons allow partial matches.
 *
 * @returns  {boolean}
 *     Whether a matching value occurs in the object or array.
 *
 * @note
 * String `needle`s are checked case-insensitively by default, and partial
 * matches can be enabled via option.
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

	// The values selected for comparison.
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
 * @param  {unknown}  comparator
 *     The value to compare against.
 * @param  {unknown}  needle
 *     The value to find.
 * @param  {object}  options
 *     The options for matching.
 * @param  {boolean}  [options.caseInsensitive=true]
 *     Whether to perform a case insensitive comparison for strings.
 * @param  {boolean}  [options.allowPartial=false]
 *     Whether a string needle can match part of a string comparator.
 *
 * @returns  {boolean}
 *     Whether the values match under the selected string options.
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
