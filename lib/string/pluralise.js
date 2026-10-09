import { isNumeric } from "#number/is-numeric";
import { isNonEmptyString } from "./is-non-empty-string";

/**
 * @helper pluralise
 * @category String
 * @signature pluralise(count: number | string, singular: string, plural?: string)
 * @description
 * Choose the singular or plural form of an English word for a count. The result
 * is the word only, so callers place and format the count themselves.
 *
 * @param  {number | string}  count
 *     The count to choose a form for. A numeric string is read as its number.
 * @param  {string}  singular
 *     The word to use when the count is exactly one.
 * @param  {string}  [plural]
 *     The word to use for any other count. Defaults to the singular followed by
 *     "s".
 *
 * @returns  {string}
 *     The singular form when the count is exactly one, otherwise the plural
 *     form, or an empty string when the singular is missing, empty or not a
 *     string.
 *
 * @note
 * Zero, negative numbers and decimals use the plural form. A count that is not
 * numeric, such as "abc", null, undefined, NaN or Infinity, also uses the
 * plural form. Only English singular and plural forms are supported.
 *
 * @example
 * pluralise(1, "item"); // "item"
 * pluralise(3, "item"); // "items"
 * pluralise(0, "item"); // "items"
 * pluralise("1", "item"); // "item"
 * pluralise(2, "person", "people"); // "people"
 * pluralise(null, "item"); // "items"
 * pluralise(1, ""); // ""
 */
export function pluralise(count, singular, plural) {
	if (!isNonEmptyString(singular)) {
		return "";
	}

	if (isNumeric(count) && Number(count) === 1) {
		return singular;
	}

	return isNonEmptyString(plural) ? plural : `${singular}s`;
}
