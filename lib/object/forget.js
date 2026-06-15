import { deepCopy } from "./deep-copy";
import { isNonEmptyString } from "@string";
import { isObject } from "./is-object";
import { NOT_FOUND, traversePath } from "./path-traversal";

/**
 * Remove an (optionally deeply nested) item from an object.
 *
 * Numeric segments traverse arrays to reach a nested object, e.g.
 * "users.0.name". Deletion of array elements directly is not supported, the
 * path must resolve to a key on a plain object.
 *
 * This method returns a copy of the provided object.
 *
 * @param  {object}  object
 *     The object to copy and modify.
 *
 * @param  {string}  path
 *     The path to the key to remove.
 */
export function forget(object, path) {
	if (!isObject(object)) {
		return object;
	}

	const modifiedObject = deepCopy(object);

	if (!isNonEmptyString(path)) {
		return modifiedObject;
	}

	// The segments of the provided path.
	const segments = path.split(".");
	// The segments that get us to the parent of the final key.
	const parentSegments = segments.slice(0, -1);
	// The final key itself.
	const lastKey = segments[segments.length - 1];

	let parent;

	// If the provided path is just a property of the provided object (e.g.
	// "name"), use our modified object directly.
	if (parentSegments.length === 0) {
		parent = modifiedObject;
	} else {
		parent = traversePath(modifiedObject, parentSegments);
	}

	if (parent === NOT_FOUND || !isObject(parent)) {
		return modifiedObject;
	}

	delete parent[lastKey];

	return modifiedObject;
}
