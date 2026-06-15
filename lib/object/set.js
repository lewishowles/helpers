import { deepCopy } from "./deep-copy";
import { isNonEmptyString } from "@string";
import { isObject } from "./is-object";
import { toNumericIndex } from "./path-traversal";

/**
 * Set an (optionally deeply nested) object property.
 *
 * If any part of the path dot notation chain results in a non-object or
 * non-array, no modifications are made. Numeric segments traverse arrays, e.g.
 * "users.0.name". Intermediate objects are created as necessary.
 *
 * This method returns a copy of the provided object.
 *
 * @param  {object}  object
 *     The object to copy and modify.
 *
 * @param  {string}  path
 *     The path at which to set the value.
 *
 * @param  {any}  value
 *     The value to set at that path.
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

		if (Array.isArray(progress)) {
			const index = toNumericIndex(key);

			if (index === null) {
				break;
			}

			if (isLastKey) {
				progress[index] = value;
			} else if (!isObject(progress[index]) && !Array.isArray(progress[index])) {
				break;
			}

			progress = progress[index];
		} else if (isObject(progress)) {
			if (isLastKey) {
				progress[key] = value;
			} else if (!Object.hasOwn(progress, key)) {
				progress[key] = {};
			} else if (!isObject(progress[key]) && !Array.isArray(progress[key])) {
				break;
			}

			progress = progress[key];
		} else {
			break;
		}
	}

	return modifiedObject;
}
