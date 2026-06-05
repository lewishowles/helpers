import { Comment } from "vue";
import { isNonEmptyArray } from "@array";
import { isNonEmptyString } from "@string";

/**
 * Get the text content of a Vue slot, traversing child nodes as needed.
 *
 * @param  {Function|array}  slot
 *     A slot function (e.g. `slots.default`) or already-resolved slot content
 *     (e.g. `slots.default()`).
 * @param  {object}  options
 * @param  {object}  options.props
 *     Props to pass when calling a slot function, so scoped slots resolve
 *     correctly. Ignored when `slot` is already resolved content.
 * @param  {boolean}  options.trim
 *     Whether to trim the final result. Defaults to `true`.
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
