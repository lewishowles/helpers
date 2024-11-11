/**
 * Determine whether a value is numeric. That is, either it is a number, or a
 * string containing a number.
 *
 * @param  {unknown}  value
 *     The value to test.
 */
export function isNumeric(value) {
	return !isNaN(parseFloat(value)) && isFinite(value);
}
