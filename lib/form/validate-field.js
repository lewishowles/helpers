import { isNonEmptyArray } from "#array/is-non-empty-array";
import { hasDateParts } from "#date/has-date-parts";
import { toDateFromParts } from "#date/to-date-from-parts";
import { isFunction } from "#general/is-function";
import { size } from "#general/size";
import { isNumber } from "#number/is-number";
import { isNumeric } from "#number/is-numeric";
import { isNonEmptyObject } from "#object/is-non-empty-object";
import { isNonEmptyString } from "#string/is-non-empty-string";

/**
 * @helper validateField
 * @category Form
 * @signature validateField(fieldName: string, validationRules: object[], formData: object): Promise<ValidationResult>
 * @description
 * Validate a field given its `fieldName`, the field's `validationRules`, and
 * the sum total `formData`.
 *
 * @param  {string}  fieldName
 *     The name of the field to validate.
 * @param  {object[]}  validationRules
 *     The rules, schemas, or validation functions to apply.
 * @param  {object}  formData
 *     The current values of each form field.
 *
 * @returns  {Promise<object>}
 *     The field result: whether it is valid, its error messages, and whether
 *     validation ran.
 *
 * @note
 * Returns `{ valid, errors, validated }`. If input is invalid (missing field
 * name, rules, or form data), `validated` is false and the field is treated as
 * valid.
 *
 * Available rules and properties include:
 *
 * Single-field rules other than `required` pass when the field has no value.
 * Combine them with `required` or `required_if` when empty values should fail.
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
 * Perform a minimal check to see if the value contains an `@` symbol. More
 * complex verification isn't really necessary, and the only true way to test an
 * email address is through verification.
 *
 * #### `size`
 *
 * `[{ rule: "size", size: 11, message: "Your phone number should be 11 digits long" }]`
 *
 * Ensure that the provided value is has at least size `size`. For strings, the
 * number of characters is used, for arrays, the length of the array, for
 * objects, the number of properties, for numbers, the number itself is used,
 * and for numeric strings the integer value of the string is used.
 *
 * #### `min`
 *
 * `[{ rule: "min", min: 11, message: "Your phone number should be at least 11 digits long" }]`
 *
 * Ensure that the provided value is has at least size `min`. Values are
 * evaluated as in the `size` rule.
 *
 * #### `max`
 *
 * `[{ rule: "max", max: 11, message: "Your phone number should be no more than 11 digits long" }]`
 *
 * Ensure that the provided value is has at most size `max`. Values are
 * evaluated as in the `size` rule.
 *
 * #### `between`
 *
 * `[{ rule: "between", min: 5, max: 8, message: "Your post code should be between 5 and 8 characters" }]`
 *
 * Ensure that the provided value is has between `min` and `max` size. Values
 * are evaluated as in the `size` rule.
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
 * #### `valid_date`
 *
 * `[{ rule: "valid_date", message: "Enter a complete date" }]`
 *
 * Validate `{ day, month, year }` date-parts objects when the user has entered
 * at least one part. Empty or missing values pass so presence remains the job
 * of `required` and `required_if`.
 *
 * #### `custom`
 *
 * `[{ rule: "custom", validate: (value, formData) => value > formData.startDate, message: "Your end date should be after your start date" }]`
 *
 * The escape hatch for any rule the declarative rules can't express, including
 * cross-field validation. `validate` receives the field's own `value` and the
 * complete `formData`, and should return a truthy value to pass. A `custom`
 * rule without a `validate` function always fails.
 *
 * #### Standard Schema
 *
 * Any object with a `~standard` property (Zod, Valibot, ArkType schemas) is
 * detected and validated through the [Standard
 * Schema](https://github.com/standard-schema/standard-schema) interface. The
 * schema's `~standard.validate(value)` is called, and any returned issues are
 * mapped to error strings. Schemas can return results synchronously or
 * asynchronously.
 *
 * ```js
 * import { z } from "zod";
 * const schema = z.string().email("Enter a valid email address");
 * validateField("email", [schema], { email: "not-an-email" });
 * // { valid: false, errors: ["Enter a valid email address"], validated: true }
 * ```
 *
 * Schemas, object rules, and function shorthand can be freely mixed in the same
 * rules array.
 *
 * #### Function shorthand
 *
 * `[(value, formData) => value.includes("@") || "Enter a valid email address"]`
 *
 * A bare function in the rules array is a shorthand for `custom` validation
 * without a separate `message` property. The function receives the field's own
 * `value` and the complete `formData`, and its return value determines the
 * outcome:
 *
 * | Return value | Result |
 * | --- | --- |
 * | Non-empty string | Single error — the string is the error message |
 * | Non-empty array of non-empty strings | Multiple errors — each string is a separate error message |
 * | Any other value | Valid — no error |
 *
 * This mirrors the `custom` rule's `(value, formData)` signature, but inverts
 * the convention: instead of returning a boolean and reading the message from
 * the rule object, the function returns the error message(s) directly when
 * validation fails. Functions and object rules can be freely mixed in the same
 * rules array.
 *
 * #### `required_if`
 *
 * `[{ rule: "required_if", field: "wantsNewsletter", value: true, message: "Enter an email address to receive the newsletter" }]`
 *
 * Requires a value to be set, but only when another field's value meets a
 * condition. When `value` is provided, the condition is met when
 * `formData[field]` strictly equals it. When `value` is omitted, the condition
 * is met when `formData[field]` has a value.
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
 * await validateField("username", [{ rule: "required", message: "Enter a username" }], { username: "" }); // { valid: false, errors: ["Enter a username"], validated: true }
 * await validateField("username", [{ rule: "required", message: "Enter a username" }], {
 * 	username: "jack_skellington",
 * }); // { valid: true, errors: [], validated: true }
 * await validateField("email", [
 * 	{ rule: "required", message: "Enter your email" },
 * 	(value) => value.includes("@") || "Enter a valid email address",
 * ], { email: "not-an-email" }); // { valid: false, errors: ["Enter a valid email address"], validated: true }
 */
