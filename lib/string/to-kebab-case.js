import { isNonEmptyString } from "./is-non-empty-string";
import { tokeniseWords } from "./tokenise-words";

/**
 * @helper toKebabCase
 * @category String
 * @signature toKebabCase(value: any)
 * @description
 *     Converts a string to kebab-case (lowercase words joined by hyphens).
 *     Handles camelCase, PascalCase, snake_case, SCREAMING_SNAKE_CASE, and
 *     mixed separators. Acronyms are split correctly (APIKey → api-key).
 *     Returns an empty string for non-string inputs.
 *
 * @param  {any}  value
 *     The value to convert to kebab-case.
 *
 * @returns  {string}
 *     The resulting string.
 *
 * @example
 * toKebabCase("camelCase"); // "camel-case"
 * toKebabCase("PascalCase"); // "pascal-case"
 * toKebabCase("APIKey"); // "api-key"
 * toKebabCase("item2Name"); // "item2-name"
 * toKebabCase("snake_case"); // "snake-case"
 * toKebabCase("already-kebab"); // "already-kebab"
 * toKebabCase(""); // ""
 * toKebabCase(42); // ""
 */
export function toKebabCase(value) {
	if (!isNonEmptyString(value)) {
		return "";
	}

	return tokeniseWords(value)
		.map((token) => token.toLowerCase())
		.join("-");
}
