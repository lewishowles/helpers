/**
 * @helper deepCopy
 * @category Object
 * @signature deepCopy(object: object)
 * @description
 * Returns a recursive copy of `object`.
 *
 * @example
 * deepCopy({ key: "value" }); // { key: "value" }
 * deepCopy(["a", "b"]); // ["a", "b"]
 */
export function deepCopy(object) {
	if (!object || typeof object !== "object") {
		return object;
	}

	const copy = Array.isArray(object) ? [] : {};

	for (const key in object) {
		if (Object.hasOwn(object, key)) {
			copy[key] = deepCopy(object[key]);
		}
	}

	return copy;
}
