import { describe, expect, test, vi } from "vite-plus/test";
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
		])("%s", async ([, name]) => {
			expect(await validateField(name, validationRules, formData)).toEqual({
				errors: [],
				valid: true,
				validated: false,
			});
		});
	});

	test("should pass if no validation rules are provided", async () => {
		expect(await validateField(fieldName, [], formData)).toEqual({
			errors: [],
			valid: true,
			validated: false,
		});
	});

	test("should pass if no form data is provided", async () => {
		expect(await validateField(fieldName, validationRules, {})).toEqual({
			errors: [],
			valid: true,
			validated: false,
		});
	});

	describe("Multiple rules", () => {
		test("should pass if all rules pass", async () => {
			expect(
				await validateField(fieldName, validationRules, { [fieldName]: "jack_skellington" }),
			).toEqual({
				errors: [],
				valid: true,
				validated: true,
			});
		});

		test("should fail if any rule fails", async () => {
			expect(await validateField(fieldName, validationRules, { [fieldName]: "jack" })).toEqual({
				errors: ["Min message"],
				valid: false,
				validated: true,
			});
		});

		test("should fail if all rules fail", async () => {
			const validationRules = [
				{ rule: "min", min: 5, message: "Min message" },
				{ rule: "regexp", regexp: /abc/, message: "Regexp message" },
			];

			expect(await validateField(fieldName, validationRules, { [fieldName]: "Jack" })).toEqual({
				errors: ["Min message", "Regexp message"],
				valid: false,
				validated: true,
			});
		});
	});

	describe("required", () => {
		test("should allow passing validation", async () => {
			await testValidationSuccess({ rule: "required", value: "jack_skellington" });
			await testValidationSuccess({ rule: "required", value: 5 });
		});

		test("should detect failing validation", async () => {
			await testValidationFailure({ rule: "required", value: undefined });
			await testValidationFailure({ rule: "required", value: "" });
			await testValidationFailure({ rule: "required", value: false });
		});
	});

	describe("email", () => {
		test("should allow passing validation", async () => {
			await testValidationSuccess({ rule: "email", value: "jack_skellington@" });
		});

		test("should detect failing validation", async () => {
			await testValidationFailure({ rule: "email", value: "jack_skellington" });
		});
	});

	describe("size", () => {
		test("should fail without a provided minimum", async () => {
			await testValidationFailure({ rule: "size", value: "jack_skellington" });
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
			])("%s", async ([, size]) => {
				await testValidationFailure({ rule: "size", size, value: "jack_skellington" });
			});
		});

		describe("should allow passing validation", () => {
			test("string", async () => {
				await testValidationSuccess({ rule: "size", size: 16, value: "jack_skellington" });
			});

			test("array", async () => {
				await testValidationSuccess({ rule: "size", size: 3, value: Array.from({ length: 3 }) });
			});

			test("object", async () => {
				await testValidationSuccess({ rule: "size", size: 3, value: { a: 1, b: 2, c: 3 } });
			});

			test("number", async () => {
				await testValidationSuccess({ rule: "size", size: 7, value: 7 });
			});

			test("numeric", async () => {
				await testValidationSuccess({ rule: "size", size: 7, value: "7" });
			});
		});

		describe("should detect failing validation", () => {
			test("string", async () => {
				await testValidationFailure({ rule: "size", size: 20, value: "jack_skellington" });
			});

			test("array", async () => {
				await testValidationFailure({ rule: "size", size: 4, value: Array.from({ length: 3 }) });
			});

			test("object", async () => {
				await testValidationFailure({ rule: "size", size: 4, value: { a: 1, b: 2, c: 3 } });
			});

			test("number", async () => {
				await testValidationFailure({ rule: "size", size: 8, value: 7 });
			});

			test("numeric", async () => {
				await testValidationFailure({ rule: "size", size: 8, value: "7" });
			});
		});
	});

	describe("min", () => {
		test("should fail without a provided minimum", async () => {
			await testValidationFailure({ rule: "min", value: "jack_skellington" });
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
			])("%s", async ([, min]) => {
				await testValidationFailure({ rule: "min", min, value: "jack_skellington" });
			});
		});

		describe("should allow passing validation", () => {
			test("string", async () => {
				await testValidationSuccess({ rule: "min", min: 5, value: "jack_skellington" });
			});

			test("array", async () => {
				await testValidationSuccess({ rule: "min", min: 2, value: Array.from({ length: 3 }) });
			});

			test("object", async () => {
				await testValidationSuccess({ rule: "min", min: 2, value: { a: 1, b: 2, c: 3 } });
			});

			test("number", async () => {
				await testValidationSuccess({ rule: "min", min: 6, value: 7 });
			});

			test("numeric", async () => {
				await testValidationSuccess({ rule: "min", min: 6, value: "7" });
			});
		});

		describe("should detect failing validation", () => {
			test("string", async () => {
				await testValidationFailure({ rule: "min", min: 20, value: "jack_skellington" });
			});

			test("array", async () => {
				await testValidationFailure({ rule: "min", min: 4, value: Array.from({ length: 3 }) });
			});

			test("object", async () => {
				await testValidationFailure({ rule: "min", min: 4, value: { a: 1, b: 2, c: 3 } });
			});

			test("number", async () => {
				await testValidationFailure({ rule: "min", min: 8, value: 7 });
			});

			test("numeric", async () => {
				await testValidationFailure({ rule: "min", min: 8, value: "7" });
			});
		});
	});

	describe("max", () => {
		test("should fail without a provided max", async () => {
			await testValidationFailure({ rule: "max", value: "jack_skellington" });
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
			])("%s", async ([, max]) => {
				await testValidationFailure({ rule: "max", max, value: "jack_skellington" });
			});
		});

		describe("should allow passing validation", () => {
			test("string", async () => {
				await testValidationSuccess({ rule: "max", max: 20, value: "jack_skellington" });
			});

			test("array", async () => {
				await testValidationSuccess({ rule: "max", max: 4, value: Array.from({ length: 3 }) });
			});

			test("object", async () => {
				await testValidationSuccess({ rule: "max", max: 4, value: { a: 1, b: 2, c: 3 } });
			});

			test("number", async () => {
				await testValidationSuccess({ rule: "max", max: 8, value: 7 });
			});

			test("numeric", async () => {
				await testValidationSuccess({ rule: "max", max: 8, value: "7" });
			});
		});

		describe("should detect failing validation", () => {
			test("string", async () => {
				await testValidationFailure({ rule: "max", max: 5, value: "jack_skellington" });
			});

			test("array", async () => {
				await testValidationFailure({ rule: "max", max: 2, value: Array.from({ length: 3 }) });
			});

			test("object", async () => {
				await testValidationFailure({ rule: "max", max: 2, value: { a: 1, b: 2, c: 3 } });
			});

			test("number", async () => {
				await testValidationFailure({ rule: "max", max: 6, value: 7 });
			});

			test("numeric", async () => {
				await testValidationFailure({ rule: "max", max: 6, value: "7" });
			});
		});
	});

	describe("between", () => {
		test("should fail without a provided between", async () => {
			await testValidationFailure({ rule: "between", value: "jack_skellington" });
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
			])("%s", async ([, min]) => {
				await testValidationFailure({
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
			])("%s", async ([, max]) => {
				await testValidationFailure({
					rule: "between",
					min: 0,
					max,
					value: "jack_skellington",
				});
			});
		});

		describe("should allow passing validation", () => {
			test("string", async () => {
				await testValidationSuccess({
					rule: "between",
					min: 1,
					max: 20,
					value: "jack_skellington",
				});
			});

			test("array", async () => {
				await testValidationSuccess({
					rule: "between",
					min: 1,
					max: 4,
					value: Array.from({ length: 3 }),
				});
			});

			test("object", async () => {
				await testValidationSuccess({
					rule: "between",
					min: 1,
					max: 4,
					value: { a: 1, b: 2, c: 3 },
				});
			});

			test("number", async () => {
				await testValidationSuccess({
					rule: "between",
					min: 1,
					max: 8,
					value: 7,
				});
			});

			test("numeric", async () => {
				await testValidationSuccess({
					rule: "between",
					min: 1,
					max: 8,
					value: "7",
				});
			});
		});

		describe("should detect failing validation", () => {
			test("string", async () => {
				await testValidationFailure({
					rule: "between",
					min: 1,
					max: 5,
					value: "jack_skellington",
				});
			});

			test("array", async () => {
				await testValidationFailure({
					rule: "between",
					min: 1,
					max: 2,
					value: Array.from({ length: 3 }),
				});
			});

			test("object", async () => {
				await testValidationFailure({
					rule: "between",
					min: 1,
					max: 2,
					value: { a: 1, b: 2, c: 3 },
				});
			});

			test("number", async () => {
				await testValidationFailure({
					rule: "between",
					min: 1,
					max: 6,
					value: 7,
				});
			});

			test("numeric", async () => {
				await testValidationFailure({
					rule: "between",
					min: 1,
					max: 6,
					value: "7",
				});
			});
		});
	});

	describe("in", () => {
		test("should fail without provided options", async () => {
			await testValidationFailure({ rule: "in", value: "jack_skellington" });
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
			])("%s", async ([, options]) => {
				await testValidationFailure({ rule: "in", options, value: "jack_skellington" });
			});
		});

		test("should allow passing validation", async () => {
			await testValidationSuccess({ rule: "in", options: ["a", "b", "c"], value: "a" });
		});

		test("should detect failing validation", async () => {
			await testValidationFailure({ rule: "in", options: ["a", "b", "c"], value: "d" });
		});
	});

	describe("not_in", () => {
		test("should fail without provided options", async () => {
			await testValidationFailure({ rule: "not_in", value: "jack_skellington" });
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
			])("%s", async ([, options]) => {
				await testValidationFailure({ rule: "not_in", options, value: "jack_skellington" });
			});
		});

		test("should allow passing validation", async () => {
			await testValidationSuccess({ rule: "not_in", options: ["a", "b", "c"], value: "d" });
		});

		test("should detect failing validation", async () => {
			await testValidationFailure({ rule: "not_in", options: ["a", "b", "c"], value: "a" });
		});
	});

	describe("regexp", () => {
		test("should fail without a provided regexp", async () => {
			await testValidationFailure({ rule: "regexp", value: "jack_skellington" });
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
			])("%s", async ([, regexp]) => {
				await testValidationFailure({ rule: "regexp", regexp, value: "jack_skellington" });
			});
		});

		test("should allow passing validation", async () => {
			await testValidationSuccess({ rule: "regexp", regexp: /[a-z]+/, value: "jack_skellington" });
		});

		test("should detect failing validation", async () => {
			await testValidationFailure({ rule: "regexp", regexp: /abc/, value: "jack_skellington" });
		});
	});

	describe("custom", () => {
		test("should fail without a validate function", async () => {
			expect(
				await validateField("endDate", [{ rule: "custom", message: "Error message" }], {
					endDate: "2026-01-02",
				}),
			).toEqual({ errors: ["Error message"], valid: false, validated: true });
		});

		test("should pass when validate returns truthy", async () => {
			expect(
				await validateField(
					"endDate",
					[{ rule: "custom", validate: () => true, message: "Error message" }],
					{ endDate: "2026-01-02" },
				),
			).toEqual({ errors: [], valid: true, validated: true });
		});

		test("should fail when validate returns falsy", async () => {
			expect(
				await validateField(
					"endDate",
					[{ rule: "custom", validate: () => false, message: "Error message" }],
					{ endDate: "2026-01-02" },
				),
			).toEqual({ errors: ["Error message"], valid: false, validated: true });
		});

		test("should receive the field value and the full form data", async () => {
			const rules = [
				{
					rule: "custom",
					validate: (value, formData) => value > formData.startDate,
					message: "Error message",
				},
			];

			expect(
				await validateField("endDate", rules, { startDate: "2026-01-01", endDate: "2026-01-02" }),
			).toEqual({ errors: [], valid: true, validated: true });

			expect(
				await validateField("endDate", rules, { startDate: "2026-01-03", endDate: "2026-01-02" }),
			).toEqual({ errors: ["Error message"], valid: false, validated: true });
		});
	});

	describe("function shorthand", () => {
		test("should pass when the function returns true", async () => {
			expect(await validateField("username", [() => true], { username: "jack" })).toEqual({
				errors: [],
				valid: true,
				validated: true,
			});
		});

		test("should pass when the function returns false", async () => {
			expect(await validateField("username", [() => false], { username: "jack" })).toEqual({
				errors: [],
				valid: true,
				validated: true,
			});
		});

		test("should pass when the function returns a truthy non-string", async () => {
			expect(await validateField("username", [() => 42], { username: "jack" })).toEqual({
				errors: [],
				valid: true,
				validated: true,
			});
		});

		test("should fail with a single error when the function returns a non-empty string", async () => {
			expect(
				await validateField("username", [() => "Enter a valid username"], { username: "" }),
			).toEqual({ errors: ["Enter a valid username"], valid: false, validated: true });
		});

		test("should fail with multiple errors when the function returns a non-empty string array", async () => {
			expect(
				await validateField("username", [() => ["Too short", "Must contain a number"]], {
					username: "a",
				}),
			).toEqual({ errors: ["Too short", "Must contain a number"], valid: false, validated: true });
		});

		test("should pass when the function returns an empty array", async () => {
			expect(await validateField("username", [() => []], { username: "jack" })).toEqual({
				errors: [],
				valid: true,
				validated: true,
			});
		});

		test("should pass when the function returns an empty string", async () => {
			expect(await validateField("username", [() => ""], { username: "jack" })).toEqual({
				errors: [],
				valid: true,
				validated: true,
			});
		});

		test("should receive the field value and the full form data", async () => {
			const validate = vi.fn((value, formData) => value > formData.min);

			await validateField("score", [validate], { score: 10, min: 5 });

			expect(validate).toHaveBeenCalledWith(10, { score: 10, min: 5 });
		});

		test("should work alongside object rules in the same array", async () => {
			const rules = [
				{ rule: "required", message: "Enter your email" },
				(value) => value.includes("@") || "Enter a valid email address",
			];

			expect(await validateField("email", rules, { email: "" })).toEqual({
				errors: ["Enter your email", "Enter a valid email address"],
				valid: false,
				validated: true,
			});

			expect(await validateField("email", rules, { email: "jack@example.com" })).toEqual({
				errors: [],
				valid: true,
				validated: true,
			});
		});

		test("should handle multiple function rules", async () => {
			const rules = [
				(value) => value.length >= 3 || "Must be at least 3 characters",
				(value) => value.length <= 10 || "Must be at most 10 characters",
			];

			expect(await validateField("username", rules, { username: "ab" })).toEqual({
				errors: ["Must be at least 3 characters"],
				valid: false,
				validated: true,
			});

			expect(await validateField("username", rules, { username: "abcdefghijk" })).toEqual({
				errors: ["Must be at most 10 characters"],
				valid: false,
				validated: true,
			});

			expect(await validateField("username", rules, { username: "jack" })).toEqual({
				errors: [],
				valid: true,
				validated: true,
			});
		});
	});

	describe("required_if", () => {
		describe("with a target value", () => {
			const rules = [
				{ rule: "required_if", field: "wantsNewsletter", value: true, message: "Error message" },
			];

			test("should fail when the condition is met and the value is missing", async () => {
				expect(await validateField("email", rules, { wantsNewsletter: true, email: "" })).toEqual({
					errors: ["Error message"],
					valid: false,
					validated: true,
				});
			});

			test("should pass when the condition is met and the value is present", async () => {
				expect(
					await validateField("email", rules, { wantsNewsletter: true, email: "jack@" }),
				).toEqual({
					errors: [],
					valid: true,
					validated: true,
				});
			});

			test("should pass when the condition is not met", async () => {
				expect(await validateField("email", rules, { wantsNewsletter: false, email: "" })).toEqual({
					errors: [],
					valid: true,
					validated: true,
				});
			});
		});

		describe("without a target value", () => {
			const rules = [{ rule: "required_if", field: "nickname", message: "Error message" }];

			test("should fail when the named field is present and the value is missing", async () => {
				expect(await validateField("email", rules, { nickname: "jack", email: "" })).toEqual({
					errors: ["Error message"],
					valid: false,
					validated: true,
				});
			});

			test("should pass when the named field is empty", async () => {
				expect(await validateField("email", rules, { nickname: "", email: "" })).toEqual({
					errors: [],
					valid: true,
					validated: true,
				});
			});
		});
	});

	describe("same", () => {
		const rules = [{ rule: "same", field: "password", message: "Error message" }];

		test("should pass when the values match", async () => {
			expect(
				await validateField("passwordConfirmation", rules, {
					password: "boogie",
					passwordConfirmation: "boogie",
				}),
			).toEqual({ errors: [], valid: true, validated: true });
		});

		test("should fail when the values differ", async () => {
			expect(
				await validateField("passwordConfirmation", rules, {
					password: "boogie",
					passwordConfirmation: "oogie",
				}),
			).toEqual({ errors: ["Error message"], valid: false, validated: true });
		});
	});

	describe("different", () => {
		const rules = [{ rule: "different", field: "currentPassword", message: "Error message" }];

		test("should pass when the values differ", async () => {
			expect(
				await validateField("newPassword", rules, {
					currentPassword: "boogie",
					newPassword: "oogie",
				}),
			).toEqual({ errors: [], valid: true, validated: true });
		});

		test("should fail when the values match", async () => {
			expect(
				await validateField("newPassword", rules, {
					currentPassword: "boogie",
					newPassword: "boogie",
				}),
			).toEqual({ errors: ["Error message"], valid: false, validated: true });
		});
	});
	describe("Standard Schema", () => {
		const mockSchema = (validate) => ({
			"~standard": { version: 1, vendor: "mock", validate },
		});

		test("should pass when validate returns no issues", async () => {
			const schema = mockSchema(() => ({ issues: [] }));

			expect(await validateField("username", [schema], { username: "jack" })).toEqual({
				errors: [],
				valid: true,
				validated: true,
			});
		});

		test("should pass when validate returns undefined issues", async () => {
			const schema = mockSchema(() => ({}));

			expect(await validateField("username", [schema], { username: "jack" })).toEqual({
				errors: [],
				valid: true,
				validated: true,
			});
		});

		test("should fail when validate returns issues", async () => {
			const schema = mockSchema(() => ({ issues: [{ message: "Schema error" }] }));

			expect(await validateField("username", [schema], { username: "" })).toEqual({
				errors: ["Schema error"],
				valid: false,
				validated: true,
			});
		});

		test("should fail with multiple issues", async () => {
			const schema = mockSchema(() => ({
				issues: [{ message: "Too short" }, { message: "No number" }],
			}));

			expect(await validateField("username", [schema], { username: "a" })).toEqual({
				errors: ["Too short", "No number"],
				valid: false,
				validated: true,
			});
		});

		test("should work with async validate", async () => {
			const schema = mockSchema(async () => ({
				issues: [{ message: "Async error" }],
			}));

			expect(await validateField("username", [schema], { username: "" })).toEqual({
				errors: ["Async error"],
				valid: false,
				validated: true,
			});
		});

		test("should receive the field value", async () => {
			let receivedValue;

			const schema = mockSchema((value) => {
				receivedValue = value;

				return {};
			});

			await validateField("username", [schema], { username: "jack" });

			expect(receivedValue).toBe("jack");
		});

		test("should mix schemas with object rules and function shorthand", async () => {
			const schema = mockSchema(() => ({ issues: [{ message: "Schema error" }] }));

			const rules = [
				{ rule: "required", message: "Required" },
				schema,
				(value) => value.length >= 5 || "Too short",
			];

			expect(await validateField("username", rules, { username: "" })).toEqual({
				errors: ["Required", "Schema error", "Too short"],
				valid: false,
				validated: true,
			});
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
	return testValidationOutput(configuration, true);
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
	return testValidationOutput(configuration, false);
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

	return expect(
		validateField(fieldName, [{ rule: rule, ...options, message: "Error message" }], {
			[fieldName]: value,
		}),
	).resolves.toEqual(output);
}
