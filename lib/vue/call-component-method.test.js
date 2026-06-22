import { beforeEach, describe, expect, test, vi } from "vite-plus/test";
import { callComponentMethod } from "./call-component-method";

describe("call-component-method", () => {
	let component;

	beforeEach(() => {
		component = {
			asyncMethod: vi.fn().mockResolvedValue("async-result"),
			testMethod: vi.fn().mockReturnValue("result"),
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
			expect(callComponentMethod(input, "testMethod")).toBe(undefined);

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
			expect(callComponentMethod(component, method)).toBe(undefined);

			expect(component.testMethod).not.toHaveBeenCalled();
		});
	});

	test("should not call the method if the method does not exist on the component", () => {
		expect(callComponentMethod(component, "nonExistentMethod")).toBe(undefined);

		expect(component.testMethod).not.toHaveBeenCalled();
	});

	test("should call a valid method and return its result", () => {
		expect(callComponentMethod(component, "testMethod")).toBe("result");

		expect(component.testMethod).toHaveBeenCalled();
	});

	test("additional parameters can be passed", () => {
		expect(callComponentMethod(component, "testMethod", "parameterOne", "parameterTwo")).toBe(
			"result",
		);

		expect(component.testMethod).toHaveBeenCalledWith("parameterOne", "parameterTwo");
	});

	test("should preserve async return values", async () => {
		const result = callComponentMethod(component, "asyncMethod");

		await expect(result).resolves.toBe("async-result");
	});

	test("should call the method with the component bound as `this`", () => {
		const boundComponent = {
			label: "boogie",
			getLabel() {
				return this?.label;
			},
		};

		expect(callComponentMethod(boundComponent, "getLabel")).toBe("boogie");
	});
});
