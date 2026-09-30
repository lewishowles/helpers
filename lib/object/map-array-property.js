import { isPlainObject } from "./is-plain-object";
import { isNonEmptyArray } from "#array/is-non-empty-array";
import { isNonEmptyString } from "#string/is-non-empty-string";

/**
 * @helper mapArrayProperty
 * @category Object
 * @signature mapArrayProperty(object: object, property: string, mapper: Function)
 * @description
 * Returns a shallow copy of `object` with the array at `property` replaced by
 * the result of calling `mapper` over it. If `object[property]` is not a
 * non-empty array, `property` resolves to `[]` in the result rather than
 * being omitted.
 *
 * @param  {object}  object
 *     The object to read the array from.
 * @param  {string}  property
 *     The property holding the array to map.
 * @param  {Function}  mapper
 *     The mapper function, forwarded as-is to `Array.prototype.map`.
 *
 * @example
 * mapArrayProperty({ items: [1, 2, 3] }, "items", (item) => item * 2);
 * // { items: [2, 4, 6] }
 *
 * mapArrayProperty({ total: 0 }, "items", (item) => item);
 * // { total: 0, items: [] }
 */
export function mapArrayProperty(object, property, mapper) {
	if (!isPlainObject(object)) {
		return {};
	}

	if (!isNonEmptyString(property)) {
		return { ...object };
	}

	const array = object[property];

	return { ...object, [property]: isNonEmptyArray(array) ? array.map(mapper) : [] };
}
