import { isNonEmptyString } from "./is-non-empty-string";

/**
 * A safer wrapper around `toUpperCase`, returning an empty string if the
 * provided variable is not itself a string.
 *
 * @param  {unknown}  string
 *     The value to lowercase
 */
export function toUpperCase(string) {
	if (!isNonEmptyString(string)) {
		return "";
	}

	return string.toUpperCase();
}
