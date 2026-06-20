import { deepCopy } from "./deep-copy";
import { isObject } from "./is-object";
import { toNumericIndex } from "./path-traversal";
import { isNonEmptyString } from "../string/is-non-empty-string";

/**
 * @helper setPathValue
 * @category Object
 * @signature setPathValue(object: object, path: string, value: any)
 * @description
 * Set an object property at `path`.
 *
 * @note
 * If any part of the path dot notation chain results in a non-object, no modifications are made.
 *
 * Objects will be created as necessary to reach the path specified.
 *
 * This method returns a copy of the object so as to not modify the original.
 *
 * @example
 * setPathValue({ a: 1 }, "b", 2); // { a: 1, b: 2 }
 * setPathValue({ a: 1 }, "b.c.d", 2); // { a: 1, b: { c: { d: 2 } } }
 * setPathValue({ a: 1, b: 2 }, "b.c.d", 4); // { a: 1, b: 2 }
 */
export function setPathValue(object, path, value) {
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
