/**
 * Determine whether the given variable is a number, and not NaN.
 *
 * isNumber(4); // true
 * isNumber(NaN); // false
 * isNumber("string"); // false
 *
 * @param  {unknown}  variable
 *     The variable to test.
 */
export function isNumber(variable) {
	return typeof variable === "number" && !isNaN(variable);
}
