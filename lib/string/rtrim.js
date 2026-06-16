import { escapeRegExp } from "./trim";
import { isNonEmptyString } from "./is-non-empty-string";

/**
 * @helper rtrim
 * @category String
 * @signature rtrim(string: string, pattern: string | RegExp = "\\s")
 * @description
 * Trim the right hand side of `string` using the provided string or RegExp `pattern`. Trims whitespace by default.
 *
 * @example
 * rtrim("***string***", "*"); // ***string**
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

	return string.replace(new RegExp(`${adjustedTrimPattern}$`, "g"), "");
}
