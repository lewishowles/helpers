import { isNonEmptyArray } from "#array/is-non-empty-array";
import { isNonEmptyString } from "#string/is-non-empty-string";
import { Comment } from "vue";

/**
 * @helper getSlotText
 * @category Vue
 * @signature getSlotText(slot, { props, trim = true })
 * @description
 * Read text from a slot function, such as `slots.default`, or from a vnode
 * array. Missing and empty slots return an empty string. Child text is joined
 * without inserting spaces, then the complete string is trimmed unless `trim`
 * is false.
 *
 * @param  {Function | object[]}  slot
 *     The slot function or vnode array to read.
 * @param  {object}  options
 *     Options for reading slot text.
 * @param  {object}  [options.props]
 *     Props to pass when rendering a slot function.
 * @param  {boolean}  [options.trim=true]
 *     Whether to trim whitespace from the returned text.
 *
 * @returns  {string}
 *     The text in the slot, optionally trimmed.
 *
 * @example
 * // slots.default = () => [{ type: Text, children: "Text content" }]
 * getSlotText(slots.default); // "Text content"
 * // slots.default = () => [{ type: Text, children: [{ type: Text, children: "First text" }, { type: Text, children: "Second text" }] }]
 * getSlotText(slots.default); // "First textSecond text"
 * // slots.default = () => [{ type: Comment }]
 * getSlotText(slots.default); // ""
 * getSlotText("string"); // ""
 * getSlotText([]); // ""
 *
 * @example
 * const slot = ({ label }) => [{ type: Text, children: label }];
 * getSlotText(slot, { props: { label: " Hello " } }); // "Hello"
 * getSlotText([{ type: Text, children: " Hello " }], { trim: false }); // " Hello "
 */
export function getSlotText(slot, { props, trim = true } = {}) {
	// The vnodes returned by the slot or passed directly.
	const nodes = typeof slot === "function" ? slot(props) : slot;

	if (!isNonEmptyArray(nodes)) {
		return "";
	}

	// The text collected from the slot's vnodes.
	const text = getNodesText(nodes);

	return trim ? text.trim() : text;
}

/**
 * Concatenate the text content of a list of vnodes, recursing into children.
 *
 * @param  {array}  nodes
 *     The vnodes to read.
 *
 * @returns  {string}
 *     The concatenated text in the vnode list.
 */
function getNodesText(nodes) {
	if (!isNonEmptyArray(nodes)) {
		return "";
	}

	return nodes.reduce((text, node) => {
		// Comment nodes (including `v-if` placeholders) carry no displayable
		// text.
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
