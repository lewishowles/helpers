import { beforeEach, describe, expect, test } from "vite-plus/test";
import { configureDateHelpers, resetDateHelpersConfig } from "./configure-date-helpers";
import { formatDate } from "./format-date";

describe("format-date", () => {
	beforeEach(() => {
		resetDateHelpersConfig();
	});

	test("Formats with the default named format", () => {
		expect(formatDate("22/06/2026")).toBe("22 Jun 2026");
	});

	test("Formats with a configured token format", () => {
		expect(formatDate("22/06/2026", "shortDate")).toBe("22/06/2026");
	});

	test("Formats with a token string", () => {
		expect(formatDate("22/06/2026", "YYYY-MM-DD")).toBe("2026-06-22");
	});

	test("Formats with Intl options", () => {
		expect(
			formatDate("22/06/2026", {
				day: "2-digit",
				month: "long",
				year: "numeric",
			}),
		).toBe("22 June 2026");
	});

	test("Uses configured locale and timezone", () => {
		configureDateHelpers({
			locale: "en-US",
			timeZone: "America/New_York",
			inputFormat: "MM/DD/YYYY",
			formats: {
				date: { dateStyle: "medium" },
				shortDate: "MM/DD/YYYY",
			},
		});

		expect(formatDate("06/22/2026")).toBe("Jun 22, 2026");
		expect(formatDate("06/22/2026", "shortDate")).toBe("06/22/2026");
	});

	test("Lets per-call options override global config", () => {
		expect(
			formatDate("06/22/2026", "shortDate", {
				inputFormat: "MM/DD/YYYY",
				timeZone: "America/New_York",
				formats: {
					shortDate: "MM/DD/YYYY",
				},
			}),
		).toBe("06/22/2026");
	});

	test("Formats ZonedDateTime inputs", () => {
		expect(formatDate("2026-06-22T10:15:30+01:00[Europe/London]")).toBe("22 Jun 2026");
	});

	test("Formats Date instances", () => {
		expect(formatDate(new Date(Date.UTC(2026, 5, 22, 10, 15, 30)))).toBe("22 Jun 2026");
	});

	test("Formats timestamps", () => {
		expect(formatDate(Date.UTC(2026, 5, 22, 10, 15, 30))).toBe("22 Jun 2026");
	});

	test("Returns null for invalid dates", () => {
		expect(formatDate("not a date")).toBeNull();
	});
});
