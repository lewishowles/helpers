import { describe, expect, test } from "vite-plus/test";
import { hasDateParts } from "./has-date-parts";

describe("has-date-parts", () => {
	test.for([
		["day", { day: "1", month: "", year: "" }],
		["month", { day: "", month: "2", year: "" }],
		["year", { day: "", month: "", year: "2026" }],
		["numeric zero", { day: 0, month: "", year: "" }],
	])("Returns true when %s has a value", ([, parts]) => {
		expect(hasDateParts(parts)).toBe(true);
	});

	test.for([
		["empty parts", { day: "", month: "", year: "" }],
		["whitespace parts", { day: " ", month: "", year: "" }],
		["missing parts", {}],
		["array", []],
		["null", null],
		["undefined", undefined],
	])("Returns false for %s", ([, parts]) => {
		expect(hasDateParts(parts)).toBe(false);
	});
});
