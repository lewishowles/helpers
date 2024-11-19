import { isNonEmptyString } from "./is-non-empty-string";
import { isNumber } from "@number";
import { validateOrFallback } from "@general";

/**
 * Truncate a string to a given length. If the provided variable is not a
 * string, returns an empty string.
 *
 * @param  {unknown}  string
 *     The string to truncate
 * @param  {number}  length
 *     The length to truncate to
 * @param  {string}  options.decoration
 *     The string to use as decoration for the truncated string, if it is indeed
 *     truncated.
 * @param  {boolean}  options.includeDecoration
 *     Whether to include the length of the decoration in length calculations.
 * @param  {boolean}  options.preserveWords
 *     Whether to avoid truncating in the middle of a word.
 * @param  {boolean}  options.strict
 *     When preserving a word, if strict is enabled the string will be shortened
 *     if necessary to meet the length requirement. If strict is disabled, the
 *     string could be longer than the desired length.
 */
export function truncate(string, length = 10, { decoration = "…", includeDecoration = true, preserveWords = false, strict = true } = {}) {
	if (!isNonEmptyString(string)) {
		return "";
	}

	if (!isNumber(length) || string.length <= length) {
		return string;
	}

	decoration = validateOrFallback(decoration, isNonEmptyString, "…");

	// If we need to include the decoration in the length, modify our length
	// accordingly.
	if (includeDecoration === true) {
		length = length - decoration.length;
	}

	// If we don't need to preserve words, return the truncated string.
	if (!preserveWords) {
		return `${string.substring(0, length).trim()}${decoration}`;
	}

	// If we do need to preserve words, add words until we reach our limit.
	const words = string.split(" ");

	let truncatedString = "";

	for (const word of words) {
		// If we're in strict mode and adding a new word would break our length,
		// we stop.
		if (strict && truncatedString.length + word.length + 1 > length) {
			break;
		}

		const needsSeparator = truncatedString.length;

		truncatedString += (needsSeparator ? " " : "") + word;

		// If we're not in strict mode and our new length meets or exceeds our
		// required length, we can end.
		if (truncatedString.length >= length) {
			break;
		}
	}

	truncatedString.trim();

	return `${truncatedString}${decoration}`;
}
