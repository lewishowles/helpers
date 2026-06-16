import { Comment } from "vue";
import { isNonEmptyArray } from "@array";
import { isNonEmptyString } from "@string";

/**
 * @helper getSlotText
 * @category Vue
 * @signature getSlotText(slotReference)
 * @description
 * Retrieve the text from the given `slotReference`. `slotReference` is a direct reference to a slot - for example `slots.default`. Text is concatenated when multiple children exist.
 *
 * @example
 * // slots.default = () => [{ type: Text, children: "Text content" }]
 * getSlotText(slots.default); // "Text content"
 * // slots.default = () => [{ type: Text, children: [{ type: Text, children: "First text" }, { type: Text, children: "Second text" }] }]
 * getSlotText(slots.default); // "First textSecond text"
 * // slots.default = () => [{ type: Comment }]
 * getSlotText(slots.default); // ""
 * getSlotText("string"); // ""
 */
export function getSlotText(slot, { props, trim = true } = {}) {
	const nodes = typeof slot === "function" ? slot(props) : slot;

	if (!isNonEmptyArray(nodes)) {
		return "";
	}

	const text = getNodesText(nodes);

	return trim ? text.trim() : text;
}

/**
 * Concatenate the text content of a list of vnodes, recursing into children.
 *
 * @param  {array}  nodes
 *     The vnodes to read.
 */
function getNodesText(nodes) {
	if (!isNonEmptyArray(nodes)) {
		return "";
	}

	return nodes.reduce((text, node) => {
		// Comment nodes (including `v-if` placeholders) carry no displayable text.
		if (node.type === Comment) {
			return text;
		}

		if (isNonEmptyString(node.children)) {
			return text + node.children;
		}

		if (isNonEmptyArray(node.children)) {
			return text + getNodesText(node.children);
		}

		return text;
	}, "");
}
