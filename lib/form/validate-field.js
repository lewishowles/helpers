import { isNonEmptyArray } from "@array";
import { isNonEmptyObject } from "@object";
import { isNonEmptyString } from "@string";
import { isNumber, isNumeric } from "@number";
import { size } from "@general";

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
	let value = formData?.[fieldName];

	if (value === undefined) {
		return false;
	}

	switch(validationRule.rule) {
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
