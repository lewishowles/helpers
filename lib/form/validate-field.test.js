import { describe, expect, test } from "vite-plus/test";
import { validateField } from "./validate-field";

const fieldName = "username";
const formData = { [fieldName]: "jack_skellington" };

const validationRules = [
	{ rule: "required", message: "Required field message" },
	{ rule: "min", min: 5, message: "Min message" },
];

describe("validate-field", () => {
	describe("should pass if an invalid field name is provided", () => {
		test.for([
			["boolean (true)", true],
			["boolean (false)", false],
			["number (positive)", 1],
			["number (negative)", -1],
			["number (NaN)", NaN],
			["string (empty)", ""],
			["object (non-empty)", { property: "value" }],
			["object (empty)", {}],
			["array (non-empty)", [1, 2, 3]],
			["array (empty)", []],
			["null", null],
			["undefined", undefined],
		])("%s", ([, name]) => {
			expect(validateField(name, validationRules, formData)).toEqual({
				errors: [],
				valid: true,
				validated: false,
			});
		});
	});

	test("should pass if no validation rules are provided", () => {
		expect(validateField(fieldName, [], formData)).toEqual({
			errors: [],
			valid: true,
			validated: false,
		});
	});

	test("should pass if no form data is provided", () => {
		expect(validateField(fieldName, validationRules, {})).toEqual({
			errors: [],
			valid: true,
			validated: false,
		});
	});

	describe("Multiple rules", () => {
		test("should pass if all rules pass", () => {
			expect(
				validateField(fieldName, validationRules, { [fieldName]: "jack_skellington" }),
			).toEqual({
				errors: [],
				valid: true,
				validated: true,
			});
		});

		test("should fail if any rule fails", () => {
			expect(validateField(fieldName, validationRules, { [fieldName]: "jack" })).toEqual({
				errors: ["Min message"],
				valid: false,
				validated: true,
			});
		});

		test("should fail if all rules fail", () => {
			const validationRules = [
				{ rule: "min", min: 5, message: "Min message" },
				{ rule: "regexp", regexp: /abc/, message: "Regexp message" },
			];

			expect(validateField(fieldName, validationRules, { [fieldName]: "Jack" })).toEqual({
				errors: ["Min message", "Regexp message"],
				valid: false,
				validated: true,
			});
		});
	});

	describe("required", () => {
		test("should allow passing validation", () => {
			testValidationSuccess({ rule: "required", value: "jack_skellington" });
			testValidationSuccess({ rule: "required", value: 5 });
		});

		test("should detect failing validation", () => {
			testValidationFailure({ rule: "required", value: undefined });
			testValidationFailure({ rule: "required", value: "" });
			testValidationFailure({ rule: "required", value: false });
		});
	});

	describe("email", () => {
		test("should allow passing validation", () => {
			testValidationSuccess({ rule: "email", value: "jack_skellington@" });
		});

		test("should detect failing validation", () => {
			testValidationFailure({ rule: "email", value: "jack_skellington" });
		});
	});

	describe("size", () => {
		test("should fail without a provided minimum", () => {
			testValidationFailure({ rule: "size", value: "jack_skellington" });
		});

		describe("should fail with an invalid minimum", () => {
			test.for([
				["boolean (true)", true],
				["boolean (false)", false],
				["string (non-empty)", "string"],
				["string (empty)", ""],
				["object (non-empty)", { property: "value" }],
				["object (empty)", {}],
				["array (non-empty)", [1, 2, 3]],
				["array (empty)", []],
				["null", null],
				["undefined", undefined],
			])("%s", ([, size]) => {
				testValidationFailure({ rule: "size", size, value: "jack_skellington" });
			});
		});

		describe("should allow passing validation", () => {
			test("string", () => {
				testValidationSuccess({ rule: "size", size: 16, value: "jack_skellington" });
			});

			test("array", () => {
				testValidationSuccess({ rule: "size", size: 3, value: Array.from({ length: 3 }) });
			});

			test("object", () => {
				testValidationSuccess({ rule: "size", size: 3, value: { a: 1, b: 2, c: 3 } });
			});

			test("number", () => {
				testValidationSuccess({ rule: "size", size: 7, value: 7 });
			});

			test("numeric", () => {
				testValidationSuccess({ rule: "size", size: 7, value: "7" });
			});
		});

		describe("should detect failing validation", () => {
			test("string", () => {
				testValidationFailure({ rule: "size", size: 20, value: "jack_skellington" });
			});

			test("array", () => {
				testValidationFailure({ rule: "size", size: 4, value: Array.from({ length: 3 }) });
			});

			test("object", () => {
				testValidationFailure({ rule: "size", size: 4, value: { a: 1, b: 2, c: 3 } });
			});

			test("number", () => {
				testValidationFailure({ rule: "size", size: 8, value: 7 });
			});

			test("numeric", () => {
				testValidationFailure({ rule: "size", size: 8, value: "7" });
			});
		});
	});

	describe("min", () => {
		test("should fail without a provided minimum", () => {
			testValidationFailure({ rule: "min", value: "jack_skellington" });
		});

		describe("should fail with an invalid minimum", () => {
			test.for([
				["boolean (true)", true],
				["boolean (false)", false],
				["string (non-empty)", "string"],
				["string (empty)", ""],
				["object (non-empty)", { property: "value" }],
				["object (empty)", {}],
				["array (non-empty)", [1, 2, 3]],
				["array (empty)", []],
				["null", null],
				["undefined", undefined],
			])("%s", ([, min]) => {
				testValidationFailure({ rule: "min", min, value: "jack_skellington" });
			});
		});

		describe("should allow passing validation", () => {
			test("string", () => {
				testValidationSuccess({ rule: "min", min: 5, value: "jack_skellington" });
			});

			test("array", () => {
				testValidationSuccess({ rule: "min", min: 2, value: Array.from({ length: 3 }) });
			});

			test("object", () => {
				testValidationSuccess({ rule: "min", min: 2, value: { a: 1, b: 2, c: 3 } });
			});

			test("number", () => {
				testValidationSuccess({ rule: "min", min: 6, value: 7 });
			});

			test("numeric", () => {
				testValidationSuccess({ rule: "min", min: 6, value: "7" });
			});
		});

		describe("should detect failing validation", () => {
			test("string", () => {
				testValidationFailure({ rule: "min", min: 20, value: "jack_skellington" });
			});

			test("array", () => {
				testValidationFailure({ rule: "min", min: 4, value: Array.from({ length: 3 }) });
			});

			test("object", () => {
				testValidationFailure({ rule: "min", min: 4, value: { a: 1, b: 2, c: 3 } });
			});

			test("number", () => {
				testValidationFailure({ rule: "min", min: 8, value: 7 });
			});

			test("numeric", () => {
				testValidationFailure({ rule: "min", min: 8, value: "7" });
			});
		});
	});

	describe("max", () => {
		test("should fail without a provided max", () => {
			testValidationFailure({ rule: "max", value: "jack_skellington" });
		});

		describe("should fail with an invalid max", () => {
			test.for([
				["boolean (true)", true],
				["boolean (false)", false],
				["string (non-empty)", "string"],
				["string (empty)", ""],
				["object (non-empty)", { property: "value" }],
				["object (empty)", {}],
				["array (non-empty)", [1, 2, 3]],
				["array (empty)", []],
				["null", null],
				["undefined", undefined],
			])("%s", ([, max]) => {
				testValidationFailure({ rule: "max", max, value: "jack_skellington" });
			});
		});

		describe("should allow passing validation", () => {
			test("string", () => {
				testValidationSuccess({ rule: "max", max: 20, value: "jack_skellington" });
			});

			test("array", () => {
				testValidationSuccess({ rule: "max", max: 4, value: Array.from({ length: 3 }) });
			});

			test("object", () => {
				testValidationSuccess({ rule: "max", max: 4, value: { a: 1, b: 2, c: 3 } });
			});

			test("number", () => {
				testValidationSuccess({ rule: "max", max: 8, value: 7 });
			});

			test("numeric", () => {
				testValidationSuccess({ rule: "max", max: 8, value: "7" });
			});
		});

		describe("should detect failing validation", () => {
			test("string", () => {
				testValidationFailure({ rule: "max", max: 5, value: "jack_skellington" });
			});

			test("array", () => {
				testValidationFailure({ rule: "max", max: 2, value: Array.from({ length: 3 }) });
			});

			test("object", () => {
				testValidationFailure({ rule: "max", max: 2, value: { a: 1, b: 2, c: 3 } });
			});

			test("number", () => {
				testValidationFailure({ rule: "max", max: 6, value: 7 });
			});

			test("numeric", () => {
				testValidationFailure({ rule: "max", max: 6, value: "7" });
			});
		});
	});

	describe("between", () => {
		test("should fail without a provided between", () => {
			testValidationFailure({ rule: "between", value: "jack_skellington" });
		});

		describe("should fail with an invalid min", () => {
			test.for([
				["boolean (true)", true],
				["boolean (false)", false],
				["string (non-empty)", "string"],
				["string (empty)", ""],
				["object (non-empty)", { property: "value" }],
				["object (empty)", {}],
				["array (non-empty)", [1, 2, 3]],
				["array (empty)", []],
				["null", null],
				["undefined", undefined],
			])("%s", ([, min]) => {
				testValidationFailure({
					rule: "between",
					min,
					max: 100,
					value: "jack_skellington",
				});
			});
		});

		describe("should fail with an invalid max", () => {
			test.for([
				["boolean (true)", true],
				["boolean (false)", false],
				["string (non-empty)", "string"],
				["string (empty)", ""],
				["object (non-empty)", { property: "value" }],
				["object (empty)", {}],
				["array (non-empty)", [1, 2, 3]],
				["array (empty)", []],
				["null", null],
				["undefined", undefined],
			])("%s", ([, max]) => {
				testValidationFailure({
					rule: "between",
					min: 0,
					max,
					value: "jack_skellington",
				});
			});
		});

		describe("should allow passing validation", () => {
			test("string", () => {
				testValidationSuccess({
					rule: "between",
					min: 1,
					max: 20,
					value: "jack_skellington",
				});
			});

			test("array", () => {
				testValidationSuccess({
					rule: "between",
					min: 1,
					max: 4,
					value: Array.from({ length: 3 }),
				});
			});

			test("object", () => {
				testValidationSuccess({
					rule: "between",
					min: 1,
					max: 4,
					value: { a: 1, b: 2, c: 3 },
				});
			});

			test("number", () => {
				testValidationSuccess({
					rule: "between",
					min: 1,
					max: 8,
					value: 7,
				});
			});

			test("numeric", () => {
				testValidationSuccess({
					rule: "between",
					min: 1,
					max: 8,
					value: "7",
				});
			});
		});

		describe("should detect failing validation", () => {
			test("string", () => {
				testValidationFailure({
					rule: "between",
					min: 1,
					max: 5,
					value: "jack_skellington",
				});
			});

			test("array", () => {
				testValidationFailure({
					rule: "between",
					min: 1,
					max: 2,
					value: Array.from({ length: 3 }),
				});
			});

			test("object", () => {
				testValidationFailure({
					rule: "between",
					min: 1,
					max: 2,
					value: { a: 1, b: 2, c: 3 },
				});
			});

			test("number", () => {
				testValidationFailure({
					rule: "between",
					min: 1,
					max: 6,
					value: 7,
				});
			});

			test("numeric", () => {
				testValidationFailure({
					rule: "between",
					min: 1,
					max: 6,
					value: "7",
				});
			});
		});
	});

	describe("in", () => {
		test("should fail without provided options", () => {
			testValidationFailure({ rule: "in", value: "jack_skellington" });
		});

		describe("should fail with an invalid list of options", () => {
			test.for([
				["boolean (true)", true],
				["boolean (false)", false],
				["number (positive)", 1],
				["number (negative)", -1],
				["number (NaN)", NaN],
				["string (non-empty)", "string"],
				["string (empty)", ""],
				["array (empty)", []],
				["object (non-empty)", { property: "value" }],
				["object (empty)", {}],
				["null", null],
				["undefined", undefined],
			])("%s", ([, options]) => {
				testValidationFailure({ rule: "in", options, value: "jack_skellington" });
			});
		});

		test("should allow passing validation", () => {
			testValidationSuccess({ rule: "in", options: ["a", "b", "c"], value: "a" });
		});

		test("should detect failing validation", () => {
			testValidationFailure({ rule: "in", options: ["a", "b", "c"], value: "d" });
		});
	});

	describe("not_in", () => {
		test("should fail without provided options", () => {
			testValidationFailure({ rule: "not_in", value: "jack_skellington" });
		});

		describe("should fail with an invalid list of options", () => {
			test.for([
				["boolean (true)", true],
				["boolean (false)", false],
				["number (positive)", 1],
				["number (negative)", -1],
				["number (NaN)", NaN],
				["string (non-empty)", "string"],
				["string (empty)", ""],
				["array (empty)", []],
				["object (non-empty)", { property: "value" }],
				["object (empty)", {}],
				["null", null],
				["undefined", undefined],
			])("%s", ([, options]) => {
				testValidationFailure({ rule: "not_in", options, value: "jack_skellington" });
			});
		});

		test("should allow passing validation", () => {
			testValidationSuccess({ rule: "not_in", options: ["a", "b", "c"], value: "d" });
		});

		test("should detect failing validation", () => {
			testValidationFailure({ rule: "not_in", options: ["a", "b", "c"], value: "a" });
		});
	});

	describe("regexp", () => {
		test("should fail without a provided regexp", () => {
			testValidationFailure({ rule: "regexp", value: "jack_skellington" });
		});

		describe("should fail with an invalid regexp", () => {
			test.for([
				["boolean (true)", true],
				["boolean (false)", false],
				["number (positive)", 1],
				["number (negative)", -1],
				["number (NaN)", NaN],
				["string (non-empty)", "string"],
				["string (empty)", ""],
				["object (non-empty)", { property: "value" }],
				["object (empty)", {}],
				["null", null],
				["undefined", undefined],
			])("%s", ([, regexp]) => {
				testValidationFailure({ rule: "regexp", regexp, value: "jack_skellington" });
			});
		});

		test("should allow passing validation", () => {
			testValidationSuccess({ rule: "regexp", regexp: /[a-z]+/, value: "jack_skellington" });
		});

		test("should detect failing validation", () => {
			testValidationFailure({ rule: "regexp", regexp: /abc/, value: "jack_skellington" });
		});
	});

	describe("custom", () => {
		test("should fail without a validate function", () => {
			expect(
				validateField("endDate", [{ rule: "custom", message: "Error message" }], {
					endDate: "2026-01-02",
				}),
			).toEqual({ errors: ["Error message"], valid: false, validated: true });
		});

		test("should pass when validate returns truthy", () => {
			expect(
				validateField(
					"endDate",
					[{ rule: "custom", validate: () => true, message: "Error message" }],
					{ endDate: "2026-01-02" },
				),
			).toEqual({ errors: [], valid: true, validated: true });
		});

		test("should fail when validate returns falsy", () => {
			expect(
				validateField(
					"endDate",
					[{ rule: "custom", validate: () => false, message: "Error message" }],
					{ endDate: "2026-01-02" },
				),
			).toEqual({ errors: ["Error message"], valid: false, validated: true });
		});

		test("should receive the field value and the full form data", () => {
			const rules = [
				{
					rule: "custom",
					validate: (value, formData) => value > formData.startDate,
					message: "Error message",
				},
			];

			expect(
				validateField("endDate", rules, { startDate: "2026-01-01", endDate: "2026-01-02" }),
			).toEqual({ errors: [], valid: true, validated: true });

			expect(
				validateField("endDate", rules, { startDate: "2026-01-03", endDate: "2026-01-02" }),
			).toEqual({ errors: ["Error message"], valid: false, validated: true });
		});
	});

	describe("required_if", () => {
		describe("with a target value", () => {
			const rules = [
				{ rule: "required_if", field: "wantsNewsletter", value: true, message: "Error message" },
			];

			test("should fail when the condition is met and the value is missing", () => {
				expect(validateField("email", rules, { wantsNewsletter: true, email: "" })).toEqual({
					errors: ["Error message"],
					valid: false,
					validated: true,
				});
			});

			test("should pass when the condition is met and the value is present", () => {
				expect(validateField("email", rules, { wantsNewsletter: true, email: "jack@" })).toEqual({
					errors: [],
					valid: true,
					validated: true,
				});
			});

			test("should pass when the condition is not met", () => {
				expect(validateField("email", rules, { wantsNewsletter: false, email: "" })).toEqual({
					errors: [],
					valid: true,
					validated: true,
				});
			});
		});

		describe("without a target value", () => {
			const rules = [{ rule: "required_if", field: "nickname", message: "Error message" }];

			test("should fail when the named field is present and the value is missing", () => {
				expect(validateField("email", rules, { nickname: "jack", email: "" })).toEqual({
					errors: ["Error message"],
					valid: false,
					validated: true,
				});
			});

			test("should pass when the named field is empty", () => {
				expect(validateField("email", rules, { nickname: "", email: "" })).toEqual({
					errors: [],
					valid: true,
					validated: true,
				});
			});
		});
	});

	describe("same", () => {
		const rules = [{ rule: "same", field: "password", message: "Error message" }];

		test("should pass when the values match", () => {
			expect(
				validateField("passwordConfirmation", rules, {
					password: "boogie",
					passwordConfirmation: "boogie",
				}),
			).toEqual({ errors: [], valid: true, validated: true });
		});

		test("should fail when the values differ", () => {
			expect(
				validateField("passwordConfirmation", rules, {
					password: "boogie",
					passwordConfirmation: "oogie",
				}),
			).toEqual({ errors: ["Error message"], valid: false, validated: true });
		});
	});

	describe("different", () => {
		const rules = [{ rule: "different", field: "currentPassword", message: "Error message" }];

		test("should pass when the values differ", () => {
			expect(
				validateField("newPassword", rules, {
					currentPassword: "boogie",
					newPassword: "oogie",
				}),
			).toEqual({ errors: [], valid: true, validated: true });
		});

		test("should fail when the values match", () => {
			expect(
				validateField("newPassword", rules, {
					currentPassword: "boogie",
					newPassword: "boogie",
				}),
			).toEqual({ errors: ["Error message"], valid: false, validated: true });
		});
	});
});

