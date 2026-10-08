/**
 * Check whether a value represents a finite number.
 *
 * @helper isNumeric
 * @category Number
 * @signature isNumeric(value: any)
 * @description
 * Determines whether the given `value` is a finite number or a string
 * containing one. Surrounding spaces are allowed, but `Infinity` is rejected
 * whether it is passed as a number or a string.
 *
 * @param  {any}  value
 *     The value to check.
 * @returns  {boolean}
 *     Whether the value can be read as a finite number.
 *
 * @example
 * isNumeric(4); // true
 * isNumeric(Infinity); // false
 * isNumeric("Infinity"); // false
 * isNumeric(" 12 "); // true
 * isNumeric(NaN); // false
 * isNumeric("string"); // false
 * isNumeric("10e3"); // true
 * isNumeric("5.6"); // true
 */
export function isNumeric(value) {
	return !isNaN(parseFloat(value)) && isFinite(value);
}
