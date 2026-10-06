interface TruncateOptions {
	decoration?: string;
	preserveWords?: boolean;
	strict?: boolean;
	includeDecoration?: boolean;
	position?: "start" | "end" | "middle";
}

/**
 * Chain string helpers on one value, which becomes an empty string when the
 * input is not a string.
 */
export declare class StringManipulator {
	/**
	 * Start with a string value, or an empty string for other values.
	 *
	 * @param  value
	 *     The initial string value.
	 */
	constructor(value: string);
	/**
	 * Remove matching text from the start of the current value.
	 *
	 * @param  pattern
	 *     The characters or pattern to remove. Defaults to whitespace.
	 */
	ltrim(pattern?: string | RegExp): this;
	/**
	 * Remove matching text from the end of the current value.
	 *
	 * @param  pattern
	 *     The characters or pattern to remove. Defaults to whitespace.
	 */
	rtrim(pattern?: string | RegExp): this;
	/**
	 * Convert the current value to lowercase.
	 */
	toLowerCase(): this;
	/**
	 * Convert the current value to uppercase.
	 */
	toUpperCase(): this;
	/**
	 * Remove matching text from both ends of the current value.
	 *
	 * @param  pattern
	 *     The characters or pattern to remove. Defaults to whitespace.
	 */
	trim(pattern?: string | RegExp): this;
	/**
	 * Shorten the current value to the requested length.
	 *
	 * @param  length
	 *     The maximum length of the result.
	 * @param  options
	 *     The truncation options.
	 */
	truncate(length?: number, options?: TruncateOptions): this;
	/**
	 * Return the current string after chained changes.
	 */
	get value(): string;
}

export declare function capitalise(value: any): string;
export declare function isNonEmptyString(
	variable: any,
	options?: { trim?: boolean },
): variable is string;
export declare function ltrim(string: string, pattern?: string | RegExp): string;
export declare function rtrim(string: string, pattern?: string | RegExp): string;
export declare function toKebabCase(value: any): string;
export declare function toCamelCase(value: any): string;
export declare function toLowerCase(variable: any): string;
export declare function toNullableString(value: any): string;
export declare function toUpperCase(variable: any): string;
export declare function toPascalCase(value: any): string;
export declare function toSnakeCase(value: any): string;
export declare function toScreamingSnakeCase(value: any): string;
export declare function trim(string: string, pattern?: string | RegExp): string;
export declare function truncate(
	string: string,
	length?: number,
	options?: TruncateOptions,
): string;
