import { isNonEmptyString } from "./is-non-empty-string";

/**
 * @helper ltrim
 * @category String
 * @signature ltrim(string: string, pattern: string | RegExp = "\\s")
 * @description
 * Trim the left hand side of `string` using the provided string or RegExp
 * `pattern`. Removes whole repeated copies of a string pattern. Trims
 * whitespace by default.
 *
 * @param  {string}  string
 *     The string to trim.
 * @param  {string | RegExp}  pattern
 *     The pattern to trim from the left hand side.
 *
 * @returns  {string}
 *     The resulting string.
 *
 * @example
 * ltrim("***string***", "*"); // string***
 * ltrim("ababXabab", "ab"); // Xabab
 * ltrim("***string***", new RegExp("\\*")); // **string***
 * ltrim("***string***", new RegExp("\\*+")); // string***
 */
export function ltrim(string, pattern = "\\s") {
	if (!isNonEmptyString(string)) {
		return "";
	}

	if (!isNonEmptyString(pattern) && !(pattern instanceof RegExp)) {
		return string;
	}

	if (pattern === "\\s") {
		return string.trimStart();
	}

	if (pattern instanceof RegExp) {
		return string.replace(new RegExp(`^${pattern.source}`, "g"), "");
	}

	// Where the kept text starts, after the copies of the pattern at the start.
	let start = 0;

	while (string.startsWith(pattern, start)) {
		start += pattern.length;
	}

	return string.slice(start);
}
