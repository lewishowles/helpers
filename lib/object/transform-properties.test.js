import { transformProperties } from "./transform-properties";
import { describe, expect, test, vi } from "vite-plus/test";

describe("transformProperties", () => {
	test("transforms listed properties and leaves other values and key order unchanged", () => {
		const input = { first: 1, second: "2", third: 3 };

		const result = transformProperties(input, {
			third: (value) => value * 2,
			second: Number,
		});

		expect(result).toEqual({ first: 1, second: 2, third: 6 });
		expect(Object.keys(result)).toEqual(["first", "second", "third"]);
	});

	test("skips absent properties without calling their transforms", () => {
		const transform = vi.fn();
		const result = transformProperties({ present: 1 }, { missing: transform });

		expect(result).toEqual({ present: 1 });
		expect(transform).not.toHaveBeenCalled();
	});

	test("passes only the property value to a transform", () => {
		const transform = vi.fn((value) => value + 1);

		expect(transformProperties({ count: 1 }, { count: transform })).toEqual({ count: 2 });
		expect(transform.mock.calls).toEqual([[1]]);
	});

	test("ignores inherited input and transform properties", () => {
		const input = Object.assign(Object.create({ inherited: 1 }), { own: 2 });

		const transforms = Object.assign(Object.create({ own: () => 9 }), {
			inherited: () => 8,
		});

		const result = transformProperties(input, transforms);

		expect(result).toEqual({ own: 2 });
	});

	test("does not mutate the input", () => {
		const input = { count: 1, nested: { value: 2 } };
		const result = transformProperties(input, { count: (value) => value + 1 });

		expect(input).toEqual({ count: 1, nested: { value: 2 } });
		expect(result).not.toBe(input);
		expect(result.nested).toBe(input.nested);
	});

	test("ignores entries that are not functions", () => {
		const input = { a: 1, b: 2 };

		expect(transformProperties(input, { a: null, b: (value) => value * 2 })).toEqual({
			a: 1,
			b: 4,
		});
	});

	test.for([
		["number", 1],
		["string", "hello"],
		["null", null],
		["undefined", undefined],
		["array", [1, 2]],
		["Date", new Date()],
		["class instance", new (class {})()],
	])("returns a non-plain %s input as-is", ([, input]) => {
		expect(transformProperties(input, { a: () => 2 })).toBe(input);
	});

	test.for([
		["missing", undefined],
		["null", null],
		["array", []],
		["string", "invalid"],
		["empty", {}],
	])("returns a shallow copy for %s transforms", ([, transforms]) => {
		const input = { a: 1, nested: { b: 2 } };
		const result = transformProperties(input, transforms);

		expect(result).toEqual(input);
		expect(result).not.toBe(input);
		expect(result.nested).toBe(input.nested);
	});
});
