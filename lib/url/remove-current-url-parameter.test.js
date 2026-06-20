import { beforeEach, describe, expect, test, vi } from "vite-plus/test";
import { removeCurrentUrlParameter } from "./remove-current-url-parameter";

describe("removeCurrentUrlParameter", () => {
	const replaceState = vi.spyOn(window.history, "replaceState");

	beforeEach(() => {
		replaceState.mockClear();

		window.location.href = "http://example.com";
	});

	test("should remove an existing parameter", () => {
		window.location.href = "http://example.com?existing=test";

		removeCurrentUrlParameter("existing");

		const calledUrl = replaceState.mock.calls[0][2].toString();

		expect(calledUrl).toEqual(expect.not.stringContaining("?"));
	});

	test("should not modify a URL if the given parameter does not exist", () => {
		window.location.href = "http://example.com?existing=test";

		removeCurrentUrlParameter("doesnt-exist");

		const calledUrl = replaceState.mock.calls[0][2].toString();

		expect(calledUrl).toEqual(expect.stringMatching(/\?existing=test$/));
	});
});
