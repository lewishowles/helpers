/**
 * @helper isPlainObject
 * @category Object
 * @signature isPlainObject(variable: any)
 * @description
 * Determine whether the given `variable` is a plain object literal, excluding arrays, `null`,
 * and non-plain objects such as `Date`, `Map`, `Set`, or class instances.
 *
 * @example
 * isPlainObject({ property: "value" }); // true
 * isPlainObject(["A", "B", "C", "D"]); // false
 * isPlainObject(new Date()); // false
 * isPlainObject(null); // false
 */
export function isPlainObject(variable) {
	return (
		variable !== null &&
		typeof variable === "object" &&
		!Array.isArray(variable) &&
		variable.constructor === Object
	);
}
