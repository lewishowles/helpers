import { beforeEach, describe, expect, test } from "vite-plus/test";
import { getDateParts } from "./get-date-parts";
import { resetDateHelpersConfig } from "./configure-date-helpers";

describe("get-date-parts", () => {
	beforeEach(() => {
		resetDateHelpersConfig();
	});

	test("Returns parts for plain date strings", () => {
		expect(getDateParts("2026-06-22")).toEqual({ year: 2026, month: 6, day: 22 });
	});

	test("Returns parts for plain date-time strings", () => {
		expect(getDateParts("2026-06-22T10:15:30")).toEqual({ year: 2026, month: 6, day: 22 });
	});

	test("Anchors instants to the configured timezone", () => {
		expect(getDateParts("2026-06-22T23:30:00Z")).toEqual({ year: 2026, month: 6, day: 23 });
	});

	test("Anchors instants to a per-call timezone", () => {
		expect(getDateParts("2026-06-22T23:30:00Z", { timeZone: "America/New_York" })).toEqual({
			year: 2026,
			month: 6,
			day: 22,
		});
	});

	test("Reads zoned date-times without re-anchoring", () => {
		expect(getDateParts("2026-06-22T23:30:00+01:00[Europe/London]")).toEqual({
			year: 2026,
			month: 6,
			day: 22,
		});
	});

	test("Passes parts objects through", () => {
		expect(getDateParts({ year: 2026, month: 6, day: 22 })).toEqual({
			year: 2026,
			month: 6,
			day: 22,
		});
	});

	test("Returns null for invalid dates", () => {
		expect(getDateParts("not a date")).toBeNull();
	});
});
