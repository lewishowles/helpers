import { describe, expect, test } from "vite-plus/test";
import { deepCopy } from "./deep-copy";

describe("deep-copy", () => {
	describe("should return the original value for a non-object non-array input", () => {
		test.for([
			["number (positive)", 1],
			["number (negative)", -1],
			["number (NaN)", NaN],
			["string (non-empty)", "string"],
			["string (empty)", ""],
			["null", null],
			["undefined", undefined],
		])("%s", ([, input]) => {
			expect(deepCopy(input)).toBe(input);
		});
	});

	test("should return a copy of the original object", () => {
		const original = {
			name: "Sophie",
			profiles: {
				linkedIn: "linkedin/sophie",
			},
		};

		const copied = deepCopy(original);

		expect(copied).not.toBe(original);
		expect(copied).toEqual(original);
		expect(copied.profiles).not.toBe(original.profiles);
		expect(copied.profiles).toEqual(original.profiles);
	});

	test("should return a copy of the original array", () => {
		const original = [1, { a: 2 }, [3]];

		const copied = deepCopy(original);

		expect(copied).not.toBe(original);
		expect(copied).toEqual(original);
		expect(copied[1]).not.toBe(original[1]);
		expect(copied[2]).not.toBe(original[2]);
	});

	describe("built-in types", () => {
		test("should clone a Date to a new instance with the same time", () => {
			const original = new Date("2020-01-01T00:00:00.000Z");

			const copied = deepCopy(original);

			expect(copied).toBeInstanceOf(Date);
			expect(copied).not.toBe(original);
			expect(copied.getTime()).toBe(original.getTime());
		});

		test("should clone a Map", () => {
			const original = new Map([["key", "value"]]);

			const copied = deepCopy(original);

			expect(copied).toBeInstanceOf(Map);
			expect(copied).not.toBe(original);
			expect(copied.get("key")).toBe("value");
		});

		test("should clone a Set", () => {
			const original = new Set([1, 2, 3]);

			const copied = deepCopy(original);

			expect(copied).toBeInstanceOf(Set);
			expect(copied).not.toBe(original);
			expect([...copied]).toEqual([1, 2, 3]);
		});

		test("should clone a nested Date within an object", () => {
			const original = { created: new Date("2020-01-01T00:00:00.000Z") };

			const copied = deepCopy(original);

			expect(copied.created).toBeInstanceOf(Date);
			expect(copied.created).not.toBe(original.created);
			expect(copied.created.getTime()).toBe(original.created.getTime());
		});

		test("should preserve a mixed array of types", () => {
			const original = [1, "two", { three: 3 }, new Date(0), [4]];

			const copied = deepCopy(original);

			expect(copied).toEqual(original);
			expect(copied[3]).toBeInstanceOf(Date);
			expect(copied[2]).not.toBe(original[2]);
		});
	});

	describe("cyclic references", () => {
		test("should copy an object with a cyclic reference without looping", () => {
			const original = { name: "root" };

			original.self = original;

			const copied = deepCopy(original);

			expect(copied).not.toBe(original);
			expect(copied.name).toBe("root");
			expect(copied.self).toBe(copied);
		});
	});

	describe("function fallback", () => {
		test("should copy an object containing a function by reference, without throwing", () => {
			const fn = () => "called";
			const original = { fn, nested: { value: 1 } };

			const copied = deepCopy(original);

			expect(copied).not.toBe(original);
			expect(copied.fn).toBe(fn);
			expect(copied.nested).not.toBe(original.nested);
			expect(copied.nested).toEqual({ value: 1 });
		});

		test("should preserve a cyclic reference in the function fallback path", () => {
			const original = { fn: () => "called" };

			original.self = original;

			const copied = deepCopy(original);

			expect(copied.fn).toBe(original.fn);
			expect(copied.self).toBe(copied);
		});

		test("should still clone built-in types when a sibling forces the fallback path", () => {
			const fn = () => "called";

			const original = {
				when: new Date("2020-01-01T00:00:00.000Z"),
				tags: new Set([1, 2]),
				onClick: fn,
			};

			const copied = deepCopy(original);

			expect(copied.onClick).toBe(fn);
			expect(copied.when).toBeInstanceOf(Date);
			expect(copied.when).not.toBe(original.when);
			expect(copied.when.getTime()).toBe(original.when.getTime());
			expect(copied.tags).toBeInstanceOf(Set);
			expect(copied.tags).not.toBe(original.tags);
			expect([...copied.tags]).toEqual([1, 2]);
		});
	});
});
