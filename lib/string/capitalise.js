import { isNonEmptyString } from "./is-non-empty-string";

/**
 * @helper capitalise
 * @category String
 * @signature capitalise(value: any)
 * @description
 * Returns the string with the first character uppercased and the remaining
 * characters unchanged. Handles surrogate pairs correctly by iterating code
 * points rather than UTF-16 code units. Returns an empty string if the provided
 * `value` is not a non-empty string.
 *
 * @param  {any}  value
 *     The value to capitalise.
 *
 * @example
 * capitalise("hello world"); // "Hello world"
 * capitalise("HELLO"); // "HELLO"
 * capitalise("a"); // "A"
 * capitalise(""); // ""
 * capitalise(42); // ""
 * capitalise("über"); // "Über"
 * capitalise("αβγ"); // "Αβγ"
 */
export function capitalise(value) {
	if (!isNonEmptyString(value)) {
		return "";
	}

	const [first, ...rest] = value;

	return first.toUpperCase() + rest.join("");
}
