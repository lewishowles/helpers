import { isNonEmptyArray } from "@array";
import { isNonEmptyObject } from "@object";

/**
 * Determine if the provided object contains the provided value. If a string is
 * provided, by default, strings are checked case insensitively. There is also
 * the option to perform a strict comparison, which requires the exact string to
 * be found.
 *
 * Object keys that contain other objects or arrays are searched recursively.
 *
 * objectContains({ name: "Merida" }, "merida"); // true
 * objectContains({ name: "Moana" }, "merida"); // false
 * objectContains({ name: "Mulan" }, "mulan", { caseInsensitive: false }); // false
 * objectContains({ name: { first: "Tiana" } }, "tia"); // false
 * objectContains({ name: { first: "Tiana" } }, "tia", { allowPartial: true }); // true
 * objectContains({ names: ["Ariel", "Jasmine"] }, "ariel"); // true
 * objectContains({ length: 52 }, 5); // false
 *
 * @param  {unknown}  object
 *     The object or array to search within.
 * @param  {unknown}  needle
 *     The needle to look for.
 * @param  {object}  options
 *     The options for matching.
 * @param  {boolean}  options.caseInsensitive
 *     Whether to perform a case insensitive comparison for strings.
 * @param  {boolean}  options.allowPartial
 *     Whether to allow partial string matches.
 */
export function objectContains(object, needle, { caseInsensitive = true, allowPartial = false } = {}) {
	if (!isNonEmptyObject(object) && !isNonEmptyArray(object)) {
		return false;
	}

	if (isNonEmptyArray(object)) {
		return object.some(value => isMatch(value, needle, { caseInsensitive, allowPartial }));
	}

	return Object.values(object).some(value => isMatch(value, needle, { caseInsensitive, allowPartial }));
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
