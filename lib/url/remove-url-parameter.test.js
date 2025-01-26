import { beforeEach, describe, it, expect, vi } from "vitest";
import { removeUrlParameter } from "./remove-url-parameter";

describe("removeUrlParameter", () => {
	const replaceState = vi.spyOn(window.history, "replaceState");

	beforeEach(() => {
		replaceState.mockClear();

		window.location.href = "http://example.com";
	});

	it("should remove an existing parameter", () => {
		window.location.href = "http://example.com?existing=test";

		removeUrlParameter("existing");

		const calledUrl = replaceState.mock.calls[0][2].toString();

		expect(calledUrl).toEqual(expect.not.stringContaining("?"));
	});

	it("should not modify a URL if the given parameter does not exist", () => {
		window.location.href = "http://example.com?existing=test";

		removeUrlParameter("doesnt-exist");

		const calledUrl = replaceState.mock.calls[0][2].toString();

		expect(calledUrl).toEqual(expect.stringMatching(/\?existing=test$/));
	});
});
