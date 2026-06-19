import { isNonEmptyObject } from "./is-non-empty-object";
import { NOT_FOUND, traversePath } from "./path-traversal";
import { isNonEmptyString } from "../string/is-non-empty-string";

/**
 * @helper get
 * @category Object
 * @signature get(object: object, path: string, returnValue: any = null)
 * @description
 * Retrieve the `object` property value found at `path`, or `returnValue`.
 *
 * @example
 * get({ property: "value" }, "property"); // "value"
 * get({ property: "value" }, "another", undefined); // undefined
 * get({ nested: { property: { value: "seven" } } }, "nested.property.value"); // "seven"
 * get({ nested: { property: { value: "seven" } } }, "nested.mistake.value"); // null
 * get([], "property"); // null
 */
export function get(object, path, returnValue = null) {
	if (!isNonEmptyObject(object) || !isNonEmptyString(path)) {
		return returnValue;
	}

	const result = traversePath(object, path.split("."));

	return result === NOT_FOUND ? returnValue : result;
}
