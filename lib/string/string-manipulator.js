import { isNonEmptyString } from "./is-non-empty-string.js";
import { ltrim } from "./ltrim.js";
import { rtrim } from "./rtrim.js";
import { toLowerCase } from "./to-lower-case.js";
import { toUpperCase } from "./to-upper-case.js";
import { trim } from "./trim.js";
import { truncate } from "./truncate.js";

/**
 * @helper StringManipulator
 * @category String
 * @signature StringManipulator
 * @description
 * `StringManipulator` can be used to chain string methods together safely. A
 * new instance of the class is created, and then any of the string helper
 * methods can be used in any sequence. If the input at any stage is invalid, an
 * empty string is returned.
 *
 * @param  {any}  value
 *     The initial string value to wrap. Non-strings fall back to an empty
 *     string.
 *
 * @example
 * const userId = "82FAA75F-B47A-43B6-82F6-389C9408BB67";
 *
 * const userIdPreview = new StringManipulator(userId).toLowerCase().truncate(15).value; // 82faa75f-b47a-…
 */
export class StringManipulator {
	// Keep the string used by chained methods.
	internalValue = "";

	/**
	 * Start with a non-empty string or an empty value.
	 *
	 * @param  {any}  value
	 *     The initial string to wrap. Other values start as an empty string.
	 */
	constructor(value) {
		if (isNonEmptyString(value)) {
			this.internalValue = value;
		}
	}

	/**
	 * Remove matching text from the start of the current value.
	 *
	 * @param  {string | RegExp}  [pattern]
	 *     The characters or pattern to remove. Defaults to whitespace.
	 *
	 * @returns  {StringManipulator}
	 *     This instance with its updated string value.
	 */
	ltrim(pattern) {
		return this.chainMethod(ltrim, pattern);
	}

	/**
	 * Remove matching text from the end of the current value.
	 *
	 * @param  {string | RegExp}  [pattern]
	 *     The characters or pattern to remove. Defaults to whitespace.
	 *
	 * @returns  {StringManipulator}
	 *     This instance with its updated string value.
	 */
	rtrim(pattern) {
		return this.chainMethod(rtrim, pattern);
	}

	/**
	 * Convert the current value to lowercase.
	 *
	 * @returns  {StringManipulator}
	 *     This instance with its updated string value.
	 */
	toLowerCase() {
		return this.chainMethod(toLowerCase);
	}

	/**
	 * Convert the current value to uppercase.
	 *
	 * @returns  {StringManipulator}
	 *     This instance with its updated string value.
	 */
	toUpperCase() {
		return this.chainMethod(toUpperCase);
	}

	/**
	 * Remove matching text from both ends of the current value.
	 *
	 * @param  {string | RegExp}  [pattern]
	 *     The characters or pattern to remove. Defaults to whitespace.
	 *
	 * @returns  {StringManipulator}
	 *     This instance with its updated string value.
	 */
	trim(pattern) {
		return this.chainMethod(trim, pattern);
	}

	/**
	 * Shorten the current value to the requested length.
	 *
	 * @param  {number}  length
	 *     The maximum length of the result.
	 * @param  {object}  options
	 *     The truncation options passed to `truncate`.
	 *
	 * @returns  {StringManipulator}
	 *     This instance with its updated string value.
	 */
	truncate(length, options) {
		return this.chainMethod(truncate, length, options);
	}

	/**
	 * Apply a string helper and keep this instance for chaining.
	 *
	 * @param  {Function}  transformationMethod
	 *     The helper to apply to the current value.
	 * @param  {any[]}  args
	 *     Arguments to pass to the string helper.
	 *
	 * @returns  {StringManipulator}
	 *     This instance with its updated string value.
	 */
	chainMethod(transformationMethod, ...args) {
		this.internalValue = transformationMethod(this.internalValue, ...args);

		return this;
	}

	/**
	 * Return the current string.
	 *
	 * @returns  {string}
	 *     The current string after chained changes.
	 */
	get value() {
		return this.internalValue;
	}
}
