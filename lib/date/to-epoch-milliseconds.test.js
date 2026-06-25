import { beforeEach, describe, expect, test } from "vite-plus/test";
import { resetDateHelpersConfig } from "./configure-date-helpers";
import { toEpochMilliseconds } from "./to-epoch-milliseconds";

describe("to-epoch-milliseconds", () => {
	beforeEach(() => {
		resetDateHelpersConfig();
	});

	test("Converts instants to epoch milliseconds", () => {
		expect(toEpochMilliseconds("2026-06-22T10:15:30Z")).toBe(Date.UTC(2026, 5, 22, 10, 15, 30));
	});

	test("Uses configured timezone for plain dates", () => {
		expect(toEpochMilliseconds("22/06/2026")).toBe(Date.UTC(2026, 5, 21, 23));
	});

	test("Uses per-call timezone for plain dates", () => {
		expect(
			toEpochMilliseconds("06/22/2026", {
				inputFormat: "MM/DD/YYYY",
				timeZone: "America/New_York",
			}),
		).toBe(Date.UTC(2026, 5, 22, 4));
	});

	test("Uses configured timezone for plain date-times", () => {
		expect(
			toEpochMilliseconds("22/06/2026 10:15", {
				inputFormat: "DD/MM/YYYY HH:mm",
			}),
		).toBe(Date.UTC(2026, 5, 22, 9, 15));
	});

	test("Converts ZonedDateTimes to epoch milliseconds", () => {
		expect(toEpochMilliseconds("2026-06-22T10:15:30+01:00[Europe/London]")).toBe(
			Date.UTC(2026, 5, 22, 9, 15, 30),
		);
	});

	test("Converts Date instances to epoch milliseconds", () => {
		expect(toEpochMilliseconds(new Date(Date.UTC(2026, 5, 22, 10, 15, 30)))).toBe(
			Date.UTC(2026, 5, 22, 10, 15, 30),
		);
	});

	test("Converts timestamps to epoch milliseconds", () => {
		expect(toEpochMilliseconds(Date.UTC(2026, 5, 22, 10, 15, 30))).toBe(
			Date.UTC(2026, 5, 22, 10, 15, 30),
		);
	});

	test("Returns null for invalid dates", () => {
		expect(toEpochMilliseconds("not a date")).toBeNull();
	});
});
