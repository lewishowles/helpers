import { describe, expect, test } from "vite-plus/test";
import { updateSearchParameter } from "./update-search-parameter";

describe("updateSearchParameter", () => {
	describe("should return the original search for an invalid parameter name", () => {
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
		])("%s", ([, input]) => {
			expect(updateSearchParameter("?page=2", input, "3")).toBe("?page=2");
		});
	});

	test("should add a new parameter", () => {
		const search = updateSearchParameter("", "page", "2");

		expect(search).toEqual("?page=2");
	});

	test("should update an existing parameter", () => {
		const search = updateSearchParameter("?page=2", "page", "3");

		expect(search).toEqual("?page=3");
	});

	test("should remove a parameter when the value is null", () => {
		const search = updateSearchParameter("?page=2", "page", null);

		expect(search).toEqual("");
	});

	test("should encode parameter values", () => {
		const search = updateSearchParameter("", "query", "blue sky");

		expect(search).toEqual("?query=blue+sky");
	});

	test("should accept URLSearchParams input", () => {
		const searchParams = new URLSearchParams("?page=2");
		const search = updateSearchParameter(searchParams, "page", "3");

		expect(search).toEqual("?page=3");
	});
});
