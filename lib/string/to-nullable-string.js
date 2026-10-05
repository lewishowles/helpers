/**
 * @helper toNullableString
 * @category String
 * @signature toNullableString(value: any)
 * @description
 * Coerces the given `value` to a string, returning an empty string for `null`
 * or `undefined`. Useful for form round-trips where absent string fields should
 * be `""` rather than `"null"` or `"undefined"`.
 *
 * @param  {any}  value
 *     The value to coerce to a string.
 *
 * @returns  {string}
 *     The resulting string.
 *
 * @example
 * toNullableString("hello"); // "hello"
 * toNullableString(42); // "42"
 * toNullableString(null); // ""
 * toNullableString(undefined); // ""
 */
export function toNullableString(value) {
	if (value === null || value === undefined) {
		return "";
	}

	return String(value);
}
