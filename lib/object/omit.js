import { isNonEmptyArray } from "@array";
import { isNonEmptyObject } from "./is-non-empty-object";

/**
 * Omit the given properties from the provided object.
 *
 * If a property does not exist on the object, it is ignored.
 *
 * @param  {object}  object
 *     The object from which to omit properties.
 * @param  {array}  properties
 *     The properties to omit.
 */
export function omit(object, properties) {
	if (!isNonEmptyObject(object) || !isNonEmptyArray(properties)) {
		return object;
	}

	return Object.keys(object).reduce((newObject, key) => {
		if (!properties.includes(key)) {
			newObject[key] = object[key];
		}

		return newObject;
	}, {});
}
