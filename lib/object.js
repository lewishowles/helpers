/**
 * Determine whether the given variable is an object and has at least one
 * property.
 *
 * @param  {mixed}  variable
 *     The variable to test.
 */
export function isNonEmptyObject(variable) {
	return !Array.isArray(variable) && variable !== null && typeof variable === "object" && Object.keys(variable).length > 0;
}
