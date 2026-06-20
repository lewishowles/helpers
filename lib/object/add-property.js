import { isNonEmptyObject } from "./is-non-empty-object";
import { isNonEmptyString } from "../string/is-non-empty-string";

/**
 * @helper addProperty
 * @category Object
 * @signature addProperty(object: object, key: string, value: any)
 * @description
 * Add a shallow key / value pair to an object without overwriting any existing value.
 * That is, only if that key isn't already present, or if its value is undefined
 * or null.
 *
 * @example
 * addProperty({ one: "One", two: "Two" }, "one", "Two"); // { one: "One", two: "Two" }
 * addProperty({ one: "One", two: "Two" }, "three", "Three"); // { one: "One", two: "Two", three: "Three" }
 * addProperty({ one: "One", two: null }, "two", "Two"); // { one: "One", two: "Two" }
 */
export function addProperty(object, key, value) {
	if (!isNonEmptyObject(object)) {
		return {};
	}

	if (!isNonEmptyString(key)) {
		return { ...object };
	}

	if ([undefined, null].includes(object[key])) {
		return { ...object, [key]: value };
	}

	return { ...object };
}
