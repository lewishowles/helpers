import { beforeEach, describe, expect, test } from "vite-plus/test";
import { resetDateHelpersConfig } from "./configure-date-helpers";
import { parseDate } from "./parse-date";
import { Temporal } from "temporal-polyfill";

describe("parse-date", () => {
	beforeEach(() => {
		resetDateHelpersConfig();
	});

	test("Parses ISO date strings as PlainDate", () => {
		const date = parseDate("2026-06-22");

		expect(date).toBeInstanceOf(Temporal.PlainDate);
		expect(date.toString()).toBe("2026-06-22");
	});

	test("Parses ISO date-time strings as PlainDateTime", () => {
		const date = parseDate("2026-06-22T10:15:30");

		expect(date).toBeInstanceOf(Temporal.PlainDateTime);
		expect(date.toString()).toBe("2026-06-22T10:15:30");
	});

	test("Parses offset strings as Instant", () => {
		const date = parseDate("2026-06-22T10:15:30Z");

		expect(date).toBeInstanceOf(Temporal.Instant);
		expect(date.toString()).toBe("2026-06-22T10:15:30Z");
	});

	test("Parses RFC 9557 strings as ZonedDateTime", () => {
		const date = parseDate("2026-06-22T10:15:30+01:00[Europe/London]");

		expect(date).toBeInstanceOf(Temporal.ZonedDateTime);
		expect(date.toString()).toBe("2026-06-22T10:15:30+01:00[Europe/London]");
	});

	test("Parses configured token date strings", () => {
		const date = parseDate("22/06/2026");

		expect(date).toBeInstanceOf(Temporal.PlainDate);
		expect(date.toString()).toBe("2026-06-22");
	});

	test("Parses per-call token date strings", () => {
		const date = parseDate("06/22/2026", { inputFormat: "MM/DD/YYYY" });

		expect(date).toBeInstanceOf(Temporal.PlainDate);
		expect(date.toString()).toBe("2026-06-22");
	});

	test("Parses token date-time strings", () => {
		const date = parseDate("22/06/2026 10:15", { inputFormat: "DD/MM/YYYY HH:mm" });

		expect(date).toBeInstanceOf(Temporal.PlainDateTime);
		expect(date.toString()).toBe("2026-06-22T10:15:00");
	});

	test("Parses Date instances as Instant", () => {
		const date = parseDate(new Date(Date.UTC(2026, 5, 22, 10, 15, 30)));

		expect(date).toBeInstanceOf(Temporal.Instant);
		expect(date.toString()).toBe("2026-06-22T10:15:30Z");
	});

	test("Parses timestamps as Instant", () => {
		const date = parseDate(Date.UTC(2026, 5, 22, 10, 15, 30));

		expect(date).toBeInstanceOf(Temporal.Instant);
		expect(date.toString()).toBe("2026-06-22T10:15:30Z");
	});

	test.for([
		["Temporal.PlainDate", Temporal.PlainDate.from("2026-06-22")],
		["Temporal.PlainDateTime", Temporal.PlainDateTime.from("2026-06-22T10:15:30")],
		["Temporal.Instant", Temporal.Instant.from("2026-06-22T10:15:30Z")],
		[
			"Temporal.ZonedDateTime",
			Temporal.ZonedDateTime.from("2026-06-22T10:15:30+01:00[Europe/London]"),
		],
	])("Passes %s through unchanged", ([, value]) => {
		expect(parseDate(value)).toBe(value);
	});

	test.for([
		["empty string", ""],
		["invalid string", "not a date"],
		["invalid Date", new Date("invalid")],
		["NaN timestamp", NaN],
		["null", null],
		["undefined", undefined],
	])("Returns null for %s", ([, value]) => {
		expect(parseDate(value)).toBeNull();
	});
});
