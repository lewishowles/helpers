/**
 * Make a recursive deep copy of the provided object or array.
 *
 * @param  {object|array}  object
 *     The object or array to copy.
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
