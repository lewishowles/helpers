import { isNonEmptyString } from "./is-non-empty-string.js";
import { ltrim } from "./ltrim.js";
import { rtrim } from "./rtrim.js";
import { toLowerCase } from "./to-lower-case.js";
import { toUpperCase } from "./to-upper-case.js";
import { trim } from "./trim.js";
import { truncate } from "./truncate.js";

/**
 * StringManipulator can be used to chan string methods together safely. A new
 * instance of the class is created, and then any of the string helper methods
 * can be used in any sequence. If the input at any stage is invalid, an empty
 * string is returned.
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
