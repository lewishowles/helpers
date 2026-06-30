import { describe, expect, test } from "vite-plus/test";
import { renameProperties } from "./rename-properties";

describe("renameProperties", () => {
	describe("should return the input as-is when object is not a plain object", () => {
		test.for([
			["number", 1],
			["string", "hello"],
			["null", null],
			["undefined", undefined],
			["array", [1, 2, 3]],
			["Date", new Date()],
			["class instance", new (class {})()],
		])("%s", ([, input]) => {
			expect(renameProperties(input, { a: "b" })).toBe(input);
		});
	});

	test("should return a shallow clone of a non-empty plain object when mapping is null", () => {
		const obj = { a: 1, b: 2 };

		const result = renameProperties(obj, null);

		expect(result).toEqual(obj);
		expect(result).not.toBe(obj);
	});

	test("should return a shallow clone of a non-empty plain object when mapping is undefined", () => {
		const obj = { a: 1, b: 2 };

		const result = renameProperties(obj, undefined);

		expect(result).toEqual(obj);
		expect(result).not.toBe(obj);
	});

	test("should return a shallow clone of a non-empty plain object when mapping is an empty object", () => {
		const obj = { a: 1, b: 2 };

		const result = renameProperties(obj, {});

		expect(result).toEqual(obj);
		expect(result).not.toBe(obj);
	});

	describe("should skip pairs with invalid keys", () => {
		test("should skip pair where oldKey is an empty string", () => {
			const obj = { a: 1, b: 2 };

			expect(renameProperties(obj, { "": "alpha", a: "alpha" })).toEqual({ alpha: 1, b: 2 });
		});

		test("should skip pair where newKey is not a string", () => {
			const obj = { a: 1, b: 2 };

			expect(renameProperties(obj, { a: 1, b: "beta" })).toEqual({ a: 1, beta: 2 });
		});

		test("should skip pair where newKey is an empty string", () => {
			const obj = { a: 1, b: 2 };

			expect(renameProperties(obj, { a: "", b: "beta" })).toEqual({ a: 1, beta: 2 });
		});
	});

	test("should skip pairs where oldKey is not an own key of the object", () => {
		const obj = { a: 1, b: 2 };

		expect(renameProperties(obj, { a: "alpha", missing: "value" })).toEqual({ alpha: 1, b: 2 });
	});

	test("should treat oldKey === newKey as a no-op for that pair", () => {
		const obj = { a: 1, b: 2 };

		expect(renameProperties(obj, { a: "a", b: "beta" })).toEqual({ a: 1, beta: 2 });
	});

	test("should rename a single key", () => {
		expect(renameProperties({ a: 1, b: 2, c: 3 }, { b: "beta" })).toEqual({ a: 1, beta: 2, c: 3 });
	});

	test("should rename multiple keys in one call", () => {
		expect(renameProperties({ a: 1, b: 2, c: 3 }, { a: "alpha", c: "gamma" })).toEqual({
			alpha: 1,
			b: 2,
			gamma: 3,
		});
	});

	test("should let renamed value win when newKey already exists elsewhere", () => {
		const obj = { a: 1, b: 2, c: 3 };

		const result = renameProperties(obj, { a: "c" });

		expect(result).toEqual({ c: 1, b: 2 });
		expect(Object.keys(result)).toEqual(["c", "b"]);
	});

	test("should preserve key order with renamed key at oldKey's position", () => {
		const obj = { a: 1, b: 2, c: 3, d: 4 };

		const result = renameProperties(obj, { b: "beta", d: "delta" });

		expect(result).toEqual({ a: 1, beta: 2, c: 3, delta: 4 });
		expect(Object.keys(result)).toEqual(["a", "beta", "c", "delta"]);
	});

	test("should not deep-rename nested object keys", () => {
		const obj = { a: 1, nested: { b: 2, c: 3 } };

		expect(renameProperties(obj, { b: "beta" })).toEqual({ a: 1, nested: { b: 2, c: 3 } });
	});

	test("should not mutate the original object", () => {
		const obj = { a: 1, b: 2 };

		const result = renameProperties(obj, { a: "alpha" });

		expect(obj).toEqual({ a: 1, b: 2 });
		expect(result).not.toBe(obj);
	});
});
