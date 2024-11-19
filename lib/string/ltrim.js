import { escapeRegExp } from "./trim";
import { isNonEmptyString } from "./is-non-empty-string";

/**
 * Trim the provided string from the left hand side of a string.
 *
 * If a string pattern is provided, all instances of that pattern are removed
 * from each end. If a RegExp pattern is provided, the RegExp itself controls
 * what is removed.
 *
 * @param  {string}  string
 *     The string to trim.
 * @param  {string|RegExp}  [pattern="\\s"]
 *     The string or regex to trim.
 * @returns  {string}
 *     The trimmed string.
 */
export function ltrim(string, pattern = "\\s") {
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

	return string.replace(new RegExp(`^${adjustedTrimPattern}`, "g"), "");
}
