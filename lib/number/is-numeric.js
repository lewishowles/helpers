/**
 * @helper isNumeric
 * @category Number
 * @signature isNumeric(variable: any)
 * @description
 * Determines whether the given `variable` is a number, or a string containing a number.
 *
 * @example
 * isNumeric(4); // true
 * isNumeric(NaN); // false
 * isNumeric("string"); // false
 * isNumeric("10e3"); // true
 * isNumeric("5.6"); // true
 */
export function isNumeric(value) {
	return !isNaN(parseFloat(value)) && isFinite(value);
}
