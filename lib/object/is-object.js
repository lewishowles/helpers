/**
 * Determine if the provided variable is an object - excluding arrays and null.
 *
 * isObject({ property: "value" }); // true
 * isObject(['A', 'B', 'C', 'D']); // false
 * isObject(null); // false
 *
 * @param  {mixed}  variable
 *     The variable to test.
 */
export function isObject(variable) {
	return typeof variable === "object" && !Array.isArray(variable) && variable !== null;
}
