import { isNonEmptyString } from "./is-non-empty-string";

/**
 * @helper rtrim
 * @category String
 * @signature rtrim(string: string, pattern: string | RegExp = "\\s")
 * @description
 * Trim the right hand side of `string` using the provided string or RegExp
 * `pattern`. Removes whole repeated copies of a string pattern. Trims
 * whitespace by default.
 *
 * @param  {string}  string
 *     The string to trim.
 * @param  {string | RegExp}  pattern
 *     The pattern to trim from the right hand side.
 *
 * @returns  {string}
 *     The resulting string.
 *
 * @example
 * rtrim("***string***", "*"); // ***string
 * rtrim("ababXabab", "ab"); // ababX
 * rtrim("***string***", new RegExp("\\*")); // ***string**
 * rtrim("***string***", new RegExp("\\*+")); // ***string
 */
export function rtrim(string, pattern = "\\s") {
	if (!isNonEmptyString(string)) {
		return "";
	}

	if (!isNonEmptyString(pattern) && !(pattern instanceof RegExp)) {
		return string;
	}

	if (pattern === "\\s") {
		return string.trimEnd();
	}

	if (pattern instanceof RegExp) {
		return string.replace(new RegExp(`${pattern.source}$`, "g"), "");
	}

	// Where the kept text ends, before the copies of the pattern at the end.
	let end = string.length;

	while (string.endsWith(pattern, end)) {
		end -= pattern.length;
	}

	return string.slice(0, end);
}
