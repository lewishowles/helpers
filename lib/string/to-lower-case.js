import { isNonEmptyString } from "./is-non-empty-string";

/**
 * @helper toLowerCase
 * @category String
 * @signature toLowerCase(string: any)
 * @description
 * A safe wrapper around `toLowerCase`, returning an empty string if the
 * provided `string` is not a string itself.
 *
 * @param  {any}  string
 *     The string to convert.
 *
 * @returns  {string}
 *     The lowercase string, or an empty string when `string` is not a string.
 *
 * @example
 * toLowerCase("String"); // string
 * toLowerCase(""); // ""
 * toLowerCase(["A", "B"]); // ""
 */
export function toLowerCase(string) {
	if (!isNonEmptyString(string)) {
		return "";
	}

	return string.toLowerCase();
}
