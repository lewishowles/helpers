import { isNonEmptyObject } from "./is-non-empty-object";
import { isNonEmptyString } from "@string";
import { NOT_FOUND, traversePath } from "./path-traversal";

/**
 * Given an object and a path to a property, returns that property value, or
 * null. The path can be nested to any depth using dot notation. Numeric
 * segments traverse arrays, e.g. "users.0.name".
 *
 * If the property doesn't exist, or the input is not an object, returns null.
 *
 * get({ property: "value" }, "property"); // "value"
 * get({ nested: { property: { value: "seven" } } }, "nested.property.value"); // "seven"
 * get({ nested: { property: { value: "seven" } } }, "nested.mistake.value"); // null
 * get({ users: [{ name: "Sophie" }] }, "users.0.name"); // "Sophie"
 * get([], "property"); // null
 *
 * @param  {object}  object
 *     The object from which to retrieve the value.
 *
 * @param  {string}  path
 *     The path to the property to retrieve, using dot notation.
 *
 * @param  {any}  returnValue
 *     The value to return when the property is not found.
 */
export function get(object, path, returnValue = null) {
	if (!isNonEmptyObject(object) || !isNonEmptyString(path)) {
		return returnValue;
	}

	const result = traversePath(object, path.split("."));

	return result === NOT_FOUND ? returnValue : result;
}
