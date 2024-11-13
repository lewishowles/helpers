import { describe, expect, test } from "vitest";
import { validateField } from "./validate-field";

const fieldName = "username";
const formData = { [fieldName]: "jack_skellington" };

const validationRules = [
	{ rule: "required", message: "Required field message" },
	{ rule: "min", size: 5, message: "Min message" },
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
			expect(validateField(fieldName, validationRules, { [fieldName]: "jack" })).toEqual(["Min message"]);
		});

		test("should fail if all rules fail", () => {
			const validationRules = [
				{ rule: "min", size: 5, message: "Min message" },
				{ rule: "regexp", regexp: /abc/, message: "Regexp message" },
			];

			expect(validateField(fieldName, validationRules, { [fieldName]: "Jack" })).toEqual(["Min message", "Regexp message"]);
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

	describe("min", () => {
		test("should fail without a provided size", () => {
			testValidationFailure({ rule: "min", value: "jack_skellington" });
		});

		describe("should fail with an invalid size", () => {
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
				testValidationFailure({ rule: "min", size, value: "jack_skellington" });
			});
		});

		describe("should allow passing validation", () => {
			test("string", () => {
				testValidationSuccess({ rule: "min", size: 5, value: "jack_skellington" });
			});

			test("array", () => {
				testValidationSuccess({ rule: "min", size: 2, value: new Array(3) });
			});

			test("object", () => {
				testValidationSuccess({ rule: "min", size: 2, value: { a: 1, b: 2, c: 3 } });
			});

			test("number", () => {
				testValidationSuccess({ rule: "min", size: 6, value: 7 });
			});
		});

		describe("should detect failing validation", () => {
			test("string", () => {
				testValidationFailure({ rule: "min", size: 20, value: "jack_skellington" });
			});

			test("array", () => {
				testValidationFailure({ rule: "min", size: 4, value: new Array(3) });
			});

			test("object", () => {
				testValidationFailure({ rule: "min", size: 4, value: { a: 1, b: 2, c: 3 } });
			});

			test("number", () => {
				testValidationFailure({ rule: "min", size: 8, value: 7 });
			});
		});
	});

	describe("max", () => {
		test("should fail without a provided size", () => {
			testValidationFailure({ rule: "max", value: "jack_skellington" });
		});

		describe("should fail with an invalid size", () => {
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
				testValidationFailure({ rule: "max", size, value: "jack_skellington" });
			});
		});

		describe("should allow passing validation", () => {
			test("string", () => {
				testValidationSuccess({ rule: "max", size: 20, value: "jack_skellington" });
			});

			test("array", () => {
				testValidationSuccess({ rule: "max", size: 4, value: new Array(3) });
			});

			test("object", () => {
				testValidationSuccess({ rule: "max", size: 4, value: { a: 1, b: 2, c: 3 } });
			});

			test("number", () => {
				testValidationSuccess({ rule: "max", size: 8, value: 7 });
			});
		});

		describe("should detect failing validation", () => {
			test("string", () => {
				testValidationFailure({ rule: "max", size: 5, value: "jack_skellington" });
			});

			test("array", () => {
				testValidationFailure({ rule: "max", size: 2, value: new Array(3) });
			});

			test("object", () => {
				testValidationFailure({ rule: "max", size: 2, value: { a: 1, b: 2, c: 3 } });
			});

			test("number", () => {
				testValidationFailure({ rule: "max", size: 6, value: 7 });
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
	const output = shouldPass ? [] : ["Error message"];

	expect(validateField(fieldName, [{ rule: rule, ...options, message: "Error message" }], { [fieldName]: value })).toEqual(output);
}
