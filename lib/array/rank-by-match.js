import { isFunction } from "#general/is-function";
import { isNonEmptyString } from "#string/is-non-empty-string";
import { isNonEmptyArray } from "./is-non-empty-array";

/**
 * Find and rank items whose labels contain a search query.
 *
 * @helper rankByMatch
 * @category Array
 * @signature rankByMatch(array: any[], query: string, getLabel?: function): any[]
 * @description
 * Return a new array of items with labels containing the trimmed query,
 * ignoring case. Shorter labels come first, then labels with an earlier match.
 * Items tied on both remain in their original order. Non-string labels are
 * skipped, and an invalid array, query or label function returns an empty
 * array. Accents are not folded.
 *
 * @param  {any[]}  array
 *     The items to search. The input array is not changed.
 * @param  {string}  query
 *     The search text, with surrounding whitespace ignored.
 * @param  {function}  [getLabel]
 *     Return an item's label. When omitted, the item itself is used.
 * @returns  {any[]}
 *     The matching items in ranked order, or an empty array for invalid input.
 *
 * @example
 * rankByMatch(["Blueberry", "Berry", "Blackberry"], "berry"); // ["Berry", "Blueberry", "Blackberry"]
 * rankByMatch([{ name: "Blueberry" }, { name: "Berry" }], "berry", (item) => item.name);
 */
export function rankByMatch(array, query, getLabel = (item) => item) {
	if (
		!isNonEmptyArray(array) ||
		!isNonEmptyString(query, { trim: true }) ||
		!isFunction(getLabel)
	) {
		return [];
	}

	// The search text uses the same case conversion as each label.
	const search = query.trim().toLowerCase();

	// Each match keeps the values it is ranked by, so each label is read only
	// once.
	const matches = array.flatMap((item, index) => {
		// The item's label, read with the same arguments an array callback
		// receives.
		const label = getLabel(item, index, array);

		if (!isNonEmptyString(label)) {
			return [];
		}

		// The first match decides the item's position within its length group.
		const position = label.toLowerCase().indexOf(search);

		return position < 0 ? [] : [{ item, length: label.length, position }];
	});

	return matches
		.sort((a, b) => a.length - b.length || a.position - b.position)
		.map(({ item }) => item);
}
