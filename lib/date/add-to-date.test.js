import { addToDate } from "./add-to-date";
import { Temporal } from "temporal-polyfill";
import { describe, expect, test } from "vite-plus/test";

describe("addToDate", () => {
	describe("Validation", () => {
		test.for([
			["invalid unit", 1, "hour"],
			["empty unit", 1, ""],
			["non-integer amount", 1.5, "day"],
			["NaN amount", Number.NaN, "day"],
			["Infinity amount", Number.POSITIVE_INFINITY, "day"],
			["negative Infinity amount", Number.NEGATIVE_INFINITY, "day"],
		])("Returns null for %s", ([, amount, unit]) => {
			expect(addToDate("2026-07-06", amount, unit)).toBeNull();
		});

		test("Returns null for Temporal.Instant input", () => {
			const instant = Temporal.Instant.from("2026-07-06T10:00:00Z");

			expect(addToDate(instant, 1, "day")).toBeNull();
		});

		test("Returns null for Date instance (parses to Instant)", () => {
			expect(addToDate(new Date("2026-07-06T10:00:00Z"), 1, "day")).toBeNull();
		});

		test("Returns null for timestamp (parses to Instant)", () => {
			expect(addToDate(Date.now(), 1, "day")).toBeNull();
		});

		test.for([
			["null", null],
			["undefined", undefined],
			["empty string", ""],
			["invalid date string", "not-a-date"],
		])("Returns null for invalid input: %s", ([, value]) => {
			expect(addToDate(value, 1, "day")).toBeNull();
		});
	});

	describe("Adds to plain date string", () => {
		test("Days", () => {
			const result = addToDate("2026-07-06", 1, "day");

			expect(result).toBeInstanceOf(Temporal.PlainDate);
			expect(result.toString()).toBe("2026-07-07");
		});

		test("Weeks", () => {
			const result = addToDate("2026-07-06", 2, "week");

			expect(result).toBeInstanceOf(Temporal.PlainDate);
			expect(result.toString()).toBe("2026-07-20");
		});

		test("Months", () => {
			const result = addToDate("2026-07-06", 1, "month");

			expect(result).toBeInstanceOf(Temporal.PlainDate);
			expect(result.toString()).toBe("2026-08-06");
		});

		test("Years", () => {
			const result = addToDate("2026-07-06", 1, "year");

			expect(result).toBeInstanceOf(Temporal.PlainDate);
			expect(result.toString()).toBe("2027-07-06");
		});
	});

	describe("Input types", () => {
		test("Accepts Temporal.PlainDate input directly", () => {
			const date = Temporal.PlainDate.from("2026-07-06");
			const result = addToDate(date, 1, "day");

			expect(result.toString()).toBe("2026-07-07");
		});

		test("Accepts { year, month, day } parts input", () => {
			const result = addToDate({ year: 2026, month: 7, day: 6 }, 1, "day");

			expect(result).toBeInstanceOf(Temporal.PlainDate);
			expect(result.toString()).toBe("2026-07-07");
		});
	});

	test("Negative amounts subtract", () => {
		const result = addToDate("2026-07-06", -3, "day");

		expect(result).toBeInstanceOf(Temporal.PlainDate);
		expect(result.toString()).toBe("2026-07-03");
	});

	test("Zero amount returns the same date", () => {
		const result = addToDate("2026-07-06", 0, "day");

		expect(result).toBeInstanceOf(Temporal.PlainDate);
		expect(result.toString()).toBe("2026-07-06");
	});

	describe("Returns the same Temporal type as the input", () => {
		test("PlainDateTime", () => {
			const result = addToDate("2026-07-06T10:15:30", 1, "day");

			expect(result).toBeInstanceOf(Temporal.PlainDateTime);
			expect(result.toString()).toBe("2026-07-07T10:15:30");
		});

		test("ZonedDateTime", () => {
			const result = addToDate("2026-07-06T10:00:00[Europe/London]", 1, "month");

			expect(result).toBeInstanceOf(Temporal.ZonedDateTime);
			expect(result.toString()).toBe("2026-08-06T10:00:00+01:00[Europe/London]");
		});
	});

	describe("Overflow", () => {
		test("Month overflow constrains to the last valid day", () => {
			const result = addToDate("2026-01-31", 1, "month");

			expect(result.toString()).toBe("2026-02-28");
		});

		test("Year overflow constrains to the last valid day (leap year)", () => {
			const result = addToDate("2020-02-29", 1, "year");

			expect(result.toString()).toBe("2021-02-28");
		});
	});

	test("Does not mutate the input", () => {
		const date = Temporal.PlainDate.from("2026-07-06");
		const result = addToDate(date, 1, "day");

		expect(date.toString()).toBe("2026-07-06");
		expect(result.toString()).toBe("2026-07-07");
	});

	test("Passes options through to parseDate for token-format strings", () => {
		const result = addToDate("22/06/2026", 1, "day", { inputFormat: "DD/MM/YYYY" });

		expect(result).toBeInstanceOf(Temporal.PlainDate);
		expect(result.toString()).toBe("2026-06-23");
	});
});
