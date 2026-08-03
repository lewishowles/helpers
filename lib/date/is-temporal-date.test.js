import { describe, expect, test } from "vite-plus/test";
import { isTemporalDate } from "./is-temporal-date";
import { Temporal } from "temporal-polyfill";
import { Temporal as OtherTemporal } from "temporal-polyfill/full";

// Temporal values created by a separate compatible module identity.
const otherTemporalValues = [
	["Instant", OtherTemporal.Instant.from("2026-06-22T10:15:30Z")],
	["PlainDate", OtherTemporal.PlainDate.from("2026-06-22")],
	["PlainDateTime", OtherTemporal.PlainDateTime.from("2026-06-22T10:15:30")],
	["ZonedDateTime", OtherTemporal.ZonedDateTime.from("2026-06-22T10:15:30+01:00[Europe/London]")],
];

describe("is-temporal-date", () => {
	test.for(otherTemporalValues)("Recognises a compatible Temporal.%s", ([type, value]) => {
		expect(value).not.toBeInstanceOf(Temporal[type]);
		expect(isTemporalDate(value)).toBe(true);
		expect(isTemporalDate(value, type)).toBe(true);
	});

	test("Rejects a different supported Temporal type", () => {
		const date = OtherTemporal.PlainDate.from("2026-06-22");

		expect(isTemporalDate(date, "Instant")).toBe(false);
	});

	test.for([
		["Date", new Date()],
		["plain object", {}],
		["null", null],
		["undefined", undefined],
	])("Rejects %s", ([, value]) => {
		expect(isTemporalDate(value)).toBe(false);
	});
});
