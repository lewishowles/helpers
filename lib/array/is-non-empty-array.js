/**
 * @helper isNonEmptyArray
 * @category Array
 * @signature isNonEmptyArray(variable: any[])
 * @description
 * Determines whether the given `variable` is both an array and has at least one item.
 *
 * @example
 * isNonEmptyArray(["A", "B", "C", "D"]); // true
 * isNonEmptyArray([]); // false
 * isNonEmptyArray("string"); // false
 */
export function isNonEmptyArray(variable) {
	return Array.isArray(variable) && variable.length > 0;
}
