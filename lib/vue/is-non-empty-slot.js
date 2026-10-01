import { isNonEmptyArray } from "#array/is-non-empty-array";
import { isNonEmptyObject } from "#object/is-non-empty-object";
import { Comment, Fragment, Text } from "vue";

/**
 * @helper isNonEmptySlot
 * @category Vue
 * @signature isNonEmptySlot(slotReference)
 * @description
 *     Determines whether the given `slotReference` contains content.
 *     `slotReference` is a direct reference to a slot - for example
 *     `slots.default`.
 *
 * @param  {Function}  slot
 *     The slot function to check.
 * @param  {object}  props
 *     Props to pass when rendering the slot function.
 *
 * @returns  {boolean}
 *     Whether the slot contains displayable content.
 *
 * @example
 * // slots.default = () => [{ type: Text, children: "Text content" }]
 * isNonEmptySlot(slots.default); // true
 * // slots.default = () => [{ type: Comment }]
 * isNonEmptySlot(slots.default); // false
 * isNonEmptySlot("string"); // false
 */
export function isNonEmptySlot(slot, props) {
	if (typeof slot !== "function") {
		return false;
	}

	return !nodesAreEmpty(slot(props));
}

/**
 * Determine whether every vnode in a list is effectively empty.
 *
 * @param  {array}  nodes
 *     The vnodes to check.
 *
 * @returns  {boolean}
 *     Whether every vnode is empty or contains only empty children.
 */
function nodesAreEmpty(nodes) {
	if (!isNonEmptyArray(nodes)) {
		return true;
	}

	return nodes.every((node) => {
		if (!isNonEmptyObject(node)) {
			return true;
		}

		if (node.type === Comment) {
			return true;
		}

		if (node.type === Text) {
			return !node.children.trim();
		}

		if (node.type === Fragment) {
			return nodesAreEmpty(node.children);
		}

		return false;
	});
}
