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
		this.internalValue = ltrim(this.internalValue, pattern);

		return this;
	}

	rtrim(pattern) {
		this.internalValue = rtrim(this.internalValue, pattern);

		return this;
	}

	toLowerCase() {
		this.internalValue = toLowerCase(this.internalValue);

		return this;
	}

	toUpperCase() {
		this.internalValue = toUpperCase(this.internalValue);

		return this;
	}

	trim(pattern) {
		this.internalValue = trim(this.internalValue, pattern);

		return this;
	}

	truncate(length, options) {
		this.internalValue = truncate(this.internalValue, length, options);

		return this;
	}

	/**
	 * Retrieve our value
	 */
	get value() {
		return this.internalValue;
	}
}
