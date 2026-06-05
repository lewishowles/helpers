import { Comment, Fragment, Text } from "vue";
import { isNonEmptyArray } from "@array";
import { isNonEmptyObject } from "@object";

/**
 * Determine whether a slot has renderable content. A slot is empty when it is
 * absent, or renders only comments, whitespace, or empty fragments (for
 * example, a `v-if` that resolved to nothing).
 *
 * @param  {Function}  slot
 *     The slot to check, e.g. `slots.default`.
 * @param  {object}  props
 *     Props to pass when the slot's content depends on scope.
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
