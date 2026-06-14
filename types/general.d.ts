type ComparisonKeyword = "string" | "boolean" | "number" | "function" | "array" | "object";

export declare function getFriendlyDisplay(variable: any): string;
export declare function isFunction(variable: any): variable is Function;
export declare function size(variable: any): number;
export declare function validateOrFallback<T>(
	value: any,
	comparison: ComparisonKeyword | ((value: any) => boolean),
	fallback: T,
): any | T;
