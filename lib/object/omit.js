import { isNonEmptyObject } from "./is-non-empty-object";
import { isNonEmptyArray } from "../array/is-non-empty-array";

/**
 * @helper omit
 * @category Object
 * @signature omit(object: object, properties: string[])
 * @description
 * Returns a new object with the specified `properties` omitted from the given `object`.
 *
 * @example
 * omit({ a: 1, b: 2, c: 3 }, ["b"]); // { a: 1, c: 3 }
 * omit({ a: 1, b: 2, c: 3 }, ["a", "c"]); // { b: 2 }
 * omit({ a: 1, b: 2, c: 3 }, []); // { a: 1, b: 2, c: 3 }
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
