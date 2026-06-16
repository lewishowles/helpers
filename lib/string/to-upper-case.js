import { isNonEmptyString } from "./is-non-empty-string";

/**
 * @helper toUpperCase
 * @category String
 * @signature toUpperCase(variable: string)
 * @description
 * A safe wrapper around `toUpperCase`, returning an empty string if the provided `variable` is not a string itself.
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
