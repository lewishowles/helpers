export declare function add<T extends object>(
	object: T,
	key: string,
	value: any,
): T & Record<string, any>;
export declare function deepCopy<T>(object: T): T;
export declare function deepMerge<T extends object>(...objects: Partial<T>[]): T;
export declare function forget<T extends object>(object: T, path: string): Partial<T>;
export declare function get<T = null>(object: object, path: string, returnValue?: T): T;
export declare function hasAny(object: object, paths: string[]): boolean;
export declare function isNonEmptyObject(variable: any): variable is Record<string, any>;
export declare function isObject(variable: any): variable is object;
export declare function keyBy<T extends object>(array: T[], key: keyof T): Record<string, T>;
export declare function keys(object: object): string[];
export declare function objectContains(
	object: object | any[],
	needle: any,
	options?: {
		exclude?: string[] | null;
		include?: string[] | null;
		caseInsensitive?: boolean;
		allowPartial?: boolean;
	},
): boolean;
export declare function objectLength(object: object): number;
export declare function omit<T extends object, K extends keyof T>(
	object: T,
	properties: K[],
): Omit<T, K>;
export declare function pick<T extends object, K extends keyof T>(
	object: T,
	properties: K[],
): Pick<T, K>;
export declare function set<T extends object>(object: T, path: string, value: any): T;
export declare function unwrap(object: object): any | null;
export declare function values(object: object): any[];
