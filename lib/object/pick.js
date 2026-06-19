import { isNonEmptyObject } from "./is-non-empty-object";
import { isNonEmptyArray } from "../array/is-non-empty-array";

/**
 * @helper pick
 * @category Object
 * @signature pick(object: object, properties: string[])
 * @description
 * Returns an object containing only `properties` properties from `object`.
 *
 * @note
 * Any non-string properties are ignored.
 *
 * If the object does not have a given property, it is ignored.
 *
 * @example
 * pick({ a: "one", b: "two", c: "three" }, ["a", "b"]); // { a: "one", b: "two" }
 * pick({ a: "one", b: "two", c: "three" }, ["a"]); // { a: "one" }
 * pick({ a: "one", b: "two", c: "three" }, ["a", "d"]); // { a: "one" }
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
