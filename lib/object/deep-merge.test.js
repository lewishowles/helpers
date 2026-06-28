import { describe, expect, test } from "vite-plus/test";
import { deepMerge } from "./deep-merge";

describe("deep-merge", () => {
	test("should merge two objects deeply", () => {
		const target = { a: 1, b: { c: 2 } };
		const source = { b: { d: 3 }, e: 4 };
		const result = deepMerge(target, source);

		expect(result).toEqual({ a: 1, b: { c: 2, d: 3 }, e: 4 });
	});

	test("should merge multiple objects deeply", () => {
		const target = { a: 1 };
		const first = { b: { c: 2 } };
		const second = { b: { d: 3 }, e: 4 };
		const result = deepMerge(target, first, second);

		expect(result).toEqual({ a: 1, b: { c: 2, d: 3 }, e: 4 });
	});

	test("should handle nested objects", () => {
		const target = { a: { b: { c: 1 } } };
		const source = { a: { b: { d: 2 } } };
		const result = deepMerge(target, source);

		expect(result).toEqual({ a: { b: { c: 1, d: 2 } } });
	});

	test("should handle mismatched types", () => {
		const target = {
			a: ["A", "B", "C"],
			e: 5,
			f: "F",
			g: [],
		};

		const source = {
			a: { b: "B", c: "C", d: "D" },
			e: "E",
			f: 7,
			g: {},
		};

		const result = deepMerge(target, source);

		expect(result).toEqual({
			a: { b: "B", c: "C", d: "D" },
			e: "E",
			f: 7,
			g: {},
		});
	});

	test("should not mutate the target object", () => {
		const target = { a: 1 };
		const source = { b: 2 };
		const result = deepMerge(target, source);

		expect(result).toEqual({ a: 1, b: 2 });
		expect(target).toEqual({ a: 1 });
	});

	test("should return the target object if no sources are provided", () => {
		const target = { a: 1 };
		const result = deepMerge(target);

		expect(result).toEqual({ a: 1 });
	});

	test("preserves a Date instance rather than flattening it", () => {
		const date = new Date("2024-01-15");
		const result = deepMerge({ date }, {});

		expect(result.date).toBe(date);
	});

	test("replaces a Date with another Date at the same key", () => {
		const date1 = new Date("2024-01-01");
		const date2 = new Date("2024-06-01");
		const result = deepMerge({ date: date1 }, { date: date2 });

		expect(result.date).toBe(date2);
	});

	test("preserves a class instance rather than flattening it", () => {
		class Token {
			constructor(value) {
				this.value = value;
			}
		}

		const token = new Token("abc");
		const result = deepMerge({ token }, {});

		expect(result.token).toBe(token);
		expect(result.token).toBeInstanceOf(Token);
	});

	test("replaces rather than merges when source is a class instance and target has a plain object at the same key", () => {
		class Token {
			constructor(value) {
				this.value = value;
			}
		}

		const token = new Token("abc");
		const result = deepMerge({ config: { a: 1 } }, { config: token });

		expect(result.config).toBe(token);
		expect(result.config).toBeInstanceOf(Token);
	});

	test("replaces rather than merges when target is a class instance and source has a plain object at the same key", () => {
		class Token {
			constructor(value) {
				this.value = value;
			}
		}

		const token = new Token("abc");
		const result = deepMerge({ config: token }, { config: { a: 1 } });

		expect(result.config).toEqual({ a: 1 });
	});
});
