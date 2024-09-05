import { describe, expect, test } from "vitest";
import { getNextColour } from "./get-next-colour";

describe("get-next-colour", () => {
	test("should retrieve the next colour", () => {
		expect(getNextColour(0)).toBe("text-pink-900");
		expect(getNextColour(1)).toBe("text-pink-700");
		expect(getNextColour(2)).toBe("text-pink-500");
		expect(getNextColour(3)).toBe("text-pink-300");
		expect(getNextColour(4)).toBe("text-pink-100");
		expect(getNextColour(5)).toBe("text-pink-900");
		expect(getNextColour(6)).toBe("text-pink-700");
		expect(getNextColour(7)).toBe("text-pink-500");
	});

	test("should allow colour options to be provided", () => {
		expect(getNextColour(0, ["A", "B", "C"])).toBe("A");
		expect(getNextColour(1, ["A", "B", "C"])).toBe("B");
		expect(getNextColour(2, ["A", "B", "C"])).toBe("C");
		expect(getNextColour(3, ["A", "B", "C"])).toBe("A");
		expect(getNextColour(4, ["A", "B", "C"])).toBe("B");
	});
});
