import { describe, expect, test } from "vitest";
import { StringManipulator } from "./string-manipulator";

describe("string-manipulator", () => {
	describe("ltrim", () => {
		test("should pass through to helper", () => {
			const manipulator = new StringManipulator("   Initial string   ");

			expect(manipulator.ltrim().value).toBe("Initial string   ");
		});

		test("should handle additional options", () => {
			const manipulator = new StringManipulator("***Initial string***");

			expect(manipulator.ltrim("*").value).toBe("Initial string***");
		});
	});

	describe("rtrim", () => {
		test("should pass through to helper", () => {
			const manipulator = new StringManipulator("   Initial string   ");

			expect(manipulator.rtrim().value).toBe("   Initial string");
		});

		test("should handle additional options", () => {
			const manipulator = new StringManipulator("***Initial string***");

			expect(manipulator.rtrim("*").value).toBe("***Initial string");
		});
	});

	describe("toLowerCase", () => {
		test("should pass through to helper", () => {
			const manipulator = new StringManipulator("Initial string");

			expect(manipulator.toLowerCase().value).toBe("initial string");
		});
	});

	describe("toUpperCase", () => {
		test("should pass through to helper", () => {
			const manipulator = new StringManipulator("Initial string");

			expect(manipulator.toUpperCase().value).toBe("INITIAL STRING");
		});
	});

	describe("trim", () => {
		test("should pass through to helper", () => {
			const manipulator = new StringManipulator("   Initial string   ");

			expect(manipulator.trim().value).toBe("Initial string");
		});

		test("should handle additional options", () => {
			const manipulator = new StringManipulator("***Initial string***");

			expect(manipulator.trim("*").value).toBe("Initial string");
		});
	});

	describe("truncate", () => {
		test("should pass through to helper", () => {
			const manipulator = new StringManipulator("Initial string");

			expect(manipulator.truncate(5).value).toBe("Init…");
		});

		test("should handle additional options", () => {
			const manipulator = new StringManipulator("Initial string");

			expect(manipulator.truncate(5, { preserveWords: true }).value).toBe("…");
		});
	});

	test("should allow methods to be chained", () => {
		const manipulator = new StringManipulator("   Initial string***");

		expect(manipulator.toLowerCase().ltrim().rtrim("*").truncate(6).value).toBe("initi…");
	});

	test("should handle an invalid initial value", () => {
		const manipulator = new StringManipulator(null);

		expect(manipulator.value).toBe("");
	});
});
