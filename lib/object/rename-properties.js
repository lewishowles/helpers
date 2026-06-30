import { isNonEmptyObject } from "./is-non-empty-object";
import { isNonEmptyString } from "../string/is-non-empty-string";

// isObject matches any non-null, non-array object — including Date, class
// instances, and Vue refs. isPlainObject restricts recursion to literal {}
// objects, preventing class instances from being flattened to {}.
function isPlainObject(value) {
	return (
		value !== null &&
		typeof value === "object" &&
		!Array.isArray(value) &&
		value.constructor === Object
	);
}

/**
 * @helper renameProperties
 * @category Object
 * @signature renameProperties(object: object, mapping: object)
 * @description
 * Returns a new object with keys renamed according to the given `mapping`, a
 * plain object of `{ oldKey: newKey }` pairs. The original object is not
 * mutated. Renaming is shallow only — nested objects are not deep-renamed.
 *
 * @note
 * Use `pickAs` instead when you want to project or whitelist keys into a new
 * shape; `renameProperties` renames keys in place while keeping all other keys.
 *
 * @example
 * renameProperties({ a: 1, b: 2 }, { a: "alpha" });
 * // { alpha: 1, b: 2 }
 *
 * renameProperties({ a: 1, b: 2 }, { a: "alpha", b: "beta" });
 * // { alpha: 1, beta: 2 }
 */
export function renameProperties(object, mapping) {
	if (!isPlainObject(object)) {
		return object;
	}

	if (!isNonEmptyObject(mapping)) {
		return { ...object };
	}

	const validRenames = {};

	for (const [oldKey, newKey] of Object.entries(mapping)) {
		if (!isNonEmptyString(oldKey) || !isNonEmptyString(newKey)) {
			continue;
		}

		if (!Object.hasOwn(object, oldKey)) {
			continue;
		}

		validRenames[oldKey] = newKey;
	}

	const targetNewKeys = new Set(Object.values(validRenames));
	const result = {};

	for (const key of Object.keys(object)) {
		if (Object.hasOwn(validRenames, key)) {
			result[validRenames[key]] = object[key];
		} else if (targetNewKeys.has(key)) {
			continue;
		} else {
			result[key] = object[key];
		}
	}

	return result;
}
