import { isNonEmptyArray } from "./is-non-empty-array";
import { isNonEmptyObject } from "@object";
import { isNonEmptyString } from "@string";

/**
 * @helper pluck
 * @category Array
 * @signature pluck(array: any[], property: string)
 * @description
 * Retrieve an array of the `property` value from each of the objects found in `array`.
 *
 * @note
 * Any non-objects in `array` are ignored. Objects that don't have the given property yield `undefined` in the result. Empty or invalid input returns `[]`.
 *
 * Note: `property` is a direct key only, and dot-path notation is not yet supported. Use `get` for nested access.
 *
 * @example
 * pluck([{ fruit: "apple" }, { fruit: "banana" }], "fruit"); // ["apple", "banana"]
 * pluck([{ fruit: "apple" }, { fruit: "banana" }], "colour"); // [undefined, undefined]
 * pluck([{ fruit: "apple" }, "not an object"], "fruit"); // ["apple"]
 * pluck([], "property"); // []
 */
export function pluck(array, property) {
	if (!isNonEmptyArray(array) || !isNonEmptyString(property)) {
		return [];
	}

	return array.reduce((values, object) => {
		if (!isNonEmptyObject(object)) {
			return values;
		}

		values.push(object[property]);

		return values;
	}, []);
}
