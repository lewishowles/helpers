import { clamp } from "#number/clamp";
import { arrayLength } from "./array-length";
import { isNonEmptyArray } from "./is-non-empty-array";

/**
 * Move an array item without changing the original array.
 *
 * @helper moveItem
 * @category Array
 * @signature moveItem(array: any[], fromIndex: number, toIndex: number)
 * @description
 * Move an item to a new position, returning a new array and leaving the
 * original untouched.
 *
 * @param  {any[]}  array
 *     The array containing the item to move.
 * @param  {number}  fromIndex
 *     The index of the item to move.
 * @param  {number}  toIndex
 *     The index to move the item to.
 * @returns  {any[]}
 *     A new array with the item moved, or a copy for invalid indices.
 *
 * @note
 * `toIndex` is read after the item has been removed, matching how drag-and-drop
 * libraries report a drop. `fromIndex` must point at an existing item,
 * otherwise the array is returned unchanged; `toIndex` is clamped into range.
 *
 * @example
 * moveItem(["a", "b", "c", "d"], 1, 3); // ["a", "c", "d", "b"]
 * moveItem(["a", "b", "c", "d"], 3, 1); // ["a", "d", "b", "c"]
 * moveItem(["a", "b", "c", "d"], 0, 3); // ["b", "c", "d", "a"]
 */
export function moveItem(array, fromIndex, toIndex) {
	if (!isNonEmptyArray(array)) {
		return [];
	}

	// The original length determines which source indices are valid.
	const length = arrayLength(array);

	if (!Number.isInteger(fromIndex) || fromIndex < 0 || fromIndex >= length) {
		return [...array];
	}

	if (!Number.isInteger(toIndex)) {
		return [...array];
	}

	// The destination stays within the original array bounds.
	const targetIndex = clamp(toIndex, 0, length - 1);

	if (fromIndex === targetIndex) {
		return [...array];
	}

	// Work on a copy so moving an item leaves the input untouched.
	const result = [...array];
	// The item being moved; removing it first means toIndex counts from the
	// shortened array.
	const [item] = result.splice(fromIndex, 1);

	result.splice(targetIndex, 0, item);

	return result;
}
