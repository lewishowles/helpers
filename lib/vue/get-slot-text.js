import { Comment } from "vue";
import { isNonEmptyArray } from "@array";
import { isNonEmptyString } from "@string";

/**
 * Get the text content of a Vue slot, traversing its children as necessary.
 *
 * @param  {mixed}  slotReference
 *     A reference to, or content of, a slot. e.g. `slots.default` or
 *     `slots.default()`.
 * @param  {object}  options
 *     Any additional options to set.
 * @param  {boolean}  options.trim
 *     Whether to trim the text content. Defaults to `true`.
 */
export function getSlotText(slotReference, { trim = true } = {}) {
	if (!slotReference || typeof slotReference !== "function") {
		return "";
	}

	const slot = slotReference();

	if (!isNonEmptyArray(slot)) {
		return "";
	}

	return getText(slot, { trim });
}

/**
 * Given an array of nodes, retrieve the text content from each, recursing into
 * children if necessary.
 *
 * @param  {array}  nodes
 *     The nodes from which to extract text.
 * @param  {object}  options
 *     Any additional options to set.
 * @param  {boolean}  options.trim
 *     Whether to trim the text content. Defaults to `true`.
 */
function getText(nodes, { trim = true } = {}) {
	if (!isNonEmptyArray(nodes)) {
		return "";
	}

	let text = "";

	nodes.forEach(node => {
		// We ignore comment nodes, as their content is not intended to be
		// displayed.
		if (node.type === Comment) {
			return;
		}

		if (isNonEmptyString(node.children)) {
			text += node.children;

			return;
		} else if (Array.isArray(node.children) && node.children.length) {
			text += getText(node.children, { trim });
		}
	});

	if (trim) {
		text = text.trim();
	}

	return text;
}
