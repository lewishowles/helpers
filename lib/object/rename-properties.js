import { isNonEmptyObject } from "./is-non-empty-object";
import { isPlainObject } from "./is-plain-object";
import { isNonEmptyString } from "#string/is-non-empty-string";

/**
 * @helper renameProperties
 * @category Object
 * @signature renameProperties(object: object, mapping: object)
 * @description
 * Returns a new object with keys renamed according to the given `mapping`, a
 * plain object of `{ oldKey: newKey }` pairs. The original object is not
 * mutated. Renaming is shallow only — nested objects are not deep-renamed.
 *
 * @param  {object}  object
 *     The object to rename keys on.
 * @param  {object}  mapping
 *     The existing keys and replacement keys to use.
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
