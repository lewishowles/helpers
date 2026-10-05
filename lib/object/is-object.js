/**
 * @helper isObject
 * @category Object
 * @signature isObject(variable: any)
 * @description
 * Determine whether the given `variable` is an object, excluding arrays and
 * null.
 *
 * @param  {any}  variable
 *     The value to check.
 *
 * @returns  {boolean}
 *     Whether the value is a non-null object that is not an array.
 *
 * @example
 * isObject({ property: "value" }); // true
 * isObject(["A", "B", "C", "D"]); // false
 * isObject(null); // false
 */
export function isObject(variable) {
	return typeof variable === "object" && !Array.isArray(variable) && variable !== null;
}
