import { isNonEmptyString } from "./is-non-empty-string";

/**
 * @helper toUpperCase
 * @category String
 * @signature toUpperCase(string: any)
 * @description
 *     A safe wrapper around `toUpperCase`, returning an empty string if the
 *     provided `string` is not a string itself.
 *
 * @param  {any}  string
 *     The string to convert.
 *
 * @returns  {string}
 *     The uppercase string, or an empty string when `string` is not a string.
 *
 * @example
 * toUpperCase("string"); // "STRING"
 * toUpperCase(""); // ""
 * toUpperCase(["A", "B"]); // ""
 */
export function toUpperCase(string) {
	if (!isNonEmptyString(string)) {
		return "";
	}

	return string.toUpperCase();
}
