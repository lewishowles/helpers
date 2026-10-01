/**
 * Check whether a value is an array with at least one item.
 *
 * @helper isNonEmptyArray
 * @category Array
 * @signature isNonEmptyArray(variable: any[])
 * @description
 *     Determines whether the given `variable` is both an array and has at least
 *     one item.
 *
 * @param  {any[]}  variable
 *     The value to check.
 * @returns  {boolean}
 *     Whether the value is a non-empty array.
 *
 * @example
 * isNonEmptyArray(["A", "B", "C", "D"]); // true
 * isNonEmptyArray([]); // false
 * isNonEmptyArray("string"); // false
 */
export function isNonEmptyArray(variable) {
	return Array.isArray(variable) && variable.length > 0;
}
