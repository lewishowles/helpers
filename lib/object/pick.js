import { isNonEmptyArray } from "@array";
import { isNonEmptyObject } from "@object";

/**
 * Retrieve the given properties from the provided object.
 *
 * If a property does not exist on the object, it is ignored.
 *
 * @param  {object}  object
 *     The object from which to pick properties.
 * @param  {array}  properties
 *     The properties to pick.
 */
export function pick(object, properties) {
	if (!isNonEmptyObject(object) || !isNonEmptyArray(properties)) {
		return {};
	}

	return properties.reduce((newObject, property) => {
		if (Object.hasOwn(object, property)) {
			newObject[property] = object[property];
		}

		return newObject;
	}, {});
}
