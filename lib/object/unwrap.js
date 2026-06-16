import { firstDefined } from "@array";
import { get } from "./get";
import { isNonEmptyObject } from "./is-non-empty-object";
import { keys } from "./keys";
import { objectLength } from "./object-length";

/**
 * @helper unwrap
 * @category Object
 * @signature unwrap(object: object)
 * @description
 * Safely unwrap a single-key object, returning the value of that key. `null` is returned if the object contains more than one key, or the value cannot be retrieved.
 *
 * @example
 * unwrap({ key: "value" }); // "value"
 * unwrap(null); // null
 * unwrap({ key_one: "value", key_two: "value two" }); // null
 */
export function unwrap(object) {
	if (!isNonEmptyObject(object)) {
		return null;
	}

	if (objectLength(object) > 1) {
		return null;
	}

	return get(object, firstDefined(keys(object)));
}
