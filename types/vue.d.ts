import type { Slot, VNode } from "vue";

export declare function callComponentMethod<T = unknown>(
	component: object | null | undefined,
	method: string,
	...params: any[]
): T | undefined;
export declare function getSlotText(
	slot: Slot | VNode[] | undefined,
	options?: { props?: Record<string, unknown>; trim?: boolean },
): string;
export declare function isNonEmptySlot(slotReference: Slot | undefined): boolean;
