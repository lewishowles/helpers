import { describe, expect, test } from "vite-plus/test";
import { validateForm } from "./validate-form";

describe("validate-form", () => {
	describe("invalid input", () => {
		test("should pass (not validated) if fields is not a non-empty object", () => {
			expect(validateForm(null, { username: "jack" })).toEqual({
				valid: true,
				validated: false,
				results: {},
			});

			expect(validateForm({}, { username: "jack" })).toEqual({
				valid: true,
				validated: false,
				results: {},
			});

			expect(validateForm([], { username: "jack" })).toEqual({
				valid: true,
				validated: false,
				results: {},
			});
		});

		test("should pass (not validated) if formData is not a non-empty object", () => {
			expect(validateForm({ username: [] }, null)).toEqual({
				valid: true,
				validated: false,
				results: {},
			});

			expect(validateForm({ username: [] }, {})).toEqual({
				valid: true,
				validated: false,
				results: {},
			});
		});
	});

	describe("single field", () => {
		test("should pass when all rules pass", () => {
			expect(
				validateForm(
					{ username: [{ rule: "required", message: "Enter a username" }] },
					{ username: "jack_skellington" },
				),
			).toEqual({
				valid: true,
				validated: true,
				results: {
					username: { errors: [], valid: true, validated: true },
				},
			});
		});

		test("should fail when a rule fails", () => {
			expect(
				validateForm(
					{ username: [{ rule: "required", message: "Enter a username" }] },
					{ username: "" },
				),
			).toEqual({
				valid: false,
				validated: true,
				results: {
					username: { errors: ["Enter a username"], valid: false, validated: true },
				},
			});
		});
	});

	describe("multiple fields", () => {
		const fields = {
			username: [{ rule: "required", message: "Enter a username" }],
			email: [
				{ rule: "required", message: "Enter your email" },
				{ rule: "email", message: "Enter a valid email address" },
			],
		};

		test("should pass when all fields pass", () => {
			expect(validateForm(fields, { username: "jack", email: "jack@example.com" })).toEqual({
				valid: true,
				validated: true,
				results: {
					username: { errors: [], valid: true, validated: true },
					email: { errors: [], valid: true, validated: true },
				},
			});
		});

		test("should fail when one field fails", () => {
			expect(validateForm(fields, { username: "jack", email: "not-an-email" })).toEqual({
				valid: false,
				validated: true,
				results: {
					username: { errors: [], valid: true, validated: true },
					email: { errors: ["Enter a valid email address"], valid: false, validated: true },
				},
			});
		});

		test("should fail when all fields fail", () => {
			expect(validateForm(fields, { username: "", email: "" })).toEqual({
				valid: false,
				validated: true,
				results: {
					username: { errors: ["Enter a username"], valid: false, validated: true },
					email: {
						errors: ["Enter your email", "Enter a valid email address"],
						valid: false,
						validated: true,
					},
				},
			});
		});
	});

	describe("cross-field rules", () => {
		test("should validate same rule across fields", () => {
			const fields = {
				password: [{ rule: "required", message: "Enter a password" }],
				passwordConfirmation: [
					{ rule: "required", message: "Confirm your password" },
					{ rule: "same", field: "password", message: "Your passwords should match" },
				],
			};

			expect(validateForm(fields, { password: "boogie", passwordConfirmation: "boogie" })).toEqual({
				valid: true,
				validated: true,
				results: {
					password: { errors: [], valid: true, validated: true },
					passwordConfirmation: { errors: [], valid: true, validated: true },
				},
			});

			expect(validateForm(fields, { password: "boogie", passwordConfirmation: "oogie" })).toEqual({
				valid: false,
				validated: true,
				results: {
					password: { errors: [], valid: true, validated: true },
					passwordConfirmation: {
						errors: ["Your passwords should match"],
						valid: false,
						validated: true,
					},
				},
			});
		});

		test("should validate required_if rule across fields", () => {
			const fields = {
				wantsNewsletter: [],
				email: [
					{
						rule: "required_if",
						field: "wantsNewsletter",
						value: true,
						message: "Enter an email address to receive the newsletter",
					},
				],
			};

			expect(validateForm(fields, { wantsNewsletter: false, email: "" })).toEqual({
				valid: true,
				validated: true,
				results: {
					email: { errors: [], valid: true, validated: true },
				},
			});

			expect(validateForm(fields, { wantsNewsletter: true, email: "" })).toEqual({
				valid: false,
				validated: true,
				results: {
					email: {
						errors: ["Enter an email address to receive the newsletter"],
						valid: false,
						validated: true,
					},
				},
			});
		});

		test("should validate custom rule with formData access", () => {
			const fields = {
				startDate: [{ rule: "required", message: "Enter a start date" }],
				endDate: [
					{ rule: "required", message: "Enter an end date" },
					{
						rule: "custom",
						validate: (value, formData) => value > formData.startDate,
						message: "Your end date should be after your start date",
					},
				],
			};

			expect(validateForm(fields, { startDate: "2026-01-01", endDate: "2026-01-02" })).toEqual({
				valid: true,
				validated: true,
				results: {
					startDate: { errors: [], valid: true, validated: true },
					endDate: { errors: [], valid: true, validated: true },
				},
			});

			expect(validateForm(fields, { startDate: "2026-01-03", endDate: "2026-01-02" })).toEqual({
				valid: false,
				validated: true,
				results: {
					startDate: { errors: [], valid: true, validated: true },
					endDate: {
						errors: ["Your end date should be after your start date"],
						valid: false,
						validated: true,
					},
				},
			});
		});
	});

	describe("function shorthand", () => {
		test("should work with function rules alongside object rules", () => {
			const fields = {
				email: [
					{ rule: "required", message: "Enter your email" },
					(value) => value.includes("@") || "Enter a valid email address",
				],
			};

			expect(validateForm(fields, { email: "" })).toEqual({
				valid: false,
				validated: true,
				results: {
					email: {
						errors: ["Enter your email", "Enter a valid email address"],
						valid: false,
						validated: true,
					},
				},
			});

			expect(validateForm(fields, { email: "jack@example.com" })).toEqual({
				valid: true,
				validated: true,
				results: {
					email: { errors: [], valid: true, validated: true },
				},
			});
		});
	});

	describe("skipped fields", () => {
		test("should skip fields with empty rules arrays", () => {
			expect(
				validateForm(
					{
						username: [{ rule: "required", message: "Enter a username" }],
						nickname: [],
					},
					{ username: "jack", nickname: "" },
				),
			).toEqual({
				valid: true,
				validated: true,
				results: {
					username: { errors: [], valid: true, validated: true },
				},
			});
		});

		test("should skip fields with non-array rules", () => {
			expect(
				validateForm(
					{
						username: [{ rule: "required", message: "Enter a username" }],
						nickname: "not-an-array",
					},
					{ username: "jack", nickname: "" },
				),
			).toEqual({
				valid: true,
				validated: true,
				results: {
					username: { errors: [], valid: true, validated: true },
				},
			});
		});

		test("should pass when all fields are skipped", () => {
			expect(
				validateForm({ username: [], nickname: null }, { username: "", nickname: "" }),
			).toEqual({
				valid: true,
				validated: true,
				results: {},
			});
		});
	});

	describe("overall valid flag", () => {
		test("should be true when no field has valid: false", () => {
			expect(
				validateForm(
					{ username: [{ rule: "required", message: "Enter a username" }] },
					{ username: "jack" },
				).valid,
			).toBe(true);
		});

		test("should be false when any field has valid: false", () => {
			expect(
				validateForm(
					{
						username: [{ rule: "required", message: "Enter a username" }],
						email: [{ rule: "required", message: "Enter your email" }],
					},
					{ username: "jack", email: "" },
				).valid,
			).toBe(false);
		});

		test("should not be affected by fields with validated: false", () => {
			expect(
				validateForm(
					{
						username: [{ rule: "required", message: "Enter a username" }],
						nickname: [],
					},
					{ username: "jack", nickname: "" },
				).valid,
			).toBe(true);
		});
	});
});
