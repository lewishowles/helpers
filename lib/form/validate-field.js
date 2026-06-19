import { isNonEmptyArray } from "../array/is-non-empty-array";
import { size } from "../general/size";
import { isNumber } from "../number/is-number";
import { isNumeric } from "../number/is-numeric";
import { isNonEmptyObject } from "../object/is-non-empty-object";
import { isNonEmptyString } from "../string/is-non-empty-string";

/**
 * @helper validateField
 * @category Form
 * @signature validateField(fieldName: string, validationRules: object[], formData: object)
 * @description
 * Validate a field given its `fieldName`, the field's `validationRules`, and the sum total `formData`.
 *
 * @note
 * Returns `{ valid, errors, validated }`. If input is invalid (missing field name, rules, or form data), `validated` is false and the field is treated as valid.
 *
 * Available rules and properties include:
 *
 * #### `required`
 *
 * `[{ rule: "required", message: "Enter your name so we know what to call you" }]`
 *
 * Requires a value to be set.
 *
 * #### `email`
 *
 * `[{ rule: "email", message: "We need an email address to set up your account" }]`
 *
 * Perform a minimal check to see if the value contains an `@` symbol. More complex verification isn't really necessary, and the only true way to test an email address is through verification.
 *
 * #### `size`
 *
 * `[{ rule: "size", size: 11, message: "Your phone number should be 11 digits long" }]`
 *
 * Ensure that the provided value is has at least size `size`. For strings, the number of characters is used, for arrays, the length of the array, for objects, the number of properties, for numbers, the number itself is used, and for numeric strings the integer value of the string is used.
 *
 * #### `min`
 *
 * `[{ rule: "min", min: 11, message: "Your phone number should be at least 11 digits long" }]`
 *
 * Ensure that the provided value is has at least size `min`. Values are evaluated as in the `size` rule.
 *
 * #### `max`
 *
 * `[{ rule: "max", max: 11, message: "Your phone number should be no more than 11 digits long" }]`
 *
 * Ensure that the provided value is has at most size `max`. Values are evaluated as in the `size` rule.
 *
 * #### `between`
 *
 * `[{ rule: "between", min: 5, max: 8, message: "Your post code should be between 5 and 8 characters" }]`
 *
 * Ensure that the provided value is has between `min` and `max` size. Values are evaluated as in the `size` rule.
 *
 * #### `in`
 *
 * `[{ rule: "in", options: ["a", "b", "c"], message: "Your choice should be a, b, or c" }]`
 *
 * Ensure that the given value is included within `options`.
 *
 * #### `not_in`
 *
 * `[{ rule: "not_in", options: ["a", "b", "c"], message: "Your choice should not include a, b, or c" }]`
 *
 * Ensure that the given value is not included within `options`.
 *
 * #### `regexp`
 *
 * `[{ rule: "regexp", regexp: /[abc]+/, message: "Your ID should only contain the letters a, b, and c" }]`
 *
 * Ensure that the provided value matches `regexp`.
 *
 * @example
 * validateField("username", [{ rule: "required", message: "Enter a username" }], { username: "" }); // { valid: false, errors: ["Enter a username"], validated: true }
 * validateField("username", [{ rule: "required", message: "Enter a username" }], {
 * 	username: "jack_skellington",
 * }); // { valid: true, errors: [], validated: true }
 */
export function validateField(fieldName, validationRules, formData) {
	// If we can't determine all of the information we need, we can't validate,
	// but we also can't return a meaningful message. We could return a general
	// error, but we don't want that to be shown to the user unexpectedly.
	if (
		!isNonEmptyString(fieldName) ||
		!isNonEmptyArray(validationRules) ||
		!isNonEmptyObject(formData)
	) {
		return validationResult({ validated: false });
	}

	const validationErrors = [];

	for (const rule of validationRules) {
		if (!validateRule(fieldName, rule, formData)) {
			validationErrors.push(rule.message);
		}
	}

	return validationResult({ errors: validationErrors, validated: true });
}

/**
 * Build a structured validation result.
 *
 * @param  {object}  result
 *     The validation details.
 * @param  {string[]}  result.errors
 *     The validation error messages.
 * @param  {boolean}  result.validated
 *     Whether validation could run.
 */
function validationResult({ errors = [], validated = true } = {}) {
	return {
		errors,
		valid: errors.length === 0,
		validated,
	};
}

/**
 * Validate this field for a single rule.
 *
 * @param  {string}  fieldName
 *     The name of the field to validate, allowing us to retrieve its value from
 *     the form data.
 * @param  {object}  validationRule
 *     The rule to validate against, including any additional properties.
 * @param  {object}  formData
 *     The current values of each form field.
 */
function validateRule(fieldName, validationRule, formData) {
	// Retrieve our value from the form data.
	let value = formData?.[fieldName];

	if (value === undefined) {
		return false;
	}

	switch (validationRule.rule) {
		case "required":
			return ![undefined, "", false, null].includes(value);
		case "email":
			return value.includes("@");
		case "size":
			if (!isNumber(validationRule.size)) {
				return false;
			}

			if (isNumeric(value)) {
				value = parseInt(value);
			}

			return size(value) === validationRule.size;
		case "min":
			if (!isNumber(validationRule.min)) {
				return false;
			}

			if (isNumeric(value)) {
				value = parseInt(value);
			}

			return size(value) >= validationRule.min;
		case "max":
			if (!isNumber(validationRule.max)) {
				return false;
			}

			if (isNumeric(value)) {
				value = parseInt(value);
			}

			return size(value) <= validationRule.max;
		case "between": {
			if (!isNumber(validationRule.min) || !isNumber(validationRule.max)) {
				return false;
			}

			if (isNumeric(value)) {
				value = parseInt(value);
			}

			const valueSize = size(value);

			return valueSize >= validationRule.min && valueSize <= validationRule.max;
		}
		case "in":
			if (!isNonEmptyArray(validationRule.options)) {
				return false;
			}

			return validationRule.options.includes(value);
		case "not_in":
			if (!isNonEmptyArray(validationRule.options)) {
				return false;
			}

			return !validationRule.options.includes(value);
		case "regexp":
			if (!isNonEmptyString(value) || !(validationRule.regexp instanceof RegExp)) {
				return false;
			}

			return validationRule.regexp.test(value);
	}

	return true;
}
