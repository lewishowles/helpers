import { isFunction } from "#general/is-function";
import { getPathValue } from "#object/get-path-value";
import { isNonEmptyObject } from "#object/is-non-empty-object";
import { isNonEmptyArray } from "./is-non-empty-array";

/**
 * Find the first item matching a predicate or property filters.
 *
 * @helper firstWhere
 * @category Array
 * @signature firstWhere(array: any[], matcher: function): any
 * @signature firstWhere(array: any[], matcher: object): any
 * @description
 * Return the first item in `array` that matches the given predicate function or
 * filter object. Returns `undefined` when no item matches or the input is
 * empty.
 *
 * @param  {any[]}  array
 *     The array to search.
 * @param  {function|object}  matcher
 *     A predicate called with `(item, index, array)` that returns a truthy
 *     value, or an object of key-value pairs to match with strict equality.
 *     Object keys support dot paths, and every pair must match.
 * @returns  {any}
 *     The first matching item, or undefined when none matches.
 *
 * @example
 * firstWhere(users, (user) => user.active);
 * firstWhere(users, { role: "admin", active: true });
 * firstWhere(orders, { "customer.city": "York" });
 */
export function firstWhere(array, matcher) {
	if (!isNonEmptyArray(array)) {
		return undefined;
	}

	if (isFunction(matcher)) {
		return array.find(matcher);
	}

	if (isNonEmptyObject(matcher)) {
		// Every filter must match the corresponding property on the item.
		const entries = Object.entries(matcher);

		return array.find((item) => entries.every(([key, value]) => getPathValue(item, key) === value));
	}

	return undefined;
}
