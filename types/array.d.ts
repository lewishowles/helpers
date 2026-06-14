export declare function arrayLength(array: any[]): number;
export declare function chunk<T>(array: T[], chunkSize: number): T[][];
export declare function compact(array: any[]): any[];
export declare function ensureArray<T>(variable: T | T[]): T[];
export declare function firstDefined<T>(array: T[]): T | undefined;
export declare function getNextIndex(
	index: number,
	reference: any[],
	options?: { reverse?: boolean; wrap?: boolean },
): number;
export declare function head<T>(array: T[]): T | undefined;
export declare function isNonEmptyArray(variable: any): variable is any[];
export declare function lastDefined<T>(array: T[]): T | undefined;
export declare function pluck<T extends object, K extends keyof T>(
	array: T[],
	property: K,
): (T[K] | undefined)[];
export declare function sortObjectsByProperty<T extends object>(
	array: T[],
	property: keyof T,
	options?: { ascending?: boolean },
): T[];
export declare function tail<T>(array: T[]): T | undefined;
export declare function unique<T>(array: T[]): T[];
