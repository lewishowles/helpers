import { describe, expect, test } from "vitest";
import { validateField } from "./validate-field";

const fieldName = "username";
const formData = { [fieldName]: "jack_skellington" };

const validationRules = [
	{ rule: "required", message: "Required field message" },
	{ rule: "minimum_length", length: 5, message: "Minimum length message" },
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
			expect(validateField(name, validationRules, formData)).toBe(true);
		});
	});

	test("should pass if no validation rules are provided", () => {
		expect(validateField(fieldName, [], formData)).toBe(true);
	});

	test("should pass if no form data is provided", () => {
		expect(validateField(fieldName, validationRules, {})).toBe(true);
	});

	describe("Multiple rules", () => {
		test("should pass if all rules pass", () => {
			expect(validateField(fieldName, validationRules, { [fieldName]: "jack_skellington" })).toEqual([]);
		});

		test("should fail if any rule fails", () => {
			expect(validateField(fieldName, validationRules, { [fieldName]: "jack" })).toEqual(["Minimum length message"]);
		});

		test("should bail if a required rule fails", () => {
			expect(validateField(fieldName, validationRules, { [fieldName]: "" })).toEqual(["Required field message"]);
		});

		test("should fail if all rules fail", () => {
			const validationRules = [
				{ rule: "minimum_length", length: 5, message: "Minimum length message" },
				{ rule: "regexp", regexp: /abc/, message: "Regexp message" },
			];

			expect(validateField(fieldName, validationRules, { [fieldName]: "Jack" })).toEqual(["Minimum length message", "Regexp message"]);
		});
	});

	describe("required", () => {
		test("should allow passing validation", () => {
			expect(validateField(fieldName, [{ rule: "required", message: "Required field message" }], { [fieldName]: "jack_skellington" })).toEqual([]);
		});

		test("should detect failing validation", () => {
			expect(validateField(fieldName, [{ rule: "required", message: "Required field message" }], { [fieldName]: undefined })).toEqual(["Required field message"]);
			expect(validateField(fieldName, [{ rule: "required", message: "Required field message" }], { [fieldName]: "" })).toEqual(["Required field message"]);
		});
	});

	describe("email", () => {
		test("should allow passing validation", () => {
			expect(validateField(fieldName, [{ rule: "email", message: "Email message" }], { [fieldName]: "jack_skellington@" })).toEqual([]);
		});

		test("should detect failing validation", () => {
			expect(validateField(fieldName, [{ rule: "email", message: "Email message" }], { [fieldName]: "jack_skellington" })).toEqual(["Email message"]);
		});
	});

	describe("minimum_length", () => {
		test("should fail without a provided length", () => {
			expect(validateField(fieldName, [{ rule: "minimum_length", message: "Minimum length message" }], { [fieldName]: "jack_skellington" })).toEqual(["Minimum length message"]);
		});

		describe("should fail with an invalid length", () => {
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
			])("%s", ([, length]) => {
				expect(validateField(fieldName, [{ rule: "minimum_length", length, message: "Minimum length message" }], { [fieldName]: "jack_skellington" })).toEqual(["Minimum length message"]);
			});
		});

		test("should allow passing validation", () => {
			expect(validateField(fieldName, [{ rule: "minimum_length", length: 5, message: "Minimum length message" }], { [fieldName]: "jack_skellington" })).toEqual([]);
		});

		test("should detect failing validation", () => {
			expect(validateField(fieldName, [{ rule: "minimum_length", length: 20, message: "Minimum length message" }], { [fieldName]: "jack_skellington" })).toEqual(["Minimum length message"]);
		});
	});

	describe("maximum_length", () => {
		test("should fail without a provided length", () => {
			expect(validateField(fieldName, [{ rule: "maximum_length", message: "Maximum length message" }], { [fieldName]: "jack_skellington" })).toEqual(["Maximum length message"]);
		});

		describe("should fail with an invalid length", () => {
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
			])("%s", ([, length]) => {
				expect(validateField(fieldName, [{ rule: "maximum_length", length, message: "Maximum length message" }], { [fieldName]: "jack_skellington" })).toEqual(["Maximum length message"]);
			});
		});

		test("should allow passing validation", () => {
			expect(validateField(fieldName, [{ rule: "maximum_length", length: 20, message: "Maximum length message" }], { [fieldName]: "jack_skellington" })).toEqual([]);
		});

		test("should detect failing validation", () => {
			expect(validateField(fieldName, [{ rule: "maximum_length", length: 5, message: "Maximum length message" }], { [fieldName]: "jack_skellington" })).toEqual(["Maximum length message"]);
		});
	});

	describe("regexp", () => {
		test("should fail without a provided regexp", () => {
			expect(validateField(fieldName, [{ rule: "regexp", message: "Regexp message" }], { [fieldName]: "jack_skellington" })).toEqual(["Regexp message"]);
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
				expect(validateField(fieldName, [{ rule: "regexp", regexp, message: "Regexp message" }], { [fieldName]: "jack_skellington" })).toEqual(["Regexp message"]);
			});
		});

		test("should allow passing validation", () => {
			expect(validateField(fieldName, [{ rule: "regexp", regexp: /[a-z]+/, message: "Regexp message" }], { [fieldName]: "jack_skellington" })).toEqual([]);
		});

		test("should detect failing validation", () => {
			expect(validateField(fieldName, [{ rule: "regexp", length: /[a-z]{2,3}/, message: "Regexp message" }], { [fieldName]: "jack_skellington" })).toEqual(["Regexp message"]);
		});
	});
});
