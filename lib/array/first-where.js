import { isFunction } from "#general/is-function";
import { getPathValue } from "#object/get-path-value";
import { isNonEmptyObject } from "#object/is-non-empty-object";
import { isNonEmptyArray } from "./is-non-empty-array";

/**
 * @helper firstWhere
 * @category Array
 * @signature firstWhere(array: any[], predicate: function): any
 * @signature firstWhere(array: any[], filters: object): any
 * @description
 * Return the first item in `array` that matches the given predicate function or
 * filter object. Returns `undefined` when no item matches or the input is
 * empty.
 *
 * @param  {any[]}  array
 *     The array to search.
 * @param  {function}  predicate
 *     A function called with `(item, index, array)` that returns a truthy value
 *     to match.
 * @param  {object}  filters
 *     An object of key-value pairs to match exactly using strict equality.
 *     Supports dot-path notation for nested properties. All pairs must match
 *     (AND logic).
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
		const entries = Object.entries(matcher);

		return array.find((item) => entries.every(([key, value]) => getPathValue(item, key) === value));
	}

	return undefined;
}
