import { isObject } from "./is-object";

// Identify when a path can't be resolved.
export const NOT_FOUND = Symbol("NOT_FOUND");

/**
 * Traverse an object or array, following a sequence of path segments.
 *
 * Objects are traversed by key name. Arrays require a non-negative integer
 * segment. Returns NOT_FOUND if any segment cannot be followed, including a
 * missing key, a non-integer segment for an array, or trying to traverse
 * anything that isn't an array or object.
 *
 * @param  {unknown}  value
 *     The root value to traverse.
 * @param  {string[]}  segments
 *     The path segments to follow.
 */
export function traversePath(value, segments) {
	let current = value;

	for (const segment of segments) {
		if (Array.isArray(current)) {
			const index = toNumericIndex(segment);

			if (index === null || index >= current.length) {
				return NOT_FOUND;
			}

			current = current[index];
		} else if (isObject(current)) {
			if (!Object.hasOwn(current, segment)) {
				return NOT_FOUND;
			}

			current = current[segment];
		} else {
			return NOT_FOUND;
		}
	}

	return current;
}

/**
 * Convert a path segment to a non-negative integer array index.
 *
 * Returns null if the segment is not a sequence of digits, so that callers
 * can distinguish a valid index from a segment that cannot be applied to
 * an array.
 *
 * @param  {string}  segment
 *     The path segment to convert.
 */
export function toNumericIndex(segment) {
	if (!/^\d+$/.test(segment)) {
		return null;
	}

	return parseInt(segment);
}
