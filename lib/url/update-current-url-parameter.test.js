import { beforeEach, describe, expect, test, vi } from "vite-plus/test";
import { updateCurrentUrlParameter } from "./update-current-url-parameter";

describe("updateCurrentUrlParameter", () => {
	const replaceState = vi.spyOn(window.history, "replaceState");

	beforeEach(() => {
		replaceState.mockClear();

		window.location.href = "http://example.com";
	});

	test("should add a new parameter if it does not exist", () => {
		updateCurrentUrlParameter("newParam", "newValue");

		const calledUrl = replaceState.mock.calls[0][2].toString();

		expect(calledUrl).toEqual(expect.stringMatching(/\?newParam=newValue$/));
	});

	test("should update the value of an existing parameter", () => {
		window.location.href = "http://example.com?existing=oldValue";

		updateCurrentUrlParameter("existing", "newExistingValue");

		const calledUrl = replaceState.mock.calls[0][2].toString();

		expect(calledUrl).toEqual(expect.stringMatching(/\?existing=newExistingValue$/));
	});

	test("should remove a parameter if the value is null", () => {
		updateCurrentUrlParameter("existing", "test");

		let calledUrl = replaceState.mock.calls[0][2].toString();

		expect(calledUrl).toEqual(expect.stringMatching(/\?existing=test$/));

		updateCurrentUrlParameter("existing", null);

		calledUrl = replaceState.mock.calls[1][2].toString();

		expect(calledUrl).toEqual(expect.not.stringContaining("?"));
	});

	test("should not modify the URL for an invalid parameter name", () => {
		updateCurrentUrlParameter("", "test");

		expect(replaceState).not.toHaveBeenCalled();
	});
});
