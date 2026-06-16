// We import directly from is-object here to avoid circular dependencies,
// importing from the root object.js, while that file imports this.
import { isObject } from "./is-object";

/**
 * @helper isNonEmptyObject
 * @category Object
 * @signature isNonEmptyObject(variable: any)
 * @description
 * Determines whether the given `variable` is both an object (and not null, or an array), and has at least one property.
 *
 * @example
 * isNonEmptyObject({ property: "value" }); // true
 * isNonEmptyObject({}); // false
 * isNonEmptyObject("string"); // false
 */
export function isNonEmptyObject(variable) {
	return isObject(variable) && Object.keys(variable).length > 0;
}
