import { Comment, Fragment, Text } from "vue";
import { isNonEmptyArray } from "../array/array";
import { isNonEmptyObject } from "../object/object";

/**
 * Determines whether a given slot is empty by checking its content.
 *
 * @param  {function}  slot
 *     The reference to the slot. e.g. `slots.default`.
 */
export function isNonEmptySlot(slot) {
	if (!slot) {
		return false;
	}

	// if we get a slot that is not a function, we're in vue 2 and there is content, so it's not empty
	if (typeof slot !== "function") {
		return false;
	}

	return !vNodeIsEmpty(slot());
}

/**
 * Determine if a given node is empty.
 *
 * @param  {array}  vnodes
 *     The vnodes to check.
 */
function vNodeIsEmpty(vnodes) {
	if (!isNonEmptyArray(vnodes)) {
		return true;
	}

	return vnodes.every(node => {
		if (!isNonEmptyObject(node)) {
			return true;
		}

		if (node.type === Comment) {
			return true;
		}

		if (node.type === Text && !node.children.trim()) {
			return true;
		}

		if (node.type === Fragment && vNodeIsEmpty(node.children)) {
			return true;
		}

		return false;
	});
}
