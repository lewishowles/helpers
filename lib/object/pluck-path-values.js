import { isNonEmptyArray } from "../array/is-non-empty-array";
import { isNonEmptyString } from "../string/is-non-empty-string";
import { getPathValue } from "./get-path-value";
import { isNonEmptyObject } from "./is-non-empty-object";

/**
 * @helper pluckPathValues
 * @category Object
 * @signature pluckPathValues(array: object[], path: string)
 * @description
 * Retrieve an array of the `path` value from each of the objects found in `array`.
 *
 * @note
 * Any non-objects in `array` are ignored. Objects that don't have the given path yield `undefined` in the result. Empty or invalid input returns `[]`.
 *
 * @example
 * pluckPathValues([{ user: { name: "Sophie" } }, { user: { name: "Hannah" } }], "user.name"); // ["Sophie", "Hannah"]
 * pluckPathValues([{ user: { name: "Sophie" } }, { user: {} }], "user.name"); // ["Sophie", undefined]
 * pluckPathValues([{ user: { name: "Sophie" } }, "not an object"], "user.name"); // ["Sophie"]
 * pluckPathValues([], "user.name"); // []
 */
export function pluckPathValues(array, path) {
	if (!isNonEmptyArray(array) || !isNonEmptyString(path)) {
		return [];
	}

	return array.reduce((values, object) => {
		if (!isNonEmptyObject(object)) {
			return values;
		}

		values.push(getPathValue(object, path));

		return values;
	}, []);
}
