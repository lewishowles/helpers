import { isPlainObject } from "#object/is-plain-object";

/**
 * @helper isEqual
 * @category General
 * @signature isEqual(a: unknown, b: unknown)
 * @description
 *     Determine whether `a` and `b` are deeply equal. Primitives are compared
 *     with SameValueZero semantics, so `NaN` is equal to `NaN`, and
 *     `null`/`undefined` are not equal to each other. Arrays are equal when
 *     they share the same length and every element is deeply equal in order.
 *     Plain objects are equal when they share the same set of own-enumerable
 *     keys and every value is deeply equal, regardless of key order. Anything
 *     else, including a type mismatch between the two values, or non-plain
 *     objects such as `Date`, `Map`, `Set`, or class instances, is not equal
 *     unless the two values are the same reference.
 *
 * @param  {unknown}  a
 *     The first value to compare.
 * @param  {unknown}  b
 *     The second value to compare.
 *
 * @returns  {boolean}
 *     Whether the values are deeply equal.
 *
 * @example
 * isEqual(NaN, NaN); // true
 * isEqual(null, undefined); // false
 * isEqual([1, { property: "value" }], [1, { property: "value" }]); // true
 * isEqual({ a: 1, b: 2 }, { b: 2, a: 1 }); // true
 */
export function isEqual(a, b) {
	if (a === b) {
		return true;
	}

	if (typeof a === "number" && typeof b === "number") {
		return Number.isNaN(a) && Number.isNaN(b);
	}

	if (Array.isArray(a) && Array.isArray(b)) {
		return a.length === b.length && a.every((value, index) => isEqual(value, b[index]));
	}

	if (isPlainObject(a) && isPlainObject(b)) {
		// List the first object keys for comparison.
		const aKeys = Object.keys(a);
		// List the second object keys for comparison.
		const bKeys = Object.keys(b);

		return (
			aKeys.length === bKeys.length &&
			aKeys.every((key) => Object.hasOwn(b, key) && isEqual(a[key], b[key]))
		);
	}

	return false;
}
