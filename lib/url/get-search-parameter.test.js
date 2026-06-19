import { describe, expect, test } from "vite-plus/test";
import { getSearchParameter } from "./get-search-parameter";

describe("getSearchParameter", () => {
	describe("should return null for an invalid parameter name", () => {
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
			expect(getSearchParameter("?page=2", input)).toBe(null);
		});
	});

	test("should retrieve an existing parameter from a search string", () => {
		const page = getSearchParameter("?page=2", "page");

		expect(page).toEqual("2");
	});

	test("should retrieve an existing parameter from URLSearchParams", () => {
		const searchParams = new URLSearchParams("?page=2");
		const page = getSearchParameter(searchParams, "page");

		expect(page).toEqual("2");
	});

	test("should decode encoded parameter values", () => {
		const query = getSearchParameter("?query=blue%20sky", "query");

		expect(query).toEqual("blue sky");
	});

	test("should return null for an unknown parameter", () => {
		const unknown = getSearchParameter("?page=2", "unknown");

		expect(unknown).toBeNull();
	});
});
