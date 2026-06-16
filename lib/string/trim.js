import { isNonEmptyString } from "./is-non-empty-string";

/**
 * @helper trim
 * @category String
 * @signature trim(string, pattern: string | RegExp = "\\s")
 * @description
 * Trim both sides of `string` using the provided string or RegExp `pattern`. Trims whitespace by default.
 *
 * @example
 * trim("   string   "); // string
 * trim("* *string* *", "*"); // *string*
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

	// Determine our trim pattern, either a regex-safe string, or a RegExp.
	let trimPattern = pattern;
	// If using a string, we expand the pattern to remove all instances of the
	// string at either end. If using a RegExp, we do not, which gives the user
	// greater control.
	let expandPattern = !(pattern instanceof RegExp);

	if (isNonEmptyString(pattern) && pattern !== "\\s") {
		trimPattern = escapeRegExp(pattern);
	} else if (pattern instanceof RegExp) {
		trimPattern = pattern.source;
	}

	const adjustedTrimPattern = expandPattern ? `${trimPattern}+` : trimPattern;

	return string.replace(new RegExp(`^${adjustedTrimPattern}|${adjustedTrimPattern}$`, "g"), "");
}

/**
 * Escape special characters in a string intended for use in a regular
 * expression.
 *
 * @param  {string}  string
 *     The string to escape.
 * @returns  {string}
 *     The escaped string.
 */
export function escapeRegExp(string) {
	return string.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}
