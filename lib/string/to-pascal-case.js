import { isNonEmptyString } from "./is-non-empty-string";
import { tokeniseWords } from "./tokenise-words";

/**
 * @helper toPascalCase
 * @category String
 * @signature toPascalCase(value: any)
 * @description
 *     Converts a string to PascalCase (each word capitalised, no separators).
 *     Handles camelCase, kebab-case, snake_case, SCREAMING_SNAKE_CASE, and
 *     mixed separators. Acronyms are normalised (APIKey → ApiKey). Returns an
 *     empty string for non-string inputs.
 *
 * @param  {any}  value
 *     The value to convert to PascalCase.
 *
 * @returns  {string}
 *     The resulting string.
 *
 * @example
 * toPascalCase("camelCase"); // "CamelCase"
 * toPascalCase("kebab-case"); // "KebabCase"
 * toPascalCase("APIKey"); // "ApiKey"
 * toPascalCase("item2Name"); // "Item2Name"
 * toPascalCase("snake_case"); // "SnakeCase"
 * toPascalCase(""); // ""
 * toPascalCase(42); // ""
 */
export function toPascalCase(value) {
	if (!isNonEmptyString(value)) {
		return "";
	}

	return tokeniseWords(value)
		.map((token) => {
			// Use lowercase text while building the converted word.
			const lower = token.toLowerCase();

			return lower.charAt(0).toUpperCase() + lower.slice(1);
		})
		.join("");
}
