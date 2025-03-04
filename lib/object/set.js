import { deepCopy } from "./deep-copy";
import { isNonEmptyString } from "@string";
import { isObject } from "./is-object";

/**
 * Set an (optionally deeply nested) object property.
 *
 * If any part of the path dot notation chain results in a non-object, no
 * modifications are made.
 *
 * Objects will be created as necessary to reach the path specified.
 *
 * This method returns a copy of the object so as to not modify the original.
 *
 * @param  {object}  object
 *     The object to modify
 *
 * @param  {string}  path
 *     The path at which to set the value
 *
 * @param  {any}  value
 *     The value to set at that path
 */
export function set(object, path, value) {
	if (!isObject(object) || !isNonEmptyString(path)) {
		return object;
	}

	const keys = path.split(".");

	const modifiedObject = deepCopy(object);

	let progress = modifiedObject;

	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		const isLastKey = i === keys.length - 1;

		if (isLastKey) {
			progress[key] = value;
		} else if (!Object.hasOwn(progress, key)) {
			progress[key] = {};
		} else if (!isObject(progress[key])) {
			break;
		}

		progress = progress[key];
	}

	return modifiedObject;
}
