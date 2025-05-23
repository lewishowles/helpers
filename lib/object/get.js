import { isNonEmptyObject } from "./is-non-empty-object";
import { isNonEmptyString } from "@string";

/**
 * Given an object and a path to a property, returns that property value, or
 * null. The property can be a nested to any depth using dot notation.
 *
 * If the property doesn't exist, or the input is not an object, returns null.
 *
 * get({ property: "value" }, "property"); // "value"
 * get({ nested: { property: { value: "seven" } } }, "nested.property.value"); // "seven"
 * get({ nested: { property: { value: "seven" } } }, "nested.mistake.value"); // null
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

	return path.split(".").reduce((objectAccumulator, pathPart) => {
		if (isNonEmptyObject(objectAccumulator) && Object.hasOwn(objectAccumulator, pathPart)) {
			return objectAccumulator[pathPart];
		}

		return returnValue;
	}, object);
}
