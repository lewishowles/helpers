import { describe, expect, test } from "vite-plus/test";
import { removeSearchParameter } from "./remove-search-parameter";

describe("removeSearchParameter", () => {
	test("should remove an existing parameter", () => {
		const search = removeSearchParameter("?page=2", "page");

		expect(search).toEqual("");
	});

	test("should preserve remaining parameters", () => {
		const search = removeSearchParameter("?page=2&query=blue+sky", "page");

		expect(search).toEqual("?query=blue+sky");
	});

	test("should not modify a search string if the parameter does not exist", () => {
		const search = removeSearchParameter("?page=2", "unknown");

		expect(search).toEqual("?page=2");
	});

	test("should accept URLSearchParams input", () => {
		const searchParams = new URLSearchParams("?page=2");
		const search = removeSearchParameter(searchParams, "page");

		expect(search).toEqual("");
	});
});
