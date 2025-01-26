import { beforeEach, describe, expect, test, vi } from "vitest";
import { getUrlParameter } from "./get-url-parameter";

describe("getUrlParameter", () => {
	const replaceState = vi.spyOn(window.history, "replaceState");

	beforeEach(() => {
		replaceState.mockClear();

		window.location.href = "http://example.com?page=2";
	});

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
			expect(getUrlParameter(input)).toBe(null);
		});
	});

	test("should retrieve an existing parameter", () => {
		const page = getUrlParameter("page");

		expect(page).toEqual("2");
	});

	test("should return null for an unknown parameter", () => {
		const unknown = getUrlParameter("unknown");

		expect(unknown).toBeNull();
	});
});
