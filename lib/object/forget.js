import { deepCopy } from "./deep-copy";
import { isNonEmptyString } from "@string";
import { isObject } from "./is-object";

/**
 * Remove an (optionally deeply nested) item from an object.
 *
 * This method makes a copy of the provided object to not modify the original.
 *
 * @param  {object}  object
 *     The object to modify
 *
 * @param  {string}  path
 *     The path to the key to remove
 */
export function forget(object, path) {
	if (!isObject(object)) {
		return object;
	}

	const modifiedObject = deepCopy(object);

	if (!isNonEmptyString(path)) {
		return modifiedObject;
	}

	let progress = modifiedObject;

	// Traverse through our object until we find the key at the specified path.
	const pathParts = path.split(".");

	pathParts.forEach((pathPart, index) => {
		const isLastItem = index === pathParts.length - 1;

		if (!isObject(progress)) {
			return;
		}

		if (isLastItem) {
			delete progress[pathPart];
		} else {
			progress = progress[pathPart];
		}
	});

	return modifiedObject;
}
