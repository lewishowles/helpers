import { deepCopy } from "./deep-copy";
import { isObject } from "./is-object";
import { NOT_FOUND, traversePath } from "./path-traversal";
import { isNonEmptyString } from "../string/is-non-empty-string";

/**
 * @helper forget
 * @category Object
 * @signature forget(object: object, path: string)
 * @description
 * Remove an (optionally deeply nested) item from an object. This method makes a copy of the provided object to not modify the original.
 *
 * @example
 * forget({ key: "value" }, "key") // {}
 * forget({ key: "value" }, "another") // { key: "value" }
 * forget({ key: "value", one: { two: { three: "three" } } }, "one.two.three") // { key: "value", one: { two: {} } }
 * forget({ key: "value", one: { two "two" } }, "one.two.three") // { key: "value", one: { two: "two" } }
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
