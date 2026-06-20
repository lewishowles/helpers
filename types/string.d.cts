interface TruncateOptions {
	decoration?: string;
	preserveWords?: boolean;
	strict?: boolean;
	includeDecoration?: boolean;
}

export declare class StringManipulator {
	constructor(value: string);
	ltrim(pattern?: string | RegExp): this;
	rtrim(pattern?: string | RegExp): this;
	toLowerCase(): this;
	toUpperCase(): this;
	trim(pattern?: string | RegExp): this;
	truncate(length?: number, options?: TruncateOptions): this;
	get value(): string;
}

export declare function isNonEmptyString(
	variable: any,
	options?: { trim?: boolean },
): variable is string;
export declare function ltrim(string: string, pattern?: string | RegExp): string;
export declare function rtrim(string: string, pattern?: string | RegExp): string;
export declare function toLowerCase(variable: any): string;
export declare function toUpperCase(variable: any): string;
export declare function trim(string: string, pattern?: string | RegExp): string;
export declare function truncate(
	string: string,
	length?: number,
	options?: TruncateOptions,
): string;