/**
 * Standardised validation success test based on the provided rule, options and
 * value.
 *
 * @param  {string}  configuration.rule
 *     The rule to test against.
 * @param  {unknown}  configuration.value
 *     The value to test.
 * @param  {object}  [configuration.options]
 *     Any additional options required by the rule.
 */
function testValidationSuccess(configuration) {
	testValidationOutput(configuration, true);
}

/**
 * Standardised validation failure test based on the provided rule, options and
 * value.
 *
 * Any configuration values except `rule` and `value` will be used as options
 * for the validation.
 *
 * @param  {string}  configuration.rule
 *     The rule to test against.
 * @param  {unknown}  configuration.value
 *     The value to test.
 * @param  {object}  [configuration.options]
 *     Any additional options required by the rule.
 */
function testValidationFailure(configuration) {
	testValidationOutput(configuration, false);
}

/**
 * Standardised validation failure test based on the provided rule, options and value.
 *
 * @param  {string}  configuration.rule
 *     The rule to test against.
 * @param  {unknown}  configuration.value
 *     The value to test.
 * @param  {object}  [configuration.options]
 *     Any additional options required by the rule.
 * @param  {boolean}  shouldPass
 *     Whether the validation is expected to pass.
 */
function testValidationOutput({ rule, value, ...options } = {}, shouldPass = true) {
	const output = shouldPass
		? { errors: [], valid: true, validated: true }
		: { errors: ["Error message"], valid: false, validated: true };

	expect(
		validateField(fieldName, [{ rule: rule, ...options, message: "Error message" }], {
			[fieldName]: value,
		}),
	).toEqual(output);
}
