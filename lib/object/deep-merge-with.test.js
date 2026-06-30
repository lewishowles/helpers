import { describe, expect, test } from "vite-plus/test";
import { deepMergeWith } from "./deep-merge-with";
import { deepMerge } from "./deep-merge";

describe("deep-merge-with", () => {
	test("non-array sources treated as empty array, returns deep clone of target", () => {
		const target = { a: 1, b: { c: 2 } };
		const result = deepMergeWith(target, 42);

		expect(result).toEqual({ a: 1, b: { c: 2 } });
		expect(result).not.toBe(target);
		expect(result.b).not.toBe(target.b);
	});

	test("single plain-object sources coerced to array", () => {
		const target = { a: 1 };
		const source = { b: 2 };
		const result = deepMergeWith(target, source);

		expect(result).toEqual({ a: 1, b: 2 });
	});

	test("replace strategy: arrays replaced, matches deepMerge", () => {
		const target = { a: [1, 2], b: { c: 3 } };
		const source = { a: [3, 4], b: { d: 5 } };
		const result = deepMergeWith(target, [source]);
		const expected = deepMerge(target, source);

		expect(result).toEqual(expected);
	});

	test("concatenate strategy: arrays concatenated", () => {
		const target = { a: [1, 2] };
		const source = { a: [3, 4] };
		const result = deepMergeWith(target, [source], { arrayStrategy: "concatenate" });

		expect(result).toEqual({ a: [1, 2, 3, 4] });
	});

	test("concatenate preserves order and duplicates", () => {
		const target = { a: [1, 1] };
		const source = { a: [1] };
		const result = deepMergeWith(target, [source], { arrayStrategy: "concatenate" });

		expect(result).toEqual({ a: [1, 1, 1] });
	});

	test("merge strategy: equal-length arrays of plain objects", () => {
		const target = {
			items: [
				{ id: 1, name: "a" },
				{ id: 2, name: "b" },
			],
		};

		const source = { items: [{ value: 10 }, { value: 20 }] };
		const result = deepMergeWith(target, [source], { arrayStrategy: "merge" });

		expect(result).toEqual({
			items: [
				{ id: 1, name: "a", value: 10 },
				{ id: 2, name: "b", value: 20 },
			],
		});
	});

	test("merge strategy: source shorter than target", () => {
		const target = { items: [{ a: 1 }, { a: 2 }, { a: 3 }] };
		const source = { items: [{ b: 1 }] };
		const result = deepMergeWith(target, [source], { arrayStrategy: "merge" });

		expect(result).toEqual({
			items: [{ a: 1, b: 1 }, { a: 2 }, { a: 3 }],
		});
	});

	test("merge strategy: source longer than target", () => {
		const target = { items: [{ a: 1 }] };
		const source = { items: [{ b: 1 }, { b: 2 }, { b: 3 }] };
		const result = deepMergeWith(target, [source], { arrayStrategy: "merge" });

		expect(result).toEqual({
			items: [{ a: 1, b: 1 }, { b: 2 }, { b: 3 }],
		});
	});

	test("merge strategy: mismatched element types", () => {
		const target = { items: [{ a: 1 }, 42] };
		const source = { items: ["string", { b: 2 }] };
		const result = deepMergeWith(target, [source], { arrayStrategy: "merge" });

		expect(result).toEqual({
			items: ["string", { b: 2 }],
		});
	});

	test("object merging identical to deepMerge", () => {
		const target = { a: 1, b: { c: 2 } };
		const source = { b: { d: 3 }, e: 4 };
		const result = deepMergeWith(target, [source]);

		expect(result).toEqual({ a: 1, b: { c: 2, d: 3 }, e: 4 });
	});

	test("preserves a Date instance rather than flattening it", () => {
		const date = new Date("2024-01-15");
		const result = deepMergeWith({ date }, [{}]);

		expect(result.date).toBe(date);
	});

	test("preserves a class instance rather than flattening it", () => {
		class Token {
			constructor(value) {
				this.value = value;
			}
		}

		const token = new Token("abc");
		const result = deepMergeWith({ token }, [{}]);

		expect(result.token).toBe(token);
		expect(result.token).toBeInstanceOf(Token);
	});

	test("multiple sources folded left-to-right", () => {
		const target = { a: [1] };
		const sources = [{ a: [2] }, { a: [3] }];
		const result = deepMergeWith(target, sources, { arrayStrategy: "concatenate" });

		expect(result).toEqual({ a: [1, 2, 3] });
	});

	test("non-object target returned as-is", () => {
		expect(deepMergeWith(42, [{ a: 1 }])).toBe(42);
		expect(deepMergeWith("string", [{ a: 1 }])).toBe("string");
		expect(deepMergeWith(null, [{ a: 1 }])).toBe(null);
	});

	test("original target not mutated", () => {
		const target = { a: [1, 2], b: { c: 3 } };
		const source = { a: [3, 4], b: { d: 5 } };

		deepMergeWith(target, [source], { arrayStrategy: "concatenate" });

		expect(target).toEqual({ a: [1, 2], b: { c: 3 } });
	});

	test("original sources not mutated", () => {
		const target = { a: 1 };
		const source = { a: [3, 4] };

		deepMergeWith(target, [source], { arrayStrategy: "concatenate" });

		expect(source).toEqual({ a: [3, 4] });
	});

	test("non-object options defaults to replace strategy", () => {
		const target = { a: [1] };
		const source = { a: [2] };
		const result = deepMergeWith(target, [source], "concatenate");

		expect(result).toEqual({ a: [2] });
	});
});
