import { isNonEmptyArray } from "./is-non-empty-array";
import { isNonEmptyObject } from "../object/is-non-empty-object";
import { isNonEmptyString } from "../string/is-non-empty-string";

/**
 * Convert the provided array of objects into an array of items, each containing
 * the value of the given property.
 *
 * Any non-objects are excluded from the returned array.
 *
 * Any object that does not have the provided property will be undefined.
 *
 * @param  {array}  array
 *     The array from which to pluck values.
 * @param  {string}  property
 *     The property to pluck from each object.
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
