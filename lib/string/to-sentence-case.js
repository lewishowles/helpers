import { capitalise } from "./capitalise";
import { isNonEmptyString } from "./is-non-empty-string";
import { tokeniseWords } from "./tokenise-words";

/**
 * @helper toSentenceCase
 * @category String
 * @signature toSentenceCase(value: any)
 * @description
 * Converts a string to sentence case. Splits camelCase, snake_case, hyphens and
 * extra spaces into words, then lowercases every word, acronyms included, and
 * joins them with single spaces. The value is treated as one label, so only its
 * first letter is capitalised. Returns an empty string for non-string inputs.
 *
 * @param  {any}  value
 *     The value to convert to sentence case.
 *
 * @returns  {string}
 *     The resulting string.
 *
 * @example
 * toSentenceCase("helloWorld"); // "Hello world"
 * toSentenceCase("user_id"); // "User id"
 * toSentenceCase("HTMLParser"); // "Html parser"
 * toSentenceCase("NASA launch"); // "Nasa launch"
 * toSentenceCase(42); // ""
 */
export function toSentenceCase(value) {
	if (!isNonEmptyString(value)) {
		return "";
	}

	// The label with every word lowercased, acronyms included, so that only
	// its first letter ends up as a capital.
	const lowercaseLabel = tokeniseWords(value)
		.map((word) => word.toLowerCase())
		.join(" ");

	return capitalise(lowercaseLabel);
}
