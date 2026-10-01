/**
 * Convert present values to numbers while preserving empty fields as null.
 *
 * @helper toNullableNumber
 * @category Number
 * @signature toNullableNumber(value: any)
 * @description
 *     Coerces the given `value` to a number, returning `null` for empty string,
 *     `null`, or `undefined`. Useful for form round-trips where absent numeric
 *     fields should be `null` rather than `0` or `NaN`.
 *
 * @param  {any}  value
 *     The value to coerce.
 * @returns  {number|null}
 *     The converted number, or null for an absent value.
 *
 * @example
 * toNullableNumber("42"); // 42
 * toNullableNumber(""); // null
 * toNullableNumber(null); // null
 * toNullableNumber(undefined); // null
 */
export function toNullableNumber(value) {
	if (value === null || value === undefined || value === "") {
		return null;
	}

	return Number(value);
}
