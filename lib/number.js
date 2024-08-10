/**
 * Determine whether the given variable is a number, and not NaN.
 *
 * @param  {mixed}  variable
 *     The variable to test.
 */
export function isNumber(variable) {
	return typeof variable === "number" && !isNaN(variable);
}
