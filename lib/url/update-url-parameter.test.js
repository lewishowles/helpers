import { beforeEach, describe, it, expect, vi } from "vitest";
import { updateUrlParameter } from "./update-url-parameter";

describe("updateUrlParameter", () => {
	const replaceState = vi.spyOn(window.history, "replaceState");

	beforeEach(() => {
		replaceState.mockClear();

		window.location.href = "http://example.com";
	});

	it("should add a new parameter if it does not exist", () => {
		updateUrlParameter("newParam", "newValue");

		const calledUrl = replaceState.mock.calls[0][2].toString();

		expect(calledUrl).toEqual(expect.stringMatching(/\?newParam=newValue$/));
	});

	it("should update the value of an existing parameter", () => {
		updateUrlParameter("existing", "newExistingValue");

		const calledUrl = replaceState.mock.calls[0][2].toString();

		expect(calledUrl).toEqual(expect.stringMatching(/\?existing=newExistingValue$/));
	});

	it("should remove a parameter if the value is null", () => {
		updateUrlParameter("existing", "test");

		let calledUrl = replaceState.mock.calls[0][2].toString();

		expect(calledUrl).toEqual(expect.stringMatching(/\?existing=test$/));

		updateUrlParameter("existing", null);

		calledUrl = replaceState.mock.calls[1][2].toString();

		expect(calledUrl).toEqual(expect.not.stringContaining("?"));
	});
});
