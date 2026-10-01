/**
 * Check whether a value is a number other than NaN.
 *
 * @helper isNumber
 * @category Number
 * @signature isNumber(variable: any)
 * @description
 *     Determines whether the given `variable` is a number and not NaN.
 *
 * @param  {any}  variable
 *     The value to check.
 * @returns  {boolean}
 *     Whether the value is a number other than NaN.
 *
 * @example
 * isNumber(4); // true
 * isNumber(NaN); // false
 * isNumber("string"); // false
 */
export function isNumber(variable) {
	return typeof variable === "number" && !isNaN(variable);
}
