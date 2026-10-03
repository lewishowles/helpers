import { resolveOrFallback } from "./resolve-or-fallback";
import { describe, expect, test, vi } from "vite-plus/test";

describe("resolve-or-fallback", () => {
	describe("fulfilled", () => {
		test("should return the resolved value of a fulfilled promise", async () => {
			expect(await resolveOrFallback(Promise.resolve("value"), "fallback")).toBe("value");
		});

		test("should not call a function fallback when the promise fulfils", async () => {
			const fallback = vi.fn(() => "fallback");
			const result = await resolveOrFallback(Promise.resolve("value"), fallback);

			expect(result).toBe("value");
			expect(fallback).not.toHaveBeenCalled();
		});
	});

	describe("rejected", () => {
		test("should return a value fallback when the promise rejects", async () => {
			expect(await resolveOrFallback(Promise.reject("nope"), "fallback")).toBe("fallback");
		});

		test("should call a function fallback when the promise rejects", async () => {
			const fallback = vi.fn(() => "computed");
			const result = await resolveOrFallback(Promise.reject("nope"), fallback);

			expect(result).toBe("computed");
			expect(fallback).toHaveBeenCalledOnce();
		});

		test("should propagate an error thrown by a function fallback", async () => {
			/**
			 * Record when the fallback function runs.
			 *
			 * @throws  {Error}
			 *     The error used to check that fallback failures propagate.
			 */
			const fallback = () => {
				throw new Error("fallback failed");
			};

			await expect(resolveOrFallback(Promise.reject("nope"), fallback)).rejects.toThrow(
				"fallback failed",
			);
		});

		test("should resolve to undefined when the fallback is undefined", async () => {
			expect(await resolveOrFallback(Promise.reject("nope"), undefined)).toBeUndefined();
		});
	});

	describe("non-thenable input", () => {
		describe("should resolve plain values as-is", () => {
			test.for([
				["number (positive)", 1],
				["number (zero)", 0],
				["string (non-empty)", "string"],
				["string (empty)", ""],
				["boolean (false)", false],
				["object", { key: "value" }],
				["array", [1, 2, 3]],
			])("%s", async ([, input]) => {
				expect(await resolveOrFallback(input, "fallback")).toEqual(input);
			});
		});

		test("should resolve to the fallback for a null input", async () => {
			expect(await resolveOrFallback(null, "fallback")).toBe("fallback");
		});

		test("should resolve to the fallback for an undefined input", async () => {
			expect(await resolveOrFallback(undefined, "fallback")).toBe("fallback");
		});

		test("should call a function fallback for a null input", async () => {
			expect(await resolveOrFallback(null, () => "computed")).toBe("computed");
		});
	});

	describe("thenables", () => {
		test("should resolve a custom thenable", async () => {
			// A hand-written thenable proves that a value with a `then` method
			// is awaited like a Promise, rather than returned as-is.
			const thenable = {
				/**
				 * Resolve the test value when the thenable is awaited.
				 *
				 * @param  {Function}  resolve
				 *     The function that receives the resolved value.
				 *
				 * @returns  {any}
				 *     The result of resolving the test value.
				 */
				then: (resolve) => resolve("thenable value"), // eslint-disable-line unicorn/no-thenable
			};

			expect(await resolveOrFallback(thenable, "fallback")).toBe("thenable value");
		});

		test("should always return a promise", () => {
			expect(resolveOrFallback("value", "fallback")).toBeInstanceOf(Promise);
		});
	});
});
