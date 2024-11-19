import { isNonEmptyString } from "./is-non-empty-string";

/**
 * A safer wrapper around `toLowerCase`, returning an empty string if the
 * provided variable is not itself a string.
 *
 * @param  {unknown}  string
 *     The value to lowercase
 */
export function toLowerCase(string) {
	if (!isNonEmptyString(string)) {
		return "";
	}

	return string.toLowerCase();
}
