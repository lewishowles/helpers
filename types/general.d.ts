type ComparisonKeyword = "string" | "boolean" | "number" | "function" | "array" | "object";

type SettleResult<T = any> =
	| { status: "fulfilled"; value: T; index: number }
	| { status: "rejected"; reason: any; index: number };

type SettleOutcome<T = any> = {
	values: T[];
	errors: any[];
	results: SettleResult<T>[];
};

type TimingOptions = { leading?: boolean; trailing?: boolean };

type ControlledFunction<T extends (...args: any[]) => any> = {
	(...args: Parameters<T>): ReturnType<T> | undefined;
	cancel(): void;
	flush(): ReturnType<T> | undefined;
};

export declare function debounce<T extends (...args: any[]) => any>(
	fn: T,
	delay?: number,
	options?: TimingOptions,
): ControlledFunction<T>;
export declare function getFriendlyDisplay(variable: any): string;
export declare function isFunction(variable: any): variable is Function;
export declare function resolveOrFallback<T, F>(
	promise: T | PromiseLike<T> | null | undefined,
	fallback: F | (() => F),
): Promise<T | F>;
export declare function settle<T = any>(promises: any[]): Promise<SettleOutcome<T>>;
export declare function size(variable: any): number;
export declare function throttle<T extends (...args: any[]) => any>(
	fn: T,
	delay?: number,
	options?: TimingOptions,
): ControlledFunction<T>;
export declare function validateOrFallback<T>(
	value: any,
	comparison: ComparisonKeyword | ((value: any) => boolean),
	fallback: T,
): any | T;
