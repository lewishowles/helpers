import { afterEach, beforeEach, describe, expect, test, vi } from "vite-plus/test";
import { debounce } from "./debounce";

describe("debounce", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe("junk hardening", () => {
		test("returns a no-op when fn is not a function", () => {
			const debounced = debounce("not a function", 100);

			expect(debounced).toBeTypeOf("function");
			expect(debounced.cancel).toBeTypeOf("function");
			expect(debounced.flush).toBeTypeOf("function");

			expect(() => debounced()).not.toThrow();
			expect(debounced.flush()).toBeUndefined();
		});

		test.for([
			["non-number (string)", "delay"],
			["negative number", -1],
			["NaN", NaN],
		])("treats %s delay as 0", ([, inputDelay]) => {
			const fn = vi.fn();
			const debounced = debounce(fn, inputDelay);

			debounced("arg");

			// With delay 0 the timer fires immediately (next tick).
			vi.advanceTimersByTime(0);

			expect(fn).toHaveBeenCalledWith("arg");
		});

		test("treats non-object options as defaults", () => {
			const fn = vi.fn();
			const debounced = debounce(fn, 100, "not an object");

			// Defaults: leading=false, trailing=true — should not fire yet.
			debounced();
			expect(fn).not.toHaveBeenCalled();

			vi.advanceTimersByTime(100);
			expect(fn).toHaveBeenCalledTimes(1);
		});
	});

	describe("trailing-only (default)", () => {
		test("does not fire on first call", () => {
			const fn = vi.fn();
			const debounced = debounce(fn, 100);

			debounced();
			expect(fn).not.toHaveBeenCalled();
		});

		test("fires once after the delay", () => {
			const fn = vi.fn();
			const debounced = debounce(fn, 100);

			debounced();
			vi.advanceTimersByTime(100);

			expect(fn).toHaveBeenCalledTimes(1);
		});

		test("multiple rapid calls produce only one trailing invocation", () => {
			const fn = vi.fn();
			const debounced = debounce(fn, 100);

			debounced("a");
			debounced("b");
			debounced("c");

			vi.advanceTimersByTime(100);

			expect(fn).toHaveBeenCalledTimes(1);

			// Should use the latest call's arguments.
			expect(fn).toHaveBeenCalledWith("c");
		});
	});

	describe("leading-only", () => {
		test("fires immediately on first call", () => {
			const fn = vi.fn();
			const debounced = debounce(fn, 100, { leading: true, trailing: false });

			debounced("first");

			expect(fn).toHaveBeenCalledWith("first");
		});

		test("no trailing call after the delay", () => {
			const fn = vi.fn();
			const debounced = debounce(fn, 100, { leading: true, trailing: false });

			debounced("first");
			debounced("second");

			// Only the leading call should have fired.
			expect(fn).toHaveBeenCalledTimes(1);
			expect(fn).toHaveBeenCalledWith("first");

			vi.advanceTimersByTime(100);

			// Still only one call — no trailing.
			expect(fn).toHaveBeenCalledTimes(1);
		});
	});

	describe("leading + trailing", () => {
		test("fires on first call and again after the burst", () => {
			const fn = vi.fn();
			const debounced = debounce(fn, 100, { leading: true, trailing: true });

			debounced("first");

			// Leading call fires synchronously.
			expect(fn).toHaveBeenCalledTimes(1);
			expect(fn).toHaveBeenCalledWith("first");

			debounced("second");
			debounced("third");

			// Still only the leading call so far.
			expect(fn).toHaveBeenCalledTimes(1);

			vi.advanceTimersByTime(100);

			// Trailing call with latest arguments.
			expect(fn).toHaveBeenCalledTimes(2);
			expect(fn).toHaveBeenCalledWith("third");
		});

		test("single call with leading+trailing only fires once", () => {
			const fn = vi.fn();
			const debounced = debounce(fn, 100, { leading: true, trailing: true });

			debounced("only");

			expect(fn).toHaveBeenCalledTimes(1);

			vi.advanceTimersByTime(100);

			// The trailing timer fires but there were no subsequent calls, so
			// no second invocation.
			expect(fn).toHaveBeenCalledTimes(1);
		});
	});

	describe(".cancel()", () => {
		test("prevents a pending trailing call", () => {
			const fn = vi.fn();
			const debounced = debounce(fn, 100);

			debounced();
			debounced.cancel();

			vi.advanceTimersByTime(100);

			expect(fn).not.toHaveBeenCalled();
		});

		test("is safe to call when nothing is pending", () => {
			const fn = vi.fn();
			const debounced = debounce(fn, 100);

			expect(() => debounced.cancel()).not.toThrow();
		});
	});

	describe(".flush()", () => {
		test("invokes the pending call immediately and clears the timer", () => {
			const fn = vi.fn();
			const debounced = debounce(fn, 100);

			debounced("flush me");
			const result = debounced.flush();

			expect(result).toBeUndefined();
			expect(fn).toHaveBeenCalledTimes(1);
			expect(fn).toHaveBeenCalledWith("flush me");

			// A later timer advance should not fire again.
			vi.advanceTimersByTime(100);
			expect(fn).toHaveBeenCalledTimes(1);
		});

		test("returns undefined when nothing is pending", () => {
			const fn = vi.fn();
			const debounced = debounce(fn, 100);

			const result = debounced.flush();

			expect(result).toBeUndefined();
			expect(fn).not.toHaveBeenCalled();
		});

		test("does not throw when nothing is pending", () => {
			const fn = vi.fn();
			const debounced = debounce(fn, 100);

			expect(() => debounced.flush()).not.toThrow();
		});
	});

	describe("context and arguments", () => {
		test("preserves this context and arguments on trailing call", () => {
			const fn = vi.fn();
			const debounced = debounce(fn, 100);
			const context = { key: "value" };

			debounced.call(context, "a", "b");

			vi.advanceTimersByTime(100);

			expect(fn).toHaveBeenCalledWith("a", "b");
			expect(fn.mock.instances[0]).toBe(context);
		});

		test("trailing call uses the latest call's args and this", () => {
			const fn = vi.fn();
			const debounced = debounce(fn, 100);
			const context1 = { id: 1 };
			const context2 = { id: 2 };

			debounced.call(context1, "first");
			debounced.call(context2, "second");

			vi.advanceTimersByTime(100);

			expect(fn).toHaveBeenCalledTimes(1);
			expect(fn).toHaveBeenCalledWith("second");
			expect(fn.mock.instances[0]).toBe(context2);
		});
	});

	describe("both edges disabled", () => {
		test("never fires when both leading and trailing are false", () => {
			const fn = vi.fn();
			const debounced = debounce(fn, 100, { leading: false, trailing: false });

			debounced();
			debounced();
			debounced();

			vi.advanceTimersByTime(200);

			expect(fn).not.toHaveBeenCalled();
		});
	});
});
