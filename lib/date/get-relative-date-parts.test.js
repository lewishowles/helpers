import { beforeEach, describe, expect, test } from "vite-plus/test";
import { getRelativeDateParts } from "./get-relative-date-parts";
import { resetDateHelpersConfig } from "./configure-date-helpers";

describe("get-relative-date-parts", () => {
	beforeEach(() => {
		resetDateHelpersConfig();
	});

	test.for([
		["same second", "2026-06-22T10:00:00", "2026-06-22T10:00:00", { value: 0, unit: "second" }],
		["past seconds", "2026-06-22T09:59:30", "2026-06-22T10:00:00", { value: -30, unit: "second" }],
		["past minutes", "2026-06-22T09:30:00", "2026-06-22T10:00:00", { value: -30, unit: "minute" }],
		["past hours", "2026-06-22T05:00:00", "2026-06-22T10:00:00", { value: -5, unit: "hour" }],
		["past days", "2026-06-20T10:00:00", "2026-06-22T10:00:00", { value: -2, unit: "day" }],
		["past weeks", "2026-06-15T10:00:00", "2026-06-22T10:00:00", { value: -1, unit: "week" }],
		["past weeks (3)", "2026-06-01T10:00:00", "2026-06-22T10:00:00", { value: -3, unit: "week" }],
		["past months", "2026-04-23T10:00:00", "2026-06-22T10:00:00", { value: -2, unit: "month" }],
		["past years", "2024-06-22T10:00:00", "2026-06-22T10:00:00", { value: -2, unit: "year" }],
		["future minutes", "2026-06-22T10:01:00", "2026-06-22T10:00:00", { value: 1, unit: "minute" }],
	])("Returns relative parts for %s", ([, value, relativeTo, expected]) => {
		expect(getRelativeDateParts(value, relativeTo)).toEqual(expected);
	});

	test("Handles ZonedDateTime inputs", () => {
		expect(
			getRelativeDateParts(
				"2026-06-22T09:00:00+01:00[Europe/London]",
				"2026-06-22T10:00:00+01:00[Europe/London]",
			),
		).toEqual({ value: -1, unit: "hour" });
	});

	test("Handles Date instances", () => {
		expect(
			getRelativeDateParts(
				new Date(Date.UTC(2026, 5, 22, 9, 0, 0)),
				new Date(Date.UTC(2026, 5, 22, 10, 0, 0)),
			),
		).toEqual({ value: -1, unit: "hour" });
	});

	test("Handles timestamps", () => {
		expect(
			getRelativeDateParts(Date.UTC(2026, 5, 22, 9, 0, 0), Date.UTC(2026, 5, 22, 10, 0, 0)),
		).toEqual({ value: -1, unit: "hour" });
	});

	test("Returns null for invalid dates", () => {
		expect(getRelativeDateParts("not a date", "2026-06-22T10:00:00")).toBeNull();
		expect(getRelativeDateParts("2026-06-22T10:00:00", "not a date")).toBeNull();
	});
});
