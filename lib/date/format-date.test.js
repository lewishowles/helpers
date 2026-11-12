import { configureDateHelpers, resetDateHelpersConfig } from "./configure-date-helpers";
import { formatDate } from "./format-date";
import { Temporal as OtherTemporal } from "temporal-polyfill/full";
import { beforeEach, describe, expect, test, vi } from "vite-plus/test";

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

	test("Reuses Intl formatters for matching settings", () => {
		const dateTimeFormatSpy = vi.spyOn(Intl, "DateTimeFormat");
		const timestamp = Date.UTC(2026, 5, 22, 10, 15, 30);
		const options = { locale: "fr-CA", timeZone: "Pacific/Auckland" };

		try {
			formatDate(timestamp, { year: "numeric", month: "long" }, options);
			formatDate(timestamp, { month: "long", year: "numeric" }, options);
			expect(dateTimeFormatSpy).toHaveBeenCalledTimes(1);

			formatDate(timestamp, { year: "numeric", month: "long" }, { ...options, locale: "es-MX" });

			formatDate(
				timestamp,
				{ year: "numeric", month: "long" },
				{ ...options, timeZone: "Pacific/Fiji" },
			);

			formatDate(timestamp, { year: "2-digit", month: "long" }, options);
			expect(dateTimeFormatSpy).toHaveBeenCalledTimes(4);
		} finally {
			dateTimeFormatSpy.mockRestore();
		}
	});

	test("Uses the format's time zone when caching an Intl formatter", () => {
		const dateTimeFormatSpy = vi.spyOn(Intl, "DateTimeFormat");
		const timestamp = Date.UTC(2026, 5, 22, 10, 15, 30);
		const format = { dateStyle: "medium", timeZone: "Europe/Paris" };

		try {
			formatDate(timestamp, format, { locale: "en-CA", timeZone: "Pacific/Auckland" });
			formatDate(timestamp, format, { locale: "en-CA", timeZone: "Pacific/Fiji" });
			expect(dateTimeFormatSpy).toHaveBeenCalledTimes(1);
		} finally {
			dateTimeFormatSpy.mockRestore();
		}
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

	test.for([
		["PlainDate", OtherTemporal.PlainDate.from("2026-06-22")],
		["PlainDateTime", OtherTemporal.PlainDateTime.from("2026-06-22T10:15:30")],
		["Instant", OtherTemporal.Instant.from("2026-06-22T10:15:30Z")],
		["ZonedDateTime", OtherTemporal.ZonedDateTime.from("2026-06-22T10:15:30+01:00[Europe/London]")],
	])("Formats compatible Temporal.%s values", ([, value]) => {
		expect(formatDate(value)).toBe("22 Jun 2026");
	});

	test("Returns null for invalid dates", () => {
		expect(formatDate("not a date")).toBeNull();
	});
});
