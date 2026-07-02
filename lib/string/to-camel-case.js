import { isNonEmptyString } from "./is-non-empty-string";
import { tokeniseWords } from "./tokenise-words";

/**
 * @helper toCamelCase
 * @category String
 * @signature toCamelCase(value: any)
 * @description
 * Converts a string to camelCase (first word lowercase, subsequent words
 * capitalised, no separators). Handles kebab-case, PascalCase, snake_case,
 * SCREAMING_SNAKE_CASE, and mixed separators. Acronyms are normalised
 * (APIKey → apiKey). Returns an empty string for non-string inputs.
 *
 * @example
 * toCamelCase("kebab-case"); // "kebabCase"
 * toCamelCase("PascalCase"); // "pascalCase"
 * toCamelCase("APIKey"); // "apiKey"
 * toCamelCase("item2Name"); // "item2Name"
 * toCamelCase("snake_case"); // "snakeCase"
 * toCamelCase(""); // ""
 * toCamelCase(42); // ""
 */
export function toCamelCase(value) {
	if (!isNonEmptyString(value)) {
		return "";
	}

	return tokeniseWords(value)
		.map((token, index) => {
			const lower = token.toLowerCase();

			return index === 0 ? lower : lower.charAt(0).toUpperCase() + lower.slice(1);
		})
		.join("");
}
