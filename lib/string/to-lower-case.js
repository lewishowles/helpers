import { isNonEmptyString } from "./is-non-empty-string";

/**
 * @helper toLowerCase
 * @category String
 * @signature toLowerCase(variable: string)
 * @description
 * A safe wrapper around `toLowerCase`, returning an empty string if the provided `variable` is not a string itself.
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
