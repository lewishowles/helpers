import { isNonEmptyObject } from "./is-non-empty-object";
import { isNonEmptyString } from "@string";

/**
 * Add a key / value pair to an object without overwriting any existing value.
 * That is, only if that key isn't already present, or if its value is
 * undefined or null.
 *
 * @param  {object}  object
 *     The object to modify.
 * @param  {string}  key
 *     The key to add.
 * @param  {any}  value
 *     The value to add.
 */
export function add(object, key, value) {
	if (!isNonEmptyObject(object)) {
		return {};
	}

	if (!isNonEmptyString(key)) {
		return object;
	}

	if ([undefined, null].includes(object[key])) {
		object[key] = value;
	}

	return object;
}
