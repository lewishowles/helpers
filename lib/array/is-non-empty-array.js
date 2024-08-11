/**
 * Determine whether the given variable is an array and has at least one entry.
 *
 * isNonEmptyArray(['A', 'B', 'C', 'D']); // true
 * isNonEmptyArray([]); // false
 * isNonEmptyArray("string"); // false
 *
 * @param  {mixed}  variable
 *	 The variable to test.
 */
export function isNonEmptyArray(variable) {
	return Array.isArray(variable) && variable.length > 0;
}
