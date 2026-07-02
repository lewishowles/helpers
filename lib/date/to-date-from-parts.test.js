import { describe, expect, test } from "vite-plus/test";
import { toDateFromParts } from "./to-date-from-parts";
import { Temporal } from "temporal-polyfill";

describe("to-date-from-parts", () => {
	test("Builds a plain date from valid parts", () => {
		const date = toDateFromParts({ year: 2026, month: 6, day: 22 });

		expect(date).toBeInstanceOf(Temporal.PlainDate);
		expect(date.toString()).toBe("2026-06-22");
	});

	test.for([
		["missing parts", {}],
		["out-of-range day", { year: 2026, month: 2, day: 30 }],
		["non-numeric parts", { year: 2026, month: "a", day: 22 }],
		["array", [2026, 6, 22]],
		["ISO string", "2026-06-22"],
		["timestamp", Date.now()],
		["Date instance", new Date()],
		["Temporal.PlainDate", Temporal.Now.plainDateISO()],
		["null", null],
		["undefined", undefined],
	])("Returns null for %s", ([, parts]) => {
		expect(toDateFromParts(parts)).toBeNull();
	});
});
