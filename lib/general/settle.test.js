import { describe, expect, test } from "vite-plus/test";
import { settle } from "./settle";

describe("settle", () => {
	describe("junk input", () => {
		describe("should return an empty result object for non-array input", () => {
			test.for([
				["boolean (true)", true],
				["boolean (false)", false],
				["number (positive)", 1],
				["number (NaN)", NaN],
				["string (non-empty)", "string"],
				["string (empty)", ""],
				["object (non-empty)", { property: "value" }],
				["object (empty)", {}],
				["null", null],
				["undefined", undefined],
			])("%s", async ([, input]) => {
				expect(await settle(input)).toEqual({ values: [], errors: [], results: [] });
			});
		});

		test("should return an empty result object for an empty array", async () => {
			expect(await settle([])).toEqual({ values: [], errors: [], results: [] });
		});
	});

	describe("fulfilled", () => {
		test("should collect all values when every promise fulfils", async () => {
			const result = await settle([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)]);

			expect(result.values).toEqual([1, 2, 3]);
			expect(result.errors).toEqual([]);
			expect(result.results).toEqual([
				{ status: "fulfilled", value: 1, index: 0 },
				{ status: "fulfilled", value: 2, index: 1 },
				{ status: "fulfilled", value: 3, index: 2 },
			]);
		});
	});

	describe("rejected", () => {
		test("should collect all errors when every promise rejects", async () => {
			const result = await settle([Promise.reject("a"), Promise.reject("b")]);

			expect(result.values).toEqual([]);
			expect(result.errors).toEqual(["a", "b"]);
			expect(result.results).toEqual([
				{ status: "rejected", reason: "a", index: 0 },
				{ status: "rejected", reason: "b", index: 1 },
			]);
		});
	});

	describe("mixed", () => {
		test("should preserve order across values, errors, and results", async () => {
			const result = await settle([
				Promise.resolve("first"),
				Promise.reject("second"),
				Promise.resolve("third"),
			]);

			expect(result.values).toEqual(["first", "third"]);
			expect(result.errors).toEqual(["second"]);
			expect(result.results).toEqual([
				{ status: "fulfilled", value: "first", index: 0 },
				{ status: "rejected", reason: "second", index: 1 },
				{ status: "fulfilled", value: "third", index: 2 },
			]);
		});

		test("should let failures be correlated back to their input by index", async () => {
			const ids = ["a", "b", "c"];

			const { results } = await settle([
				Promise.resolve("ok"),
				Promise.reject("boom"),
				Promise.resolve("ok"),
			]);

			const failedIds = results
				.filter((result) => result.status === "rejected")
				.map((result) => ids[result.index]);

			expect(failedIds).toEqual(["b"]);
		});
	});

	describe("non-promise values", () => {
		test("should treat plain values as fulfilled", async () => {
			const result = await settle([1, "two", { three: 3 }]);

			expect(result.values).toEqual([1, "two", { three: 3 }]);
			expect(result.errors).toEqual([]);
		});

		test("should not invoke function values, returning them as fulfilled", async () => {
			const fn = () => "called";

			const result = await settle([fn]);

			expect(result.values).toEqual([fn]);
			expect(result.errors).toEqual([]);
		});
	});
});
