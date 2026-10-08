/**
 * Convert present values to numbers while preserving empty fields as null.
 *
 * @helper toNullableNumber
 * @category Number
 * @signature toNullableNumber(value: any)
 * @description
 * Coerces the given `value` to a number, returning `null` for empty string,
 * `null`, or `undefined`. Useful for form round-trips where absent numeric
 * fields should be `null` rather than `0` or `NaN`. Other values are passed to
 * `Number()` without validation, so text such as `"12px"` becomes `NaN` and a
 * string of spaces becomes `0`. Check the value with `isNumeric` first to
 * reject invalid or infinite input.
 *
 * @param  {any}  value
 *     The value to coerce.
 * @returns  {number|null}
 *     The converted number, or null for an absent value.
 *
 * @example
 * toNullableNumber("42"); // 42
 * toNullableNumber("12px"); // NaN
 * toNullableNumber(" "); // 0
 * toNullableNumber("Infinity"); // Infinity
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
