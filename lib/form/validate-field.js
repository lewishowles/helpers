import { isNonEmptyArray } from "@array";
import { isNonEmptyObject } from "@object";
import { isNonEmptyString } from "@string";
import { isNumber } from "@number";

/**
 * Validate this field for all provided validation rules.
 *
 * @param  {string}  fieldName
 *     The name of the field to validate, allowing us to retrieve its value from
 *     the form data.
 * @param  {array}  validationRules
 *     The rules to validate the field against.
 * @param  {object}  formData
 *     The current values of each form field.
 */
export function validateField(fieldName, validationRules, formData) {
	// If we can't determine all of the information we need, we can't validate,
	// but we also can't return a meaningful message. We could return a general
	// error, but we don't want that to be shown to the user unexpectedly.
	if (!isNonEmptyString(fieldName) || !isNonEmptyArray(validationRules) || !isNonEmptyObject(formData)) {
		return true;
	}

	const validationErrors = [];

	for (const rule of validationRules) {
		if (!validateRule(fieldName, rule, formData)) {
			validationErrors.push(rule.message);
		}
	}

	return validationErrors;
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
	const value = formData?.[fieldName];

	if (value === undefined) {
		return false;
	}

	switch(validationRule.rule) {
		case "required":
			return isNonEmptyString(value);
		case "email":
			return value.includes("@");
		case "minimum_length":
			if (!isNonEmptyString(value) || !isNumber(validationRule.length)) {
				return false;
			}

			return value.length >= validationRule.length;
		case "maximum_length":
			if (!isNonEmptyString(value) || !isNumber(validationRule.length)) {
				return false;
			}

			return value.length <= validationRule.length;
		case "regexp":
			if (!isNonEmptyString(value) || !(validationRule.regexp instanceof RegExp)) {
				return false;
			}

			return validationRule.regexp.test(value);
	}

	return true;
}
