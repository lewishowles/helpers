import { isObject } from "./is-object";

/**
 * Determine whether the given variable is an object and has at least one
 * property.
 *
 * isNonEmptyObject({ property: "value" }); // true
 * isNonEmptyObject({}); // false
 * isNonEmptyObject("string"); // false
 *
 * @param  {mixed}  variable
 *     The variable to test.
 */
export function isNonEmptyObject(variable) {
	return isObject(variable) && Object.keys(variable).length > 0;
}
