import { describe, expect, test } from "vitest";
import { getNextColour } from "./get-next-colour";

describe("get-next-colour", () => {
	test("should retrieve the next colour", () => {
		expect(getNextColour(0)).toBe("#045a8d");
		expect(getNextColour(1)).toBe("#2b8cbe");
		expect(getNextColour(2)).toBe("#74a9cf");
		expect(getNextColour(3)).toBe("#a6bddb");
		expect(getNextColour(4)).toBe("#d0d1e6");
		expect(getNextColour(5)).toBe("#f1eef6");
		expect(getNextColour(6)).toBe("#045a8d");
	});
});
