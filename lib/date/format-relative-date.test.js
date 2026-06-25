import { beforeEach, describe, expect, test } from "vite-plus/test";
import { configureDateHelpers, resetDateHelpersConfig } from "./configure-date-helpers";
import { formatRelativeDate } from "./format-relative-date";

describe("format-relative-date", () => {
	beforeEach(() => {
		resetDateHelpersConfig();
	});

	test("Formats past relative dates", () => {
		expect(formatRelativeDate("2026-06-22T09:59:00", "2026-06-22T10:00:00")).toBe("1 minute ago");
	});

	test("Formats future relative dates", () => {
		expect(formatRelativeDate("2026-06-22T10:02:00", "2026-06-22T10:00:00")).toBe("in 2 minutes");
	});

	test("Uses configured locale", () => {
		configureDateHelpers({ locale: "de-DE" });

		expect(formatRelativeDate("2026-06-22T09:59:00", "2026-06-22T10:00:00")).toBe("vor 1 Minute");
	});

	test("Uses natural language for single-unit distances", () => {
		expect(formatRelativeDate("2026-06-21T10:00:00", "2026-06-22T10:00:00")).toBe("yesterday");
		expect(formatRelativeDate("2026-06-23T10:00:00", "2026-06-22T10:00:00")).toBe("tomorrow");
	});

	test("Handles ZonedDateTime inputs", () => {
		expect(
			formatRelativeDate(
				"2026-06-22T09:00:00+01:00[Europe/London]",
				"2026-06-22T10:00:00+01:00[Europe/London]",
			),
		).toBe("1 hour ago");
	});

	test("Handles Date instances", () => {
		expect(
			formatRelativeDate(
				new Date(Date.UTC(2026, 5, 22, 9, 0, 0)),
				new Date(Date.UTC(2026, 5, 22, 10, 0, 0)),
			),
		).toBe("1 hour ago");
	});

	test("Handles timestamps", () => {
		expect(
			formatRelativeDate(Date.UTC(2026, 5, 22, 9, 0, 0), Date.UTC(2026, 5, 22, 10, 0, 0)),
		).toBe("1 hour ago");
	});

	test("Returns null for invalid dates", () => {
		expect(formatRelativeDate("not a date", "2026-06-22T10:00:00")).toBeNull();
	});
});
