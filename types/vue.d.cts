import type { Slot } from "vue";

export declare function callComponentMethod<T = unknown>(
	component: object | null | undefined,
	method: string,
	...params: any[]
): T | undefined;
export declare function getSlotText(slotReference: Slot | undefined): string;
export declare function isNonEmptySlot(slotReference: Slot | undefined): boolean;
