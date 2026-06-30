import { describe, expect, test, vi, beforeEach, afterEach } from "vite-plus/test";
import { throttle } from "./throttle";

describe("throttle", function () {
	var fn;

	beforeEach(function () {
		vi.useFakeTimers();
		fn = vi.fn();
	});

	afterEach(function () {
		vi.useRealTimers();
	});

	describe("junk-hardening", function () {
		test("should return a no-op when fn is not a function", function () {
			var throttled = throttle(null, 100);

			expect(function () {
				throttled();
			}).not.toThrow();
			expect(function () {
				throttled.cancel();
			}).not.toThrow();
			expect(throttled.flush()).toBeUndefined();
		});

		describe("should treat non-numeric delay as 0", function () {
			test.for([
				["string", "abc"],
				["NaN", NaN],
				["negative number", -1],
			])("%s", function ([, delay]) {
				var throttled = throttle(fn, delay);

				throttled();
				throttled();
				throttled();

				expect(fn).toHaveBeenCalledTimes(3);
			});
		});

		test("should use defaults when options is not an object", function () {
			var throttled = throttle(fn, 100, "not-an-object");

			throttled();

			expect(fn).toHaveBeenCalledTimes(1);
		});

		test("should return a no-op when both leading and trailing are false", function () {
			var throttled = throttle(fn, 100, { leading: false, trailing: false });

			throttled();
			vi.advanceTimersByTime(200);
			throttled();

			expect(fn).not.toHaveBeenCalled();
			expect(function () {
				throttled.cancel();
			}).not.toThrow();
			expect(throttled.flush()).toBeUndefined();
		});
	});

	describe("leading edge (default)", function () {
		test("should fire immediately on the first call", function () {
			var throttled = throttle(fn, 100);

			throttled("a");

			expect(fn).toHaveBeenCalledTimes(1);
			expect(fn).toHaveBeenCalledWith("a");
		});

		test("should enforce cooldown and ignore rapid calls within the window", function () {
			var throttled = throttle(fn, 100);

			throttled("a");

			expect(fn).toHaveBeenCalledTimes(1);

			throttled("b");
			throttled("c");

			expect(fn).toHaveBeenCalledTimes(1);
		});
	});

	describe("trailing edge (default)", function () {
		test("should fire once after the window with the latest args", function () {
			var throttled = throttle(fn, 100);

			throttled("a");

			expect(fn).toHaveBeenCalledTimes(1);

			throttled("b");

			vi.advanceTimersByTime(100);

			expect(fn).toHaveBeenCalledTimes(2);
			expect(fn).toHaveBeenCalledWith("b");
		});

		test("should fire at most one leading and one trailing per window", function () {
			var throttled = throttle(fn, 100);

			throttled("a");

			expect(fn).toHaveBeenCalledTimes(1);

			throttled("b");
			throttled("c");

			vi.advanceTimersByTime(50);

			expect(fn).toHaveBeenCalledTimes(1);

			vi.advanceTimersByTime(50);

			expect(fn).toHaveBeenCalledTimes(2);
			expect(fn).toHaveBeenCalledWith("c");
		});
	});

	describe("window reset", function () {
		test("should fire normally after the window expires", function () {
			var throttled = throttle(fn, 100);

			throttled("a");

			expect(fn).toHaveBeenCalledTimes(1);

			vi.advanceTimersByTime(150);

			throttled("b");

			expect(fn).toHaveBeenCalledTimes(2);
			expect(fn).toHaveBeenCalledWith("b");
		});
	});

	describe("{ leading: false, trailing: true }", function () {
		test("should not fire on the leading edge", function () {
			var throttled = throttle(fn, 100, { leading: false });

			throttled("a");

			expect(fn).not.toHaveBeenCalled();
		});

		test("should fire on the trailing edge after the window", function () {
			var throttled = throttle(fn, 100, { leading: false });

			throttled("a");

			expect(fn).not.toHaveBeenCalled();

			vi.advanceTimersByTime(100);

			expect(fn).toHaveBeenCalledTimes(1);
			expect(fn).toHaveBeenCalledWith("a");
		});

		test("should use the latest args for the trailing call", function () {
			var throttled = throttle(fn, 100, { leading: false });

			throttled("a");
			throttled("b");

			vi.advanceTimersByTime(100);

			expect(fn).toHaveBeenCalledTimes(1);
			expect(fn).toHaveBeenCalledWith("b");
		});
	});

	describe(".cancel()", function () {
		test("should drop the pending trailing call during cooldown", function () {
			var throttled = throttle(fn, 100);

			throttled("a");

			expect(fn).toHaveBeenCalledTimes(1);

			throttled("b");
			throttled.cancel();

			vi.advanceTimersByTime(100);

			expect(fn).toHaveBeenCalledTimes(1);
		});

		test("should reset the cooldown window", function () {
			var throttled = throttle(fn, 100);

			throttled("a");
			throttled.cancel();

			throttled("b");

			expect(fn).toHaveBeenCalledTimes(2);
		});

		test("should be safe to call repeatedly", function () {
			var throttled = throttle(fn, 100);

			throttled.cancel();
			throttled.cancel();

			expect(function () {
				throttled();
			}).not.toThrow();

			expect(fn).toHaveBeenCalledTimes(1);
		});
	});

	describe(".flush()", function () {
		test("should invoke the pending trailing call immediately", function () {
			var throttled = throttle(fn, 100);

			throttled("a");

			expect(fn).toHaveBeenCalledTimes(1);

			throttled("b");

			var result = throttled.flush();

			expect(fn).toHaveBeenCalledTimes(2);
			expect(fn).toHaveBeenCalledWith("b");
			expect(result).toBeUndefined();
		});

		test("should return the result of the flushed call", function () {
			var add = vi.fn(function (a, b) {
				return a + b;
			});
			var throttled = throttle(add, 100, { leading: false });

			throttled(2, 3);

			var result = throttled.flush();

			expect(result).toBe(5);
		});

		test("should return undefined when nothing is pending", function () {
			var throttled = throttle(fn, 100);

			throttled("a");

			expect(fn).toHaveBeenCalledTimes(1);

			var result = throttled.flush();

			expect(result).toBeUndefined();
			expect(fn).toHaveBeenCalledTimes(1); // No additional call
		});

		test("should clear the timer so no further trailing fires", function () {
			var throttled = throttle(fn, 100);

			throttled("a");
			throttled("b");
			throttled.flush();

			expect(fn).toHaveBeenCalledTimes(2);

			vi.advanceTimersByTime(200);

			expect(fn).toHaveBeenCalledTimes(2);
		});
	});

	describe("this and arguments", function () {
		test("should preserve this context", function () {
			var ctx = { id: 1 };
			var captured;
			fn = vi.fn(function () {
				captured = this;
			});
			var throttled = throttle(fn, 100);

			throttled.call(ctx, "a");

			expect(captured).toBe(ctx);
		});

		test("should preserve arguments", function () {
			var throttled = throttle(fn, 100);

			throttled("a", "b", "c");

			expect(fn).toHaveBeenCalledWith("a", "b", "c");
		});
	});
});
