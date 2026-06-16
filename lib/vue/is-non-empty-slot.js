import { Comment, Fragment, Text } from "vue";
import { isNonEmptyArray } from "@array";
import { isNonEmptyObject } from "@object";

/**
 * @helper isNonEmptySlot
 * @category Vue
 * @signature isNonEmptySlot(slotReference)
 * @description
 * Determines whether the given `slotReference` contains content. `slotReference` is a direct reference to a slot - for example `slots.default`.
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
