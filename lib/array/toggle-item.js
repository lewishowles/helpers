import { isNonEmptyArray } from "./is-non-empty-array";

/**
 * @helper toggleItem
 * @category Array
 * @signature toggleItem(array: any[], item: any, comparator?: ((a: any, b: any) => boolean) | string)
 * @description
 * Add an item to an array if it is not present, or remove all occurrences of it
 * if it is. Returns a new array and does not mutate the original.
 *
 * @param  {any[]}  array
 *     The array to toggle the item within.
 * @param  {any}  item
 *     The item to add or remove.
 * @param  {((a: any, b: any) => boolean) | string}  comparator
 *     The matching function or object key used to compare items.
 *
 * @example
 * toggleItem([1, 2, 3], 2);                             // [1, 3]
 * toggleItem([1, 2, 3], 4);                             // [1, 2, 3, 4]
 * toggleItem([{ id: 1 }, { id: 2 }], { id: 1 }, 'id');  // [{ id: 2 }]
 */
export function toggleItem(array, item, comparator) {
	if (!isNonEmptyArray(array)) {
		return [];
	}

	const matches = buildMatcher(item, comparator);

	if (array.some(matches)) {
		return array.filter((existing) => !matches(existing));
	}

	return [...array, item];
}

function buildMatcher(item, comparator) {
	if (typeof comparator === "function") {
		return (existing) => comparator(existing, item);
	}

	if (typeof comparator === "string") {
		return (existing) => existing[comparator] === item[comparator];
	}

	return (existing) => existing === item;
}
