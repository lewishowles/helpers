/**
 * @helper isFunction
 * @category General
 * @signature isFunction(variable: any)
 * @description
 * Determines whether the given `variable` is a function.
 *
 * @example
 * isFunction(() => "Hello"); // true
 * isFunction("function"); // false
 * isFunction(5); // false
 */
export function isFunction(variable) {
	return typeof variable === "function";
}