export async function validateField(fieldName, validationRules, formData) {
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

	// Collect messages from every failing rule.
	const validationErrors = [];

	for (const rule of validationRules) {
		if (isNonEmptyObject(rule) && "~standard" in rule) {
			// Keep the outcome returned by this rule.
			const result = await rule["~standard"].validate(formData?.[fieldName]);

			if (isNonEmptyArray(result?.issues)) {
				validationErrors.push(...result.issues.map((issue) => issue.message));
			}

			continue;
		}

		if (isFunction(rule)) {
			// Keep the outcome returned by this rule.
			const result = await rule(formData?.[fieldName], formData);

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
 *
 * @returns  {object}
 *     The field result: whether it is valid, its error messages, and whether
 *     validation ran.
 */
function validationResult(result = {}) {
	// Fill in details omitted by the caller.
	const { errors = [], validated = true } = result;

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
 *
 * @returns  {boolean}
 *     Whether the rule passes.
 */
function validateRule(fieldName, rule, formData) {
	// Select the validator for the named rule.
	const validator = validators[rule.rule];

	if (!isFunction(validator)) {
		return true;
	}

	return validator({ value: formData?.[fieldName], rule, formData });
}

/**
 * Wrap a single-field validator so missing values pass without each optional
 * validator needing to guard for them. Presence remains the job of `required`
 * and `required_if`.
 *
 * @param  {Function}  validate
 *     The validator to wrap.
 *
 * @returns  {Function}
 *     A validator that passes when the value is missing and otherwise runs
 *     `validate`.
 */
function requiresValue(validate) {
	return (context) => !isPresent(context.value) || validate(context);
}

/**
 * Normalise a numeric string to its integer value so that size-based rules can
 * compare numbers and numeric strings consistently.
 *
 * @param  {unknown}  value
 *     The value to normalise.
 *
 * @returns  {any}
 *     The value converted to an integer when numeric.
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
 *
 * @returns  {boolean}
 *     Whether the value is present.
 */
function isPresent(value) {
	if (Array.isArray(value)) {
		return isNonEmptyArray(value);
	}

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
 *
 * @returns  {boolean}
 *     Whether the `required_if` condition is met.
 */
function isConditionMet(rule, formData) {
	// Read the field that controls this condition.
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
	/**
	 * Require a value to be present.
	 *
	 * @param  {object}  options
	 *     The input passed to the validator.
	 * @param  {any}  options.value
	 *     The field value to check.
	 *
	 * @returns  {boolean}
	 *     Whether the rule passes.
	 */
	required: ({ value }) => isPresent(value),
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

		// Measure the value for the range check.
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
	/**
	 * Accept complete date parts that form a valid date.
	 *
	 * @param  {object}  options
	 *     The input passed to the validator.
	 * @param  {any}  options.value
	 *     The field value to check.
	 *
	 * @returns  {boolean}
	 *     Whether the rule passes.
	 */
	valid_date: ({ value }) => !hasDateParts(value) || toDateFromParts(value) !== null,

	// Cross-field rules. These see the full form data and so are deliberately
	// not wrapped by `requiresValue`.
	/**
	 * Run the supplied rule against the field and form.
	 *
	 * @param  {object}  options
	 *     The field value, rule, and form data to check.
	 * @param  {any}  options.value
	 *     The field value to check.
	 * @param  {object}  options.rule
	 *     The rule being checked.
	 * @param  {object}  options.formData
	 *     The other field values used for comparison.
	 *
	 * @returns  {boolean}
	 *     Whether the rule passes.
	 */
	custom: ({ value, rule, formData }) =>
		isFunction(rule.validate) && Boolean(rule.validate(value, formData)),
	/**
	 * Require a value when the related field meets its condition.
	 *
	 * @param  {object}  options
	 *     The field value, rule, and form data to check.
	 * @param  {any}  options.value
	 *     The field value to check.
	 * @param  {object}  options.rule
	 *     The rule being checked.
	 * @param  {object}  options.formData
	 *     The other field values used for comparison.
	 *
	 * @returns  {boolean}
	 *     Whether the rule passes.
	 */
	required_if: ({ value, rule, formData }) => !isConditionMet(rule, formData) || isPresent(value),
	/**
	 * Check that this field matches another field.
	 *
	 * @param  {object}  options
	 *     The field value, rule, and form data to check.
	 * @param  {any}  options.value
	 *     The field value to check.
	 * @param  {object}  options.rule
	 *     The rule being checked.
	 * @param  {object}  options.formData
	 *     The other field values used for comparison.
	 *
	 * @returns  {boolean}
	 *     Whether the rule passes.
	 */
	same: ({ value, rule, formData }) => value === formData?.[rule.field],
	/**
	 * Check that this field differs from another field.
	 *
	 * @param  {object}  options
	 *     The field value, rule, and form data to check.
	 * @param  {any}  options.value
	 *     The field value to check.
	 * @param  {object}  options.rule
	 *     The rule being checked.
	 * @param  {object}  options.formData
	 *     The other field values used for comparison.
	 *
	 * @returns  {boolean}
	 *     Whether the rule passes.
	 */
	different: ({ value, rule, formData }) => value !== formData?.[rule.field],
};
