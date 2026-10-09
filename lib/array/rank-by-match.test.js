import { rankByMatch } from "./rank-by-match";
import { describe, expect, test } from "vite-plus/test";

describe("rankByMatch", () => {
	test("returns matching strings by length, then first match position", () => {
		const items = ["Blueberry", "Berry", "Blackberry", "Strawberry"];

		expect(rankByMatch(items, "BeRrY")).toEqual(["Berry", "Blueberry", "Blackberry", "Strawberry"]);
	});

	test("trims the query without trimming labels", () => {
		expect(rankByMatch([" Apple", "Apple", "apple "], " APPLE ")).toEqual([
			"Apple",
			"apple ",
			" Apple",
		]);
	});

	test("keeps input order when length and match position tie", () => {
		const items = ["cat", "bat", "hat"];

		expect(rankByMatch(items, "at")).toEqual(items);
	});

	test("returns the original objects and calls the label function once per item", () => {
		const items = [{ label: "Long match" }, { label: "Match" }, { label: 12 }];
		const calls = [];

		const result = rankByMatch(items, "match", (item, index, array) => {
			calls.push([item, index, array]);

			return item.label;
		});

		expect(result).toEqual([items[1], items[0]]);
		expect(result[0]).toBe(items[1]);
		expect(calls).toEqual(items.map((item, index) => [item, index, items]));
	});

	test("skips non-string labels", () => {
		expect(rankByMatch([null, 12, "12", undefined, { label: "12" }], "12")).toEqual(["12"]);
	});

	test("does not fold accents", () => {
		expect(rankByMatch(["café", "cafe"], "cafe")).toEqual(["cafe"]);
	});

	test("does not mutate the input array", () => {
		const items = ["Blackberry", "Berry", "Strawberry"];
		const result = rankByMatch(items, "berry");

		expect(result).toEqual(["Berry", "Blackberry", "Strawberry"]);
		expect(result).not.toBe(items);
		expect(items).toEqual(["Blackberry", "Berry", "Strawberry"]);
	});

	test.for([null, undefined, 0, false, {}, "berry", []])(
		"returns an empty array for invalid or empty arrays: %s",
		(array) => {
			expect(rankByMatch(array, "berry")).toEqual([]);
		},
	);

	test.for([null, undefined, 0, false, {}, "", "  "])(
		"returns an empty array for invalid or blank queries: %s",
		(query) => {
			expect(rankByMatch(["Berry"], query)).toEqual([]);
		},
	);

	test.for([null, 0, false, {}, "label"])(
		"returns an empty array for invalid label functions: %s",
		(getLabel) => {
			expect(rankByMatch(["Berry"], "berry", getLabel)).toEqual([]);
		},
	);
});
