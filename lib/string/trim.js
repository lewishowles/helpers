import { isNonEmptyString } from "./is-non-empty-string";

/**
 * @helper trim
 * @category String
 * @signature trim(string, pattern: string | RegExp = "\\s")
 * @description
 * Trim both sides of `string` using the provided string or RegExp `pattern`.
 * Removes whole repeated copies of a string pattern. Trims whitespace by
 * default.
 *
 * @param  {string}  string
 *     The string to trim.
 * @param  {string | RegExp}  pattern
 *     The pattern to trim from both sides.
 *
 * @returns  {string}
 *     The resulting string.
 *
 * @example
 * trim("   string   "); // string
 * trim("***string***", "*"); // string
 * trim("ababXabab", "ab"); // X
 * trim("***string***", new RegExp("\\*")); // **string**
 * trim("***string***", new RegExp("\\*+")); // string
 */
export function trim(string, pattern = "\\s") {
	if (!isNonEmptyString(string)) {
		return "";
	}

	if (!isNonEmptyString(pattern) && !(pattern instanceof RegExp)) {
		return string;
	}

	if (pattern === "\\s") {
		return string.trim();
	}

	if (pattern instanceof RegExp) {
		return string.replace(new RegExp(`^${pattern.source}|${pattern.source}$`, "g"), "");
	}

	// Where the kept text starts, after the copies of the pattern at the start.
	let start = 0;
	// Where the kept text ends, before the copies of the pattern at the end.
	let end = string.length;

	while (string.startsWith(pattern, start)) {
		start += pattern.length;
	}

	// Stop before the end reaches text the first loop removed, so "aaa" with
	// pattern "aa" leaves "a" rather than an empty string.
	while (end - start >= pattern.length && string.endsWith(pattern, end)) {
		end -= pattern.length;
	}

	return string.slice(start, end);
}
