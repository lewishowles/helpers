import { beforeEach, describe, expect, test, vi } from "vitest";
import { runComponentMethod } from "./run-component-method";

describe("run-component-method", () => {
	let component;

	beforeEach(() => {
		component = {
			testMethod: vi.fn(),
		};
	});

	describe("should not call the method if component is not a non-empty object", () => {
		test.for([
			["number (positive)", 1],
			["number (negative)", -1],
			["number (NaN)", NaN],
			["string (non-empty)", "string"],
			["string (empty)", ""],
			["array (non-empty)", [1, 2, 3]],
			["array (empty)", []],
			["object (empty)", {}],
			["null", null],
			["undefined", undefined],
		])("%s", ([, input]) => {
			expect(runComponentMethod(input, "testMethod")).toBe(undefined);

			expect(component.testMethod).not.toHaveBeenCalled();
		});
	});

	describe("should not call the method if method is not a non-empty string", () => {
		test.for([
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
		])("%s", ([, method]) => {
			expect(runComponentMethod(component, method)).toBe(undefined);

			expect(component.testMethod).not.toHaveBeenCalled();
		});
	});

	test("should not call the method if the method does not exist on the component", () => {
		expect(runComponentMethod(component, "nonExistentMethod")).toBe(undefined);

		expect(component.testMethod).not.toHaveBeenCalled();
	});

	test("should call a valid method", () => {
		expect(runComponentMethod(component, "testMethod")).toBe(true);

		expect(component.testMethod).toHaveBeenCalled();
	});

	test("additional parameters can be passed", () => {
		expect(runComponentMethod(component, "testMethod", "parameterOne", "parameterTwo")).toBe(true);

		expect(component.testMethod).toHaveBeenCalledWith("parameterOne", "parameterTwo");
	});
});
