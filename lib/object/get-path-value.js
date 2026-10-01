import { isNonEmptyString } from "#string/is-non-empty-string";
import { isNonEmptyObject } from "./is-non-empty-object";
import { NOT_FOUND, traversePath } from "./path-traversal";

/**
 * @helper getPathValue
 * @category Object
 * @signature getPathValue(object: object, path: string, returnValue: any = undefined)
 * @description
 *     Retrieve the `object` property value found at `path`, or `returnValue`.
 *
 * @param  {object}  object
 *     The object to inspect.
 * @param  {string}  path
 *     The dot-notation path to retrieve.
 * @param  {any}  returnValue
 *     The fallback value when the path cannot be resolved.
 *
 * @returns  {any}
 *     The path value, or the fallback when the path cannot be found.
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

	// The value found while traversing the path.
	const result = traversePath(object, path.split("."));

	return result === NOT_FOUND ? returnValue : result;
}
