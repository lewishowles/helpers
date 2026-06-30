/**
 * @helper deepCopy
 * @category Object
 * @signature deepCopy(value: any)
 * @description
 * Returns a deep copy of `value`. Non-objects are returned unchanged.
 *
 * @note
 * Uses the built-in `structuredClone` where possible, so `Date`, `Map`, `Set`,
 * `RegExp`, typed arrays, and cyclic references are cloned correctly. For
 * values `structuredClone` cannot handle, such as objects containing functions,
 * it falls back to a recursive copy that copies functions by reference and
 * preserves cyclic references via a `WeakMap`.
 *
 * @example
 * deepCopy({ key: "value" }); // { key: "value" }
 * deepCopy(["a", "b"]); // ["a", "b"]
 * deepCopy(new Date(0)); // a new Date with the same time
 */
export function deepCopy(value) {
	// Non-objects, including functions, are returned by reference.
	if (!value || typeof value !== "object") {
		return value;
	}

	return recursiveCopy(value);
}

/**
 * Copy a value, trying `structuredClone` at each level so cloneable subtrees
 * (`Date`, `Map`, `Set`, `RegExp`, typed arrays) are preserved even when a
 * sibling or parent holds something `structuredClone` can't handle. Only nodes
 * that fail are copied manually, with functions copied by reference and cyclic
 * references preserved via a `WeakMap`.
 *
 * @param  {any}  value
 *     The value to copy.
 * @param  {WeakMap}  seen
 *     Tracks already-copied objects to preserve cycles.
 * @return  {any}
 *     The copied value.
 */
function recursiveCopy(value, seen = new WeakMap()) {
	// Non-objects, including functions, are returned by reference.
	if (!value || typeof value !== "object") {
		return value;
	}

	if (seen.has(value)) {
		return seen.get(value);
	}

	// Prefer structuredClone for this node — it clones Date, Map, Set, RegExp,
	// typed arrays, and cyclic references correctly. Only recurse when it can't,
	// for example when the node contains a function or DOM node.
	try {
		return structuredClone(value);
	} catch {
		// Fall through to a manual copy of this node's own keys.
	}

	const copy = Array.isArray(value) ? [] : {};

	seen.set(value, copy);

	for (const key in value) {
		if (Object.hasOwn(value, key)) {
			copy[key] = recursiveCopy(value[key], seen);
		}
	}

	return copy;
}
