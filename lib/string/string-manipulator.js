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
 * `StringManipulator` can be used to chain string methods together safely. A new instance of the class is created, and then any of the string helper methods can be used in any sequence. If the input at any stage is invalid, an empty string is returned.
 *
 * @example
 * const userId = "82FAA75F-B47A-43B6-82F6-389C9408BB67";
 *
 * const userIdPreview = new StringManipulator(userId).toLowerCase().truncate(15).value; // 82faa75f-b47a-…
 */
export class StringManipulator {
	internalValue = "";

	// We only allow valid strings, otherwise we use the initial value.
	constructor(value) {
		if (isNonEmptyString(value)) {
			this.internalValue = value;
		}
	}

	ltrim(pattern) {
		return this.chainMethod(ltrim, pattern);
	}

	rtrim(pattern) {
		return this.chainMethod(rtrim, pattern);
	}

	toLowerCase() {
		return this.chainMethod(toLowerCase);
	}

	toUpperCase() {
		return this.chainMethod(toUpperCase);
	}

	trim(pattern) {
		return this.chainMethod(trim, pattern);
	}

	truncate(length, options) {
		return this.chainMethod(truncate, length, options);
	}

	chainMethod(transformationMethod, ...args) {
		this.internalValue = transformationMethod(this.internalValue, ...args);

		return this;
	}

	/**
	 * Retrieve our value
	 */
	get value() {
		return this.internalValue;
	}
}
