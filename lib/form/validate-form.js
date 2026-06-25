import { isNonEmptyArray } from "../array/is-non-empty-array";
import { isNonEmptyObject } from "../object/is-non-empty-object";
import { validateField } from "./validate-field";

/**
 * @helper validateForm
 * @category Form
 * @signature validateForm(fields: object, formData: object)
 * @description
 * Validate multiple fields at once, delegating to `validateField` for each
 * field's rules. Cross-field rules (`same`, `different`, `required_if`,
 * `custom`) work naturally because the full `formData` is passed through to
 * each field.
 *
 * @note
 * Returns `{ valid, validated, results }`. If input is invalid (non-object
 * `fields` or `formData`), `validated` is `false` and the form is treated as
 * valid — the same convention as `validateField`.
 *
 * `results` contains a `validateField` result for each field that had a
 * non-empty rules array. Fields with empty or non-array rules are skipped and
 * omitted from `results`. The overall `valid` is `false` only when a field has
 * `valid: false`. Fields with `validated: false` (skipped) don't make the form
 * invalid.
 *
 * @example
 * validateForm({
 * 	username: [{ rule: "required", message: "Enter a username" }],
 * 	email: [
 * 		{ rule: "required", message: "Enter your email" },
 * 		(value) => value.includes("@") || "Enter a valid email address",
 * 	],
 * }, { username: "jack", email: "not-an-email" });
 * // {
 * //   valid: false,
 * //   validated: true,
 * //   results: {
 * //     username: { valid: true, errors: [], validated: true },
 * //     email: { valid: false, errors: ["Enter a valid email address"], validated: true },
 * //   },
 * // }
 */
export function validateForm(fields, formData) {
	if (!isNonEmptyObject(fields) || !isNonEmptyObject(formData)) {
		return { valid: true, validated: false, results: {} };
	}

	const results = {};

	let valid = true;

	for (const fieldName in fields) {
		if (!Object.hasOwn(fields, fieldName)) {
			continue;
		}

		const fieldRules = fields[fieldName];

		if (!isNonEmptyArray(fieldRules)) {
			continue;
		}

		const result = validateField(fieldName, fieldRules, formData);

		results[fieldName] = result;

		if (result.valid === false) {
			valid = false;
		}
	}

	return { valid, validated: true, results };
}
