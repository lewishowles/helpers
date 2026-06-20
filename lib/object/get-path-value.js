import { isNonEmptyObject } from "./is-non-empty-object";
import { NOT_FOUND, traversePath } from "./path-traversal";
import { isNonEmptyString } from "../string/is-non-empty-string";

/**
 * @helper getPathValue
 * @category Object
 * @signature getPathValue(object: object, path: string, returnValue: any = undefined)
 * @description
 * Retrieve the `object` property value found at `path`, or `returnValue`.
 *
 * @example
 * getPathValue({ property: "value" }, "property"); // "value"
 * getPathValue({ property: "value" }, "another"); // undefined
 * getPathValue({ nested: { property: { value: "seven" } } }, "nested.property.value"); // "seven"
 * getPathValue({ nested: { property: { value: "seven" } } }, "nested.mistake.value", null); // null
 * getPathValue([], "property"); // undefined
 */
export function getPathValue(object, path, returnValue = undefined) {
	if (!isNonEmptyObject(object) || !isNonEmptyString(path)) {
		return returnValue;
	}

	const result = traversePath(object, path.split("."));

	return result === NOT_FOUND ? returnValue : result;
}
