import { isNonEmptyString } from "./is-non-empty-string";
import { tokeniseWords } from "./tokenise-words";

/**
 * @helper toSnakeCase
 * @category String
 * @signature toSnakeCase(value: any)
 * @description
 * Converts a string to snake_case (lowercase words joined by underscores).
 * Handles camelCase, PascalCase, kebab-case, SCREAMING_SNAKE_CASE, and mixed
 * separators. Acronyms are split correctly (APIKey → api_key). Returns an
 * empty string for non-string inputs.
 *
 * @example
 * toSnakeCase("camelCase"); // "camel_case"
 * toSnakeCase("PascalCase"); // "pascal_case"
 * toSnakeCase("APIKey"); // "api_key"
 * toSnakeCase("item2Name"); // "item2_name"
 * toSnakeCase("kebab-case"); // "kebab_case"
 * toSnakeCase(""); // ""
 * toSnakeCase(42); // ""
 */
export function toSnakeCase(value) {
	if (!isNonEmptyString(value)) {
		return "";
	}

	return tokeniseWords(value)
		.map((token) => token.toLowerCase())
		.join("_");
}
