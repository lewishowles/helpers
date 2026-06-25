import { isNonEmptyArray } from "../array/is-non-empty-array";
import { isFunction } from "../general/is-function";
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
 * #### `custom`
 *
 * `[{ rule: "custom", validate: (value, formData) => value > formData.startDate, message: "Your end date should be after your start date" }]`
 *
 * The escape hatch for any rule the declarative rules can't express, including cross-field validation. `validate` receives the field's own `value` and the complete `formData`, and should return a truthy value to pass. A `custom` rule without a `validate` function always fails.
 *
 * #### Function shorthand
 *
 * `[(value, formData) => value.includes("@") || "Enter a valid email address"]`
 *
 * A bare function in the rules array is a shorthand for `custom` validation without a separate `message` property. The function receives the field's own `value` and the complete `formData`, and its return value determines the outcome:
 *
 * | Return value | Result |
 * | --- | --- |
 * | Non-empty string | Single error — the string is the error message |
 * | Non-empty array of non-empty strings | Multiple errors — each string is a separate error message |
 * | Any other value | Valid — no error |
 *
 * This mirrors the `custom` rule's `(value, formData)` signature, but inverts the convention: instead of returning a boolean and reading the message from the rule object, the function returns the error message(s) directly when validation fails. Functions and object rules can be freely mixed in the same rules array.
 *
 * #### `required_if`
 *
 * `[{ rule: "required_if", field: "wantsNewsletter", value: true, message: "Enter an email address to receive the newsletter" }]`
 *
 * Requires a value to be set, but only when another field's value meets a condition. When `value` is provided, the condition is met when `formData[field]` strictly equals it. When `value` is omitted, the condition is met when `formData[field]` has a value.
 *
 * #### `same`
 *
 * `[{ rule: "same", field: "password", message: "Your passwords should match" }]`
 *
 * Ensure that the value matches the value of another field.
 *
 * #### `different`
 *
 * `[{ rule: "different", field: "currentPassword", message: "Your new password should differ from your current one" }]`
 *
 * Ensure that the value differs from the value of another field.
 *
 * @example
 * validateField("username", [{ rule: "required", message: "Enter a username" }], { username: "" }); // { valid: false, errors: ["Enter a username"], validated: true }
 * validateField("username", [{ rule: "required", message: "Enter a username" }], {
 * 	username: "jack_skellington",
 * }); // { valid: true, errors: [], validated: true }
 * validateField("email", [
 * 	{ rule: "required", message: "Enter your email" },
 * 	(value) => value.includes("@") || "Enter a valid email address",
 * ], { email: "not-an-email" }); // { valid: false, errors: ["Enter a valid email address"], validated: true }
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
		if (isFunction(rule)) {
			const result = rule(formData?.[fieldName], formData);

			if (isNonEmptyString(result)) {
				validationErrors.push(result);
			} else if (isNonEmptyArray(result)) {
				validationErrors.push(...result.filter(isNonEmptyString));
			}

			continue;
		}

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
 * Validate this field for a single rule by dispatching to the matching
 * validator. An unrecognised rule can't meaningfully fail, so it passes.
 *
 * @param  {string}  fieldName
 *     The name of the field to validate, allowing us to retrieve its value from
 *     the form data.
 * @param  {object}  rule
 *     The rule to validate against, including any additional properties.
 * @param  {object}  formData
 *     The current values of each form field.
 */
function validateRule(fieldName, rule, formData) {
	const validator = validators[rule.rule];

	if (!isFunction(validator)) {
		return true;
	}

	return validator({ value: formData?.[fieldName], rule, formData });
}

/**
 * Wrap a single-field validator so that a missing value (`undefined`) is treated
 * as a failure without each validator needing to guard for it. Cross-field
 * validators are intentionally left unwrapped so they can inspect the full form
 * data even when their own field has no value.
 *
 * @param  {Function}  validate
 *     The validator to wrap.
 */
function requiresValue(validate) {
	return (context) => context.value !== undefined && validate(context);
}

/**
 * Normalise a numeric string to its integer value so that size-based rules can
 * compare numbers and numeric strings consistently.
 *
 * @param  {unknown}  value
 *     The value to normalise.
 */
function normaliseNumeric(value) {
	return isNumeric(value) ? parseInt(value) : value;
}

/**
 * Whether a value is considered "present" for the purposes of `required` and
 * `required_if`.
 *
 * @param  {unknown}  value
 *     The value to check.
 */
function isPresent(value) {
	return ![undefined, "", false, null].includes(value);
}

/**
 * Determine whether a `required_if` rule's condition is met. When the rule
 * specifies a `value`, the condition is met when the named field strictly
 * equals it. Otherwise the condition is met when the named field has a value.
 *
 * @param  {object}  rule
 *     The `required_if` rule.
 * @param  {object}  formData
 *     The current values of each form field.
 */
function isConditionMet(rule, formData) {
	const conditionValue = formData?.[rule.field];

	if ("value" in rule) {
		return conditionValue === rule.value;
	}

	return isPresent(conditionValue);
}

// A registry of validators keyed by rule name. Each validator receives the
// field's own `value`, the `rule` definition, and the complete `formData`, and
// returns whether the rule passes.
const validators = {
	required: requiresValue(({ value }) => isPresent(value)),
	email: requiresValue(({ value }) => value.includes("@")),
	size: requiresValue(({ value, rule }) => {
		if (!isNumber(rule.size)) {
			return false;
		}

		return size(normaliseNumeric(value)) === rule.size;
	}),
	min: requiresValue(({ value, rule }) => {
		if (!isNumber(rule.min)) {
			return false;
		}

		return size(normaliseNumeric(value)) >= rule.min;
	}),
	max: requiresValue(({ value, rule }) => {
		if (!isNumber(rule.max)) {
			return false;
		}

		return size(normaliseNumeric(value)) <= rule.max;
	}),
	between: requiresValue(({ value, rule }) => {
		if (!isNumber(rule.min) || !isNumber(rule.max)) {
			return false;
		}

		const valueSize = size(normaliseNumeric(value));

		return valueSize >= rule.min && valueSize <= rule.max;
	}),
	in: requiresValue(
		({ value, rule }) => isNonEmptyArray(rule.options) && rule.options.includes(value),
	),
	not_in: requiresValue(
		({ value, rule }) => isNonEmptyArray(rule.options) && !rule.options.includes(value),
	),
	regexp: requiresValue(
		({ value, rule }) =>
			isNonEmptyString(value) && rule.regexp instanceof RegExp && rule.regexp.test(value),
	),

	// Cross-field rules. These see the full form data and so are deliberately not
	// wrapped by `requiresValue`.
	custom: ({ value, rule, formData }) =>
		isFunction(rule.validate) && Boolean(rule.validate(value, formData)),
	required_if: ({ value, rule, formData }) => !isConditionMet(rule, formData) || isPresent(value),
	same: ({ value, rule, formData }) => value === formData?.[rule.field],
	different: ({ value, rule, formData }) => value !== formData?.[rule.field],
};
