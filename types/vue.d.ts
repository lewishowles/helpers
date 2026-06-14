import type { Slot } from "vue";

export declare function getSlotText(slotReference: Slot | undefined): string;
export declare function isNonEmptySlot(slotReference: Slot | undefined): boolean;
export declare function runComponentMethod(
	component: object | null | undefined,
	method: string,
	...params: any[]
): boolean | undefined;
