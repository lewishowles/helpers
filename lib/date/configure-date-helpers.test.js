import { beforeEach, describe, expect, test } from "vite-plus/test";
import { configureDateHelpers, resetDateHelpersConfig } from "./configure-date-helpers";

describe("configure-date-helpers", () => {
	beforeEach(() => {
		resetDateHelpersConfig();
	});

	test("Returns the default configuration", () => {
		expect(configureDateHelpers()).toEqual({
			locale: "en-GB",
			timeZone: "Europe/London",
			inputFormat: "DD/MM/YYYY",
			defaultFormat: "date",
			formats: {
				date: { dateStyle: "medium" },
				dateTime: { dateStyle: "medium", timeStyle: "short" },
				shortDate: "DD/MM/YYYY",
			},
		});
	});

	test("Updates top-level configuration", () => {
		const config = configureDateHelpers({
			locale: "en-US",
			timeZone: "America/New_York",
			inputFormat: "MM/DD/YYYY",
		});

		expect(config).toEqual({
			locale: "en-US",
			timeZone: "America/New_York",
			inputFormat: "MM/DD/YYYY",
			defaultFormat: "date",
			formats: {
				date: { dateStyle: "medium" },
				dateTime: { dateStyle: "medium", timeStyle: "short" },
				shortDate: "DD/MM/YYYY",
			},
		});
	});

	test("Merges configured formats", () => {
		const config = configureDateHelpers({
			formats: {
				shortDate: "MM/DD/YYYY",
				weekday: { weekday: "long" },
			},
		});

		expect(config.formats).toEqual({
			date: { dateStyle: "medium" },
			dateTime: { dateStyle: "medium", timeStyle: "short" },
			shortDate: "MM/DD/YYYY",
			weekday: { weekday: "long" },
		});
	});

	test("Does not expose mutable config", () => {
		const config = configureDateHelpers();

		config.formats.shortDate = "MM/DD/YYYY";

		expect(configureDateHelpers().formats.shortDate).toBe("DD/MM/YYYY");
	});
});
