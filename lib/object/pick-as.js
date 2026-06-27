import { getPathValue } from "./get-path-value";
import { isNonEmptyObject } from "./is-non-empty-object";

/**
 * @helper pickAs
 * @category Object
 * @signature pickAs(object: object, mapping: object)
 * @description
 * Returns a new object with keys from `mapping` whose values are resolved from
 * `object` at the paths given by the mapping values.
 *
 * @note
 * Uses `getPathValue` so dot-notation paths are supported.
 *
 * Missing source paths resolve as `undefined` — the key is always included in
 * the result.
 *
 * @example
 * pickAs({ id: 1, location: { name: "London" } }, { id: "id", locationName: "location.name" });
 * // { id: 1, locationName: "London" }
 *
 * pickAs({ a: 1 }, { a: "a", b: "missing" });
 * // { a: 1, b: undefined }
 */
export function pickAs(object, mapping) {
	if (!isNonEmptyObject(object) || !isNonEmptyObject(mapping)) {
		return {};
	}

	return Object.keys(mapping).reduce((result, outputKey) => {
		result[outputKey] = getPathValue(object, mapping[outputKey]);

		return result;
	}, {});
}
