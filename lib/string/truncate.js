import { isNonEmptyString } from "./is-non-empty-string";
import { isNumber } from "../number/is-number";
import { validateOrFallback } from "../general/validate-or-fallback";

/**
 * @helper truncate
 * @category String
 * @signature truncate(string: string, length: number = 10, { decoration: string = "…", preserveWords: boolean = false, strict: boolean = true, includeDecoration: boolean = true })
 * @description
 * Truncate a string to a given length, with various options for how the truncation occurs.
 *
 * @note
 * If the provided variable is not a string, returns an empty string.
 *
 * - `length`: The length to truncate the string to
 * - `decoration`: The decoration to append to the string if it is truncated
 * - `includeDecoration`: Whether to include the length of the decoration in length calculations
 * - `preserveWords`: Whether to avoid breaking a word during truncation
 * - `strict`: When preserving words, if strict the resulting length will be less than the desired length
 *
 * @example
 * truncate("Hello, world!"); // "Hello, wo…"
 * truncate("Hello, world!", 15); // "Hello, world!"
 * truncate("Hello, world!", 8); // "Hello, …"
 * truncate("Hello, world!", 8, { preserveWords: true }); // "Hello,…"
 * truncate(["A", "B"]); // ""
 */
export function truncate(
	string,
	length = 10,
	{ decoration = "…", includeDecoration = true, preserveWords = false, strict = true } = {},
) {
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
