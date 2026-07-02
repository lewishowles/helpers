import { isNonEmptyString } from "./is-non-empty-string";
import { tokeniseWords } from "./tokenise-words";

/**
 * @helper toScreamingSnakeCase
 * @category String
 * @signature toScreamingSnakeCase(value: any)
 * @description
 * Converts a string to SCREAMING_SNAKE_CASE (uppercase words joined by
 * underscores). Handles camelCase, PascalCase, kebab-case, snake_case, and
 * mixed separators. Acronyms are split correctly (APIKey → API_KEY). Returns
 * an empty string for non-string inputs.
 *
 * @example
 * toScreamingSnakeCase("camelCase"); // "CAMEL_CASE"
 * toScreamingSnakeCase("PascalCase"); // "PASCAL_CASE"
 * toScreamingSnakeCase("APIKey"); // "API_KEY"
 * toScreamingSnakeCase("item2Name"); // "ITEM2_NAME"
 * toScreamingSnakeCase("kebab-case"); // "KEBAB_CASE"
 * toScreamingSnakeCase(""); // ""
 * toScreamingSnakeCase(42); // ""
 */
export function toScreamingSnakeCase(value) {
	if (!isNonEmptyString(value)) {
		return "";
	}

	return tokeniseWords(value)
		.map((token) => token.toUpperCase())
		.join("_");
}
