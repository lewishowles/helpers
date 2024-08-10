/**
 * Determine whether the given variable is a string and has a non-zero length.
 *
 * @param  {mixed}  variable
 *     The variable to test.
 */
export function isNonEmptyString(variable) {
	return typeof variable === "string" && variable.length > 0;
}
