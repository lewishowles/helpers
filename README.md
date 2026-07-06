# Helpers

A library of gorgeous Javascript methods to make working with—and validating—data quicker and less error-prone, letting the developer concentrate on the fun stuff.

Import helpers from the root package:

```
import { getNextIndex } from "@lewishowles/helpers";
```

Helpers are also grouped by type when you want narrower imports:

```
import { getNextIndex } from "@lewishowles/helpers/array";
```

<!-- helpers:start -->

## Array

### `arrayLength(array: any[])`

Determine the number of items in the given `array`.

#### Parameters

- `array` `{any[]}` — The array to measure.

If the provided input is not an array, returns `0`.

#### Example

```js
arrayLength(["A", "B", "C", "D"]); // 4
arrayLength([]); // 0
arrayLength(undefined); // 0
```

### `chunk(array: any[], chunkSize: number)`

Split an array into chunks of a specified size

#### Parameters

- `array` `{any[]}` — The array to split into chunks.
- `chunkSize` `{number}` — The number of items to include in each chunk.

#### Example

```js
chunk([1, 2, 3], 2); // [[1, 2], [3]]
chunk([1, 2, 3], 1); // [[1], [2], [3]]
chunk([1, 2, 3], 5); // [[1, 2, 3]]
```

### `compact(array: any[])`

Remove falsy values from the given array.

#### Parameters

- `array` `{any[]}` — The array to remove falsy values from.

#### Example

```js
compact([0, 1, false, 2, "", 3]); // [1, 2, 3]
compact([true, true, true]); // [true, true, true]
```

### `ensureArray(variable: any)`

Ensure that the given variable is an array.

#### Parameters

- `variable` `{any}` — The value to return as an array.

Arrays are returned unchanged. Any non-array value is returned as a single-item array.

Note that `null` and `undefined` are preserved as values, returning `[null]` and `[undefined]`. Combine with `compact` when falsy values should be removed.

#### Example

```js
ensureArray(["one", "two"]); // ["one", "two"]
ensureArray("one"); // ["one"]
ensureArray({ key: "value" }); // [{ key: "value" }]
ensureArray(null); // [null]
ensureArray(undefined); // [undefined]
```

### `firstDefined(array: any[])`

Returns the first non-undefined element in `array`.

#### Parameters

- `array` `{any[]}` — The array to search.

#### Example

```js
firstDefined(["a", "b"]); // "a"
firstDefined([undefined, undefined, "c", "d"]); // "c"
firstDefined([]); // undefined
```

### `getNextIndex(index: number, reference: any[], { reverse: boolean = false, wrap: boolean = false })`

Given a starting `index`, determine the next available index in the `reference` array.

#### Parameters

- `index` `{number}` — The starting index to move from.
- `reference` `{any[]}` — The array that defines the valid index range.
- `options.reverse` `{boolean}` — Whether to find the previous index instead of the next index.
- `options.wrap` `{boolean}` — Whether to wrap around when moving beyond either end of the array.

If the provided index is outside of the reference array, or the provided index or reference array are unexpected, a default value of `0` is returned.

#### Example

```js
getNextIndex(3, ["A", "B", "C", "D"]); // 3
getNextIndex(3, ["A", "B", "C", "D"], { wrap: true }); // 0
getNextIndex(3, ["A", "B", "C", "D"], { reverse: true }); // 2
```

### `groupBy(array: object[], property: string)`

Group the given `array` of objects into sub-arrays keyed by the value at
`property`. Supports dot-path notation for nested properties.

#### Parameters

- `array` `{object[]}` — The array of objects to group.
- `property` `{string}` — The property path to group items by.

Items where `property` resolves to `undefined` are grouped under the key
`"undefined"`.

#### Example

```js
groupBy([{ type: "a", val: 1 }, { type: "b", val: 2 }, { type: "a", val: 3 }], "type");
// { a: [{ type: "a", val: 1 }, { type: "a", val: 3 }], b: [{ type: "b", val: 2 }] }

groupBy([{ addr: { city: "York" } }, { addr: { city: "York" } }, { addr: { city: "Leeds" } }], "addr.city");
// { York: [{ addr: { city: "York" } }, { addr: { city: "York" } }], Leeds: [{ addr: { city: "Leeds" } }] }
```

### `head(array: any[])`

Returns the first element in `array`.

#### Parameters

- `array` `{any[]}` — The array to read from.

#### Example

```js
head(["a", "b"]); // "a"
head([]); // undefined
```

### `isNonEmptyArray(variable: any[])`

Determines whether the given `variable` is both an array and has at least one item.

#### Parameters

- `variable` `{any[]}` — The value to check.

#### Example

```js
isNonEmptyArray(["A", "B", "C", "D"]); // true
isNonEmptyArray([]); // false
isNonEmptyArray("string"); // false
```

### `lastDefined(array: any[])`

Returns the last non-undefined element in `array`.

#### Parameters

- `array` `{any[]}` — The array to search.

#### Example

```js
lastDefined(["a", "b"]); // "b"
lastDefined(["a", "b", undefined, undefined]); // "b"
lastDefined([]); // undefined
```

### `moveItem(array: any[], fromIndex: number, toIndex: number)`

Move an item to a new position, returning a new array and leaving the
original untouched.

#### Parameters

- `array` `{any[]}` — The array containing the item to move.
- `fromIndex` `{number}` — The index of the item to move.
- `toIndex` `{number}` — The index to move the item to.

`toIndex` is read after the item has been removed, matching how drag-and-drop
libraries report a drop. `fromIndex` must point at an existing item,
otherwise the array is returned unchanged; `toIndex` is clamped into range.

#### Example

```js
moveItem(["a", "b", "c", "d"], 1, 3); // ["a", "c", "d", "b"]
moveItem(["a", "b", "c", "d"], 3, 1); // ["a", "d", "b", "c"]
moveItem(["a", "b", "c", "d"], 0, 3); // ["b", "c", "d", "a"]
```

### `partition(array: any[], predicate: function)`

Split an array into two arrays based on a predicate. Returns a tuple of
[matching[], nonMatching[]].

#### Parameters

- `array` `{any[]}` — The array to split.
- `predicate` `{function}` — The function used to decide which output array receives each item.

#### Example

```js
partition([1, 2, 3, 4, 5], (n) => n % 2 === 0); // [[2, 4], [1, 3, 5]]
partition([], () => true); // [[], []]
```

### `pluck(array: any[], property: string)`

Retrieve an array of the `property` value from each of the objects found in `array`.

#### Parameters

- `array` `{any[]}` — The array of objects to read from.
- `property` `{string}` — The direct property key to pluck from each object.

Any non-objects in `array` are ignored. Objects that don't have the given property yield `undefined` in the result. Empty or invalid input returns `[]`.

Note: `property` is a direct key only, and dot-path notation is not yet supported. Use `getPathValue` for nested access.

#### Example

```js
pluck([{ fruit: "apple" }, { fruit: "banana" }], "fruit"); // ["apple", "banana"]
pluck([{ fruit: "apple" }, { fruit: "banana" }], "colour"); // [undefined, undefined]
pluck([{ fruit: "apple" }, "not an object"], "fruit"); // ["apple"]
pluck([], "property"); // []
```

### `range(start: number, end?: number, step?: number)`

Generate a numeric array from `start` to `end`, both inclusive. When called
with a single argument, `start` is treated as `end` and the range begins at
`0`. Direction is inferred automatically when `start > end` and no `step` is
given; an explicit `step` overrides it. A zero `step` returns an empty array.

#### Parameters

- `start` `{number}` — The first number in the range, or the end value when called with one argument.
- `end` `{number}` — The final number to include in the range.
- `step` `{number}` — The amount to change by between each number.

#### Example

```js
range(5);        // [0, 1, 2, 3, 4, 5]
range(1, 5);     // [1, 2, 3, 4, 5]
range(0, 10, 2); // [0, 2, 4, 6, 8, 10]
range(5, 0);     // [5, 4, 3, 2, 1, 0]
range(5, 0, -1); // [5, 4, 3, 2, 1, 0]
```

### `sortByProperty(array: any[], criteria: object[])`

Returns a new array containing the `array` of objects, sorted by the value at
`property`, with optional direction. When an array of criteria objects is
passed, sorts by each criterion in order, using the first non-zero
comparison.

#### Parameters

- `array` `{any[]}` — The array of objects to sort.
- `property` `{string}` — The property path to sort by.
- `options.ascending` `{boolean}` — Whether to sort from lowest to highest.
- `criteria` `{object[]}` — An array of criteria objects to sort by, in priority order.
- `criteria[].property` `{string}` — The property path to sort by.
- `criteria[].ascending` `{boolean}` — Whether to sort from lowest to highest.

#### Example

```js
sortByProperty([{ name: "Lewis" }, { name: "Alice" }], "name"); // [{ name: "Alice" }, { name: "Lewis" }]
sortByProperty([{ name: "Lewis" }, { name: "Alice" }], "name", { ascending: false }); // [{ name: "Lewis" }, { name: "Alice" }]
sortByProperty([{ last: "Smith", first: "Alice" }, { last: "Jones", first: "Bob" }], [
  { property: "last", ascending: true },
  { property: "first", ascending: true },
]); // [{ last: "Jones", first: "Bob" }, { last: "Smith", first: "Alice" }]
```

### `tail(array: any[])`

Returns the last element in `array`.

#### Parameters

- `array` `{any[]}` — The array to read from.

#### Example

```js
tail(["a", "b"]); // "b"
tail([]); // undefined
```

### `toggleItem(array: any[], item: any, comparator?: ((a: any, b: any) => boolean) | string)`

Add an item to an array if it is not present, or remove all occurrences of it
if it is. Returns a new array and does not mutate the original.

#### Parameters

- `array` `{any[]}` — The array to toggle the item within.
- `item` `{any}` — The item to add or remove.
- `comparator` `{((a: any, b: any) => boolean) | string}` — The matching function or object key used to compare items.

#### Example

```js
toggleItem([1, 2, 3], 2);                             // [1, 3]
toggleItem([1, 2, 3], 4);                             // [1, 2, 3, 4]
toggleItem([{ id: 1 }, { id: 2 }], { id: 1 }, 'id');  // [{ id: 2 }]
```

### `unique(array: any[])`

Safely reduce the provided `array` to those entries which are unique.

#### Parameters

- `array` `{any[]}` — The array to reduce to unique entries.

#### Example

```js
unique([1, 2, 2, 3, 4, 4, 5]); // [1, 2, 3, 4, 5]
unique(["a", "b", "a", "c"]); // ["a", "b", "c"]
unique([]); // []
```

### `uniqueBy(array: object[], property: string)`

Remove duplicate objects from an array based on a property value. Supports
dot-path notation for nested properties. The first occurrence of each value
is kept.

#### Parameters

- `array` `{object[]}` — The array of objects to reduce.
- `property` `{string}` — The property path that identifies duplicate items.

Items where the resolved value is `undefined` are treated as equal, with only
the first occurrence kept.

#### Example

```js
uniqueBy([{ id: 1, name: "A" }, { id: 2, name: "B" }, { id: 1, name: "C" }], "id");
// [{ id: 1, name: "A" }, { id: 2, name: "B" }]
uniqueBy([{ address: { city: "London" } }, { address: { city: "Paris" } }, { address: { city: "London" } }], "address.city");
// [{ address: { city: "London" } }, { address: { city: "Paris" } }]
uniqueBy([{ id: 1 }, { id: 1 }, { id: 1 }], "id");
// [{ id: 1 }]
uniqueBy([], "id");
// []
```

## Date

### `addToDate(value: any, amount: number, unit: "day" | "week" | "month" | "year", options?: object)`

Shift a `parseDate`-compatible value by a calendar amount and unit, returning
a new Temporal value of the same precision as the input. Negative amounts
subtract; `0` returns an equivalent value for the same day.

#### Parameters

- `value` `{any}` — The date value to shift.
- `amount` `{number}` — The integer amount to shift by. Negative values subtract.
- `unit` `{("day"|"week"|"month"|"year")}` — The calendar unit to shift by.
- `options` `{object}` — Per-call date helper options (passed through to `parseDate`).
- `options.inputFormat` `{string}` — The Day.js-style token format used when parsing non-ISO strings.

`Temporal.Instant` values return `null` because instants have no calendar and
cannot accept calendar-unit arithmetic. Anchor to a timezone first if you
need to shift an instant.

#### Example

```js
addToDate("2026-07-06", 1, "day"); // Temporal.PlainDate 2026-07-07
addToDate("2026-07-06T10:15:30", -3, "day"); // Temporal.PlainDateTime 2026-07-03T10:15:30
addToDate("2026-07-06T10:00:00[Europe/London]", 2, "week"); // Temporal.ZonedDateTime 2026-07-20T10:00:00+01:00[Europe/London]
```

### `configureDateHelpers(config?: object)`

Set project-wide defaults for date parsing and formatting.

#### Parameters

- `config` `{object}` — The date helper defaults to merge into the active configuration.
- `config.locale` `{string}` — The BCP 47 locale used by Intl formatters.
- `config.timeZone` `{string}` — The timezone used when anchoring plain dates and date-times.
- `config.inputFormat` `{string}` — The Day.js-style token format used when parsing non-ISO strings.
- `config.defaultFormat` `{string}` — The named format used when formatting without a format argument.
- `config.formats` `{object}` — The named Day.js token or Intl format options available to `formatDate`.

Calling this helper with no arguments returns the current configuration.

Projects can override these defaults per helper call. The default locale is
`en-GB`, the default timezone is `Europe/London`, and token formats use
Day.js-style tokens such as `DD/MM/YYYY`.

The `formats` option is a map of named output formats. Each key is a name
that can be passed to `formatDate` as the format argument, and each value is
either a Day.js-style token string (e.g. `"DD/MM/YYYY"`) or an
`Intl.DateTimeFormatOptions` object (e.g. `{ dateStyle: "medium" }`). The
built-in named formats are `date`, `dateTime`, and `shortDate`. Projects can
override these or add their own — `formatDate` resolves the key at call time.
The `defaultFormat` option determines which named format is used when
`formatDate` is called with no format argument.

#### Example

```js
// formatDate("22/06/2026") uses defaultFormat → "fullDate"
// formatDate("22/06/2026", "shortDate") uses the named format → "06/22/2026"
```

### `formatDate(value: any, format?: string|object, options?: object)`

Format supported date input using a named configured format, a Day.js-style
token string, or `Intl.DateTimeFormat` options.

#### Parameters

- `value` `{any}` — The date value to format.
- `format` `{string | object}` — The named format, Day.js token string, or Intl format options to use.
- `options` `{object}` — Per-call date helper options.
- `options.locale` `{string}` — The BCP 47 locale used by Intl formatters.
- `options.timeZone` `{string}` — The timezone used when anchoring plain dates and date-times.
- `options.inputFormat` `{string}` — The Day.js-style token format used when parsing non-ISO strings.
- `options.defaultFormat` `{string}` — The named format used when `format` is omitted.
- `options.formats` `{object}` — The named Day.js token or Intl format options available by key.

#### Example

```js
formatDate("22/06/2026");
formatDate("22/06/2026", "shortDate");
formatDate("2026-06-22", { year: "numeric", month: "long", day: "2-digit" });
```

### `formatRelativeDate(value: any, relativeTo?: any, options?: object)`

Format a supported date input as a relative date string, such as
`3 minutes ago` or `in 2 days`.

#### Parameters

- `value` `{any}` — The date value to format.
- `relativeTo` `{any}` — The date value to compare against.
- `options` `{object}` — Per-call date helper options.
- `options.locale` `{string}` — The BCP 47 locale used by the relative time formatter.
- `options.timeZone` `{string}` — The timezone used when anchoring plain dates and date-times.
- `options.inputFormat` `{string}` — The Day.js-style token format used when parsing non-ISO strings.

#### Example

```js
formatRelativeDate("2026-06-22T09:59:00", "2026-06-22T10:00:00");
// "1 minute ago"
```

### `getDateHelpersConfig()`

Get a defensive copy of the active date helper configuration. Useful when building custom date helpers that should respect the same global defaults set via `configureDateHelpers`.

#### Example

```js
const config = getDateHelpersConfig();
// { locale: "en-GB", timeZone: "Europe/London", inputFormat: "DD/MM/YYYY", ... }
```

### `getDateParts(value: any, options?: object)`

Convert a `parseDate`-compatible input into `{ year, month, day }`, for use
with `<input type="date">`-style three-field date components. Instants and
zoned date-times are anchored to the configured or per-call timezone before
the calendar date is read.

#### Parameters

- `value` `{any}` — The date value to convert.
- `options` `{object}` — Per-call date helper options.
- `options.timeZone` `{string}` — The timezone used when anchoring instants and zoned date-times.
- `options.inputFormat` `{string}` — The Day.js-style token format used when parsing non-ISO strings.

Invalid or empty input returns `null`.

#### Example

```js
getDateParts("2026-06-22"); // { year: 2026, month: 6, day: 22 }
getDateParts("2026-06-22T23:30:00Z", { timeZone: "Europe/London" });
// { year: 2026, month: 6, day: 23 }
getDateParts("not a date"); // null
```

### `getRelativeDateParts(value: any, relativeTo?: any, options?: object)`

Convert two supported dates into relative date parts for use with
`Intl.RelativeTimeFormat` or custom UI rendering.

#### Parameters

- `value` `{any}` — The date value to compare.
- `relativeTo` `{any}` — The date value to compare against.
- `options` `{object}` — Per-call date helper options.
- `options.timeZone` `{string}` — The timezone used when anchoring plain dates and date-times.
- `options.inputFormat` `{string}` — The Day.js-style token format used when parsing non-ISO strings.

#### Example

```js
getRelativeDateParts("2026-06-22T10:00:00", "2026-06-22T10:01:00");
// { value: -1, unit: "minute" }
```

### `parseDate(value: any, options?: object)`

Convert `Date`, timestamp, Temporal, ISO/RFC 9557 string, configured
token-format string, or `{ year, month, day }` parts object into a
Temporal date value.

#### Parameters

- `value` `{any}` — The date value to parse.
- `options` `{object}` — Per-call date helper options.
- `options.inputFormat` `{string}` — The Day.js-style token format used when parsing non-ISO strings.

Token strings use Day.js-style tokens such as `DD/MM/YYYY`. Invalid or empty
values return `null`. Parts objects are rejected (not clamped) when the
month or day is out of range, e.g. `{ year: 2026, month: 2, day: 30 }`.

#### Example

```js
parseDate("2026-06-22"); // Temporal.PlainDate
parseDate("2026-06-22T10:15:30Z"); // Temporal.Instant
parseDate("22/06/2026 10:15", { inputFormat: "DD/MM/YYYY HH:mm" }); // Temporal.PlainDateTime
parseDate({ year: 2026, month: 6, day: 22 }); // Temporal.PlainDate
```

### `toDateFromParts(parts: object)`

Convert `<input type="date">`-style three-field parts into a
`Temporal.PlainDate`. Parts carry no timezone information, so the result is
always a plain date; anchor it with `toEpochMilliseconds`/`formatDate` when
an instant is needed.

#### Parameters

- `parts` `{object}` — The date parts to convert.
- `parts.year` `{number}` — The year.
- `parts.month` `{number}` — The month, `1`-indexed.
- `parts.day` `{number}` — The day of the month.

Only a `{ year, month, day }` plain object is accepted; strings,
timestamps, `Date` instances, and Temporal values are rejected. Missing,
non-numeric, or out-of-range parts also return `null`.

#### Example

```js
toDateFromParts({ year: 2026, month: 6, day: 22 }); // Temporal.PlainDate
toDateFromParts({ year: 2026, month: 2, day: 30 }); // null
```

### `toEpochMilliseconds(value: any, options?: object)`

Convert a supported date input into epoch milliseconds. Plain dates and
plain date-times use the configured timezone.

#### Parameters

- `value` `{any}` — The date value to convert.
- `options` `{object}` — Per-call date helper options.
- `options.timeZone` `{string}` — The timezone used when anchoring plain dates and date-times.
- `options.inputFormat` `{string}` — The Day.js-style token format used when parsing non-ISO strings.

#### Example

```js
toEpochMilliseconds("22/06/2026");
toEpochMilliseconds("06/22/2026", { inputFormat: "MM/DD/YYYY", timeZone: "America/New_York" });
```

## Form

### `validateField(fieldName: string, validationRules: object[], formData: object): Promise<ValidationResult>`

Validate a field given its `fieldName`, the field's `validationRules`, and the sum total `formData`.

#### Parameters

- `fieldName` `{string}` — The name of the field to validate.
- `validationRules` `{object[]}` — The rules, schemas, or validation functions to apply.
- `formData` `{object}` — The current values of each form field.

Returns `{ valid, errors, validated }`. If input is invalid (missing field name, rules, or form data), `validated` is false and the field is treated as valid.

Available rules and properties include:

#### `required`

`[{ rule: "required", message: "Enter your name so we know what to call you" }]`

Requires a value to be set.

#### `email`

`[{ rule: "email", message: "We need an email address to set up your account" }]`

Perform a minimal check to see if the value contains an `@` symbol. More complex verification isn't really necessary, and the only true way to test an email address is through verification.

#### `size`

`[{ rule: "size", size: 11, message: "Your phone number should be 11 digits long" }]`

Ensure that the provided value is has at least size `size`. For strings, the number of characters is used, for arrays, the length of the array, for objects, the number of properties, for numbers, the number itself is used, and for numeric strings the integer value of the string is used.

#### `min`

`[{ rule: "min", min: 11, message: "Your phone number should be at least 11 digits long" }]`

Ensure that the provided value is has at least size `min`. Values are evaluated as in the `size` rule.

#### `max`

`[{ rule: "max", max: 11, message: "Your phone number should be no more than 11 digits long" }]`

Ensure that the provided value is has at most size `max`. Values are evaluated as in the `size` rule.

#### `between`

`[{ rule: "between", min: 5, max: 8, message: "Your post code should be between 5 and 8 characters" }]`

Ensure that the provided value is has between `min` and `max` size. Values are evaluated as in the `size` rule.

#### `in`

`[{ rule: "in", options: ["a", "b", "c"], message: "Your choice should be a, b, or c" }]`

Ensure that the given value is included within `options`.

#### `not_in`

`[{ rule: "not_in", options: ["a", "b", "c"], message: "Your choice should not include a, b, or c" }]`

Ensure that the given value is not included within `options`.

#### `regexp`

`[{ rule: "regexp", regexp: /[abc]+/, message: "Your ID should only contain the letters a, b, and c" }]`

Ensure that the provided value matches `regexp`.

#### `custom`

`[{ rule: "custom", validate: (value, formData) => value > formData.startDate, message: "Your end date should be after your start date" }]`

The escape hatch for any rule the declarative rules can't express, including cross-field validation. `validate` receives the field's own `value` and the complete `formData`, and should return a truthy value to pass. A `custom` rule without a `validate` function always fails.

#### Standard Schema

Any object with a `~standard` property (Zod, Valibot, ArkType schemas) is detected and validated through the [Standard Schema](https://github.com/standard-schema/standard-schema) interface. The schema's `~standard.validate(value)` is called, and any returned issues are mapped to error strings. Schemas can return results synchronously or asynchronously.

```js
import { z } from "zod";
const schema = z.string().email("Enter a valid email address");
validateField("email", [schema], { email: "not-an-email" });
// { valid: false, errors: ["Enter a valid email address"], validated: true }
```

Schemas, object rules, and function shorthand can be freely mixed in the same rules array.

#### Function shorthand

`[(value, formData) => value.includes("@") || "Enter a valid email address"]`

A bare function in the rules array is a shorthand for `custom` validation without a separate `message` property. The function receives the field's own `value` and the complete `formData`, and its return value determines the outcome:

| Return value | Result |
| --- | --- |
| Non-empty string | Single error — the string is the error message |
| Non-empty array of non-empty strings | Multiple errors — each string is a separate error message |
| Any other value | Valid — no error |

This mirrors the `custom` rule's `(value, formData)` signature, but inverts the convention: instead of returning a boolean and reading the message from the rule object, the function returns the error message(s) directly when validation fails. Functions and object rules can be freely mixed in the same rules array.

#### `required_if`

`[{ rule: "required_if", field: "wantsNewsletter", value: true, message: "Enter an email address to receive the newsletter" }]`

Requires a value to be set, but only when another field's value meets a condition. When `value` is provided, the condition is met when `formData[field]` strictly equals it. When `value` is omitted, the condition is met when `formData[field]` has a value.

#### `same`

`[{ rule: "same", field: "password", message: "Your passwords should match" }]`

Ensure that the value matches the value of another field.

#### `different`

`[{ rule: "different", field: "currentPassword", message: "Your new password should differ from your current one" }]`

Ensure that the value differs from the value of another field.

#### Example

```js
await validateField("username", [{ rule: "required", message: "Enter a username" }], { username: "" }); // { valid: false, errors: ["Enter a username"], validated: true }
await validateField("username", [{ rule: "required", message: "Enter a username" }], {
	username: "jack_skellington",
}); // { valid: true, errors: [], validated: true }
await validateField("email", [
	{ rule: "required", message: "Enter your email" },
	(value) => value.includes("@") || "Enter a valid email address",
], { email: "not-an-email" }); // { valid: false, errors: ["Enter a valid email address"], validated: true }
```

### `validateForm(fields: object, formData: object): Promise<{ valid, validated, results }>`

Validate multiple fields at once, delegating to `validateField` for each
field's rules. Cross-field rules (`same`, `different`, `required_if`,
`custom`) work naturally because the full `formData` is passed through to
each field.

#### Parameters

- `fields` `{object}` — A map of field names to validation rule arrays.
- `formData` `{object}` — The current values of each form field.

Returns `{ valid, validated, results }`. If input is invalid (non-object
`fields` or `formData`), `validated` is `false` and the form is treated as
valid — the same convention as `validateField`.

`results` contains a `validateField` result for each field that had a
non-empty rules array. Fields with empty or non-array rules are skipped and
omitted from `results`. The overall `valid` is `false` only when a field has
`valid: false`. Fields with `validated: false` (skipped) don't make the form
invalid.

#### Example

```js
await validateForm({
	username: [{ rule: "required", message: "Enter a username" }],
	email: [
		{ rule: "required", message: "Enter your email" },
		(value) => value.includes("@") || "Enter a valid email address",
	],
}, { username: "jack", email: "not-an-email" });
// {
//   valid: false,
//   validated: true,
//   results: {
//     username: { valid: true, errors: [], validated: true },
//     email: { valid: false, errors: ["Enter a valid email address"], validated: true },
//   },
// }
```

## General

### `debounce(fn: function, delay?: number, options?: object)`

Returns a debounced version of `fn` that waits until `delay` milliseconds
have passed without another call before running.

#### Parameters

- `fn` `{function}` — The function to debounce.
- `delay` `{number}` — The delay in milliseconds before running the function.
- `options` `{object}` — Options controlling when the function runs.
- `options.leading` `{boolean}` — Whether to run on the first call in a debounce window.
- `options.trailing` `{boolean}` — Whether to run after calls stop.

By default `fn` runs on the trailing edge, after calls stop, using the most
recent call's arguments and `this`. Set `options.leading` to also run on the
first call, or `options.trailing: false` to skip the trailing run; with both
`false` it never runs.

The returned function exposes `.cancel()` to discard a pending run and
`.flush()` to run it immediately and return its result. A non-function `fn`
returns a safe no-op, and an invalid `delay` is treated as `0`.

#### Example

```js
const save = debounce(saveForm, 1000, { leading: true });
```

### `getFriendlyDisplay(variable: any)`

Convert a given `variable` into a human-readable representation of its type.

#### Parameters

- `variable` `{any}` — The value to describe.

#### Example

```js
getFriendlyDisplay(["A", "B", "C", "D"]); // <array[4]>
getFriendlyDisplay([]); // <array[0]>
getFriendlyDisplay("hello"); // hello <string>
```

### `isDefined(value: any)`

Determines whether the given `value` is neither `null` nor `undefined`. Unlike a falsy check, this guard treats `0`, `""`, and `false` as defined values.

#### Parameters

- `value` `{any}` — The value to check.

#### Example

```js
isDefined("hello"); // true
isDefined(0); // true
isDefined(null); // false
isDefined(undefined); // false
```

### `isEqual(a: unknown, b: unknown)`

Determine whether `a` and `b` are deeply equal. Primitives are compared with SameValueZero
semantics, so `NaN` is equal to `NaN`, and `null`/`undefined` are not equal to each other.
Arrays are equal when they share the same length and every element is deeply equal in order.
Plain objects are equal when they share the same set of own-enumerable keys and every value is
deeply equal, regardless of key order. Anything else, including a type mismatch between the two
values, or non-plain objects such as `Date`, `Map`, `Set`, or class instances, is not equal
unless the two values are the same reference.

#### Parameters

- `a` `{unknown}` — The first value to compare.
- `b` `{unknown}` — The second value to compare.

#### Example

```js
isEqual(NaN, NaN); // true
isEqual(null, undefined); // false
isEqual([1, { property: "value" }], [1, { property: "value" }]); // true
isEqual({ a: 1, b: 2 }, { b: 2, a: 1 }); // true
```

### `isFunction(variable: any)`

Determines whether the given `variable` is a function.

#### Parameters

- `variable` `{any}` — The value to check.

#### Example

```js
isFunction(() => "Hello"); // true
isFunction("function"); // false
isFunction(5); // false
```

### `resolveOrFallback(promise: any, fallback: any | (() => any))`

Resolves `promise`, returning its value, or `fallback` if it rejects. Always
returns a promise, even for synchronous inputs, for a consistent shape.

#### Parameters

- `promise` `{any}` — The promise or value to resolve.
- `fallback` `{any | function}` — The fallback value, or function returning one, to use when resolution fails.

This is async/value recovery, not validation — see `validateOrFallback` for
keyword-based value checks.

If `fallback` is a function it is called lazily, only on rejection, and its
return value is used. A throwing fallback function propagates. Non-thenable
inputs resolve as-is, except `null` / `undefined`, which resolve to the
fallback.

#### Example

```js
await resolveOrFallback(api.getSettings(), defaultSettings);
await resolveOrFallback(fetchRemote(), () => getCached());
```

### `settle(promises: any[])`

Awaits an array of promises (or plain values) and reports every outcome,
mirroring `Promise.allSettled`. Returns a positional `results` array
alongside convenience `values` and `errors` arrays for common bulk-action
patterns.

#### Parameters

- `promises` `{any[]}` — The promises or values to settle.

Non-thenable values are treated as fulfilled and returned as-is — functions
are never invoked. To run functions, call them first: `settle(items.map(item
=> action(item)))`.

`results` includes every item in order, and each entry carries its original
`index`, so a failure can be mapped straight back to its input — useful for
bulk operations where you need to know exactly which calls failed. `values`
and `errors` exclude the other outcome's gaps, for the common "everything
that worked / failed" patterns.

#### Example

```js
await settle([Promise.resolve(1), Promise.reject("nope")]);
// {
//   values: [1],
//   errors: ["nope"],
//   results: [
//     { status: "fulfilled", value: 1, index: 0 },
//     { status: "rejected", reason: "nope", index: 1 },
//   ],
// }
```

### `size(variable: any)`

Determine the size of the given `variable`. For strings, the number of characters is used; for numbers, the value itself; for arrays, the length; for objects, the number of top-level properties. Returns `0` if no reasonable size can be determined.

#### Parameters

- `variable` `{any}` — The value to measure.

#### Example

```js
size("hello"); // 5
size(42); // 42
size([1, 2, 3]); // 3
size({ a: 1, b: 2 }); // 2
size(null); // 0
```

### `throttle(fn: function, delay?: number, options?: object)`

Returns a throttled version of `fn` that runs at most once per `delay`
milliseconds.

#### Parameters

- `fn` `{function}` — The function to throttle.
- `delay` `{number}` — The minimum delay in milliseconds between function runs.
- `options` `{object}` — Options controlling when the function runs.
- `options.leading` `{boolean}` — Whether to run at the start of a throttle window.
- `options.trailing` `{boolean}` — Whether to run at the end of a throttle window.

By default `fn` runs immediately on the first call, then once more at the end
of the window if further calls arrived during it, using the latest arguments
and `this`. Set `options.leading: false` to skip the immediate run, or
`options.trailing: false` to skip the closing one; with both `false` it never
runs.

The returned function exposes `.cancel()` to discard a pending run and
`.flush()` to run it immediately and return its result. A non-function `fn`
returns a safe no-op, and an invalid `delay` is treated as `0`.

#### Example

```js
const save = throttle(saveForm, 500, { leading: false });
```

### `validateOrFallback(value: any, comparison: function | string, fallback: any)`

Apply `comparison` to the provided `value`, returning `value` if `true`, and `fallback` if not.

#### Parameters

- `variable` `{any}` — The value to validate.
- `comparison` `{function | string}` — The validation function or keyword to apply.
- `fallback` `{any}` — The value to return when validation fails.

`comparison` can be a function, or one of the keywords:

- `string`: A string, including an empty string
- `boolean`: Strictly true or false
- `number`: A number, excluding NaN, based on `isNumber`
- `function`: A function, based on `isFunction`
- `array`: An array, including an empty array
- `object`: An object, including an empty object

#### Example

```js
validateOrFallback("value", "string", "fallback"); // "value"
validateOrFallback({}, isNonEmptyObject, null); // null
validateOrFallback(5, "number", 0); // 5
```

## Number

### `clamp(number: number, minimum: number, maximum: number)`

Ensure that the provided `number` is between `minimum` and `maximum` (inclusive). If `number` is lower than `minimum`, `minimum` is returned. If `number` is higher than maximum, `maximum` is returned.

#### Parameters

- `number` `{number}` — The number to clamp.
- `minimum` `{number}` — The lowest allowed value.
- `maximum` `{number}` — The highest allowed value.

If `number` is not a number, `minimum` is returned.

#### Example

```js
clamp(4); // 4
clamp(10, 0, 5); // 5
clamp(-15, 0, 5); // 0
clamp(NaN); // 0
```

### `isNumber(variable: any)`

Determines whether the given `variable` is a number and not NaN.

#### Parameters

- `variable` `{any}` — The value to check.

#### Example

```js
isNumber(4); // true
isNumber(NaN); // false
isNumber("string"); // false
```

### `isNumeric(variable: any)`

Determines whether the given `variable` is a number, or a string containing a number.

#### Parameters

- `variable` `{any}` — The value to check.

#### Example

```js
isNumeric(4); // true
isNumeric(NaN); // false
isNumeric("string"); // false
isNumeric("10e3"); // true
isNumeric("5.6"); // true
```

### `round(number: number, precision: number = 0)`

Rounds the given `number` to the specified `precision`. If `precision` is not provided, it defaults to 0.

#### Parameters

- `number` `{number}` — The number to round.
- `precision` `{number}` — The number of decimal places to keep.

#### Example

```js
round(4.567); // 5
round(4.567, 2); // 4.57
round(4.567, 0); // 5
round(4.567, -1); // 0
```

### `toNullableNumber(value: any)`

Coerces the given `value` to a number, returning `null` for empty string, `null`, or `undefined`. Useful for form round-trips where absent numeric fields should be `null` rather than `0` or `NaN`.

#### Parameters

- `value` `{any}` — The value to coerce.

#### Example

```js
toNullableNumber("42"); // 42
toNullableNumber(""); // null
toNullableNumber(null); // null
toNullableNumber(undefined); // null
```

### `toPercentage(value: any, total: any)`

Calculates the percentage of `value` relative to `total`, returning `0` when
`total` is zero or falsy to avoid division by zero. Non-numeric inputs are
coerced; `NaN` or `Infinity` inputs return `0`. The result is not clamped, so
a `value` exceeding `total` will produce a percentage above 100.

#### Parameters

- `value` `{any}` — The value to convert to a percentage.
- `total` `{any}` — The total value that represents 100%.

#### Example

```js
toPercentage(25, 100); // 25
toPercentage(1, 4); // 25
toPercentage(10, 0); // 0
toPercentage(10, null); // 0
```

## Object

### `addProperty(object: object, key: string, value: any)`

Add a shallow key / value pair to an object without overwriting any existing value.
That is, only if that key isn't already present, or if its value is undefined
or null.

#### Parameters

- `object` `{object}` — The object to add the property to.
- `key` `{string}` — The property key to add.
- `value` `{any}` — The value to set when the key is missing or empty.

#### Example

```js
addProperty({ one: "One", two: "Two" }, "one", "Two"); // { one: "One", two: "Two" }
addProperty({ one: "One", two: "Two" }, "three", "Three"); // { one: "One", two: "Two", three: "Three" }
addProperty({ one: "One", two: null }, "two", "Two"); // { one: "One", two: "Two" }
```

### `deepCopy(value: any)`

Returns a deep copy of `value`. Non-objects are returned unchanged.

#### Parameters

- `value` `{any}` — The value to copy.

Uses the built-in `structuredClone` where possible, so `Date`, `Map`, `Set`,
`RegExp`, typed arrays, and cyclic references are cloned correctly. For
values `structuredClone` cannot handle, such as objects containing functions,
it falls back to a recursive copy that copies functions by reference and
preserves cyclic references via a `WeakMap`.

#### Example

```js
deepCopy({ key: "value" }); // { key: "value" }
deepCopy(["a", "b"]); // ["a", "b"]
deepCopy(new Date(0)); // a new Date with the same time
```

### `deepMerge(object: object)`

Recursively merges two or more objects. The values of later objects override those of earlier objects.

#### Parameters

- `target` `{object}` — The object to merge into.
- `sources` `{object[]}` — The source objects to merge from.

#### Example

```js
deepMerge({ key: "value" }, { value: "key" }); // { key: "value", value: "key" }
deepMerge({ key: "value", a: { b: 2 } }, { key: "modified", a: { c: 3 } }); // { key: "modified", a { b: 2, c: 3 }}
```

### `deepMergeWith(target: object, sources: array, options?: object)`

Works like `deepMerge`, but lets you decide what happens when the same key
holds an array in both the target and a source.

#### Parameters

- `target` `{object}` — The object to merge into.
- `sources` `{object[]}` — The source objects to merge from.
- `options` `{object}` — Merge behaviour.
- `options.arrayStrategy` `{string}` — How arrays are combined when both objects contain arrays at the same key.

Pick the behaviour with `options.arrayStrategy`:

- `"replace"` (default): the source array wins, just like `deepMerge`.
- `"concatenate"`: the two arrays are joined together, target items first.
- `"merge"`: the arrays are combined item by item, deep-merging the ones that
line up.

Everything else matches `deepMerge` — objects merge recursively, class
instances stay intact, and your inputs are never changed. The only difference
is that you pass the sources as a single array (instead of one after
another), which keeps `options` neatly at the end.

#### Example

```js
deepMergeWith({ a: { b: 1 } }, [{ a: { c: 2 } }]);
// { a: { b: 1, c: 2 } }
```

### `firstDefinedPath(object: object, paths: string[])`

Try each dot-notation `path` in turn, returning the first defined value
found. Values that are `null` or `undefined` are skipped, so a path that
exists but holds `null` does not short-circuit the search. Returns
`undefined` when no path yields a defined value, or when the input is not
a non-empty object with a non-empty `paths` array.

#### Parameters

- `object` `{object}` — The object to inspect.
- `paths` `{string[]}` — The dot-notation paths to try.

#### Example

```js
firstDefinedPath({ a: 1, b: 2 }, ["a"]); // 1
firstDefinedPath({ a: 1, b: 2 }, ["c", "a"]); // 1
firstDefinedPath({ a: null, b: 2 }, ["a", "b"]); // 2
firstDefinedPath({ a: { b: { c: "deep" } } }, ["a.b.c"]); // "deep"
firstDefinedPath({ a: 1 }, ["c", "d"]); // undefined
firstDefinedPath([], ["a"]); // undefined
```

### `flattenObject(object: object)`

Flattens a nested object into a single-level object with dot-notation keys.

#### Parameters

- `object` `{object}` — The object to flatten.

Arrays are preserved as leaf values — they are not flattened into indexed
keys (e.g. `"items.0"`).

Only own enumerable properties are included.

#### Example

```js
flattenObject({ a: { b: 1, c: 2 }, d: 3 });
// { "a.b": 1, "a.c": 2, "d": 3 }

flattenObject({ items: [1, 2, 3] });
// { "items": [1, 2, 3] }
```

### `getPathValue(object: object, path: string, returnValue: any = undefined)`

Retrieve the `object` property value found at `path`, or `returnValue`.

#### Parameters

- `object` `{object}` — The object to inspect.
- `path` `{string}` — The dot-notation path to retrieve.
- `returnValue` `{any}` — The fallback value when the path cannot be resolved.

#### Example

```js
getPathValue({ property: "value" }, "property"); // "value"
getPathValue({ property: "value" }, "another"); // undefined
getPathValue({ nested: { property: { value: "seven" } } }, "nested.property.value"); // "seven"
getPathValue({ nested: { property: { value: "seven" } } }, "nested.mistake.value", null); // null
getPathValue([], "property"); // undefined
```

### `hasAnyPath(object: object, paths: string[])`

Determine if the given object has any of the properties at `paths`.

#### Parameters

- `object` `{object}` — The object to inspect.
- `paths` `{string[]}` — The dot-notation paths to check.

#### Example

```js
hasAnyPath({ a: { b: { c: 1 } } }, ["a.b.c"]); // true
hasAnyPath({ a: { b: { c: 1 } } }, ["a.b.d", "a.b.c"]); // true
hasAnyPath({ a: { b: { c: 1 } } }, ["a.b.d"]); // false
hasAnyPath({ a: { b: { c: 1 } } }, ["a.b.e", "a.b.f"]); // false
```

### `isNonEmptyObject(variable: any)`

Determines whether the given `variable` is both an object (and not null, or an array), and has at least one property.

#### Parameters

- `variable` `{any}` — The value to check.

#### Example

```js
isNonEmptyObject({ property: "value" }); // true
isNonEmptyObject({}); // false
isNonEmptyObject("string"); // false
```

### `isObject(variable: any)`

Determine whether the given `variable` is an object, excluding arrays and null.

#### Parameters

- `variable` `{any}` — The value to check.

#### Example

```js
isObject({ property: "value" }); // true
isObject(["A", "B", "C", "D"]); // false
isObject(null); // false
```

### `isPlainObject(variable: any)`

Determine whether the given `variable` is a plain object literal, excluding arrays, `null`,
and non-plain objects such as `Date`, `Map`, `Set`, or class instances.

#### Parameters

- `variable` `{any}` — The value to check.

#### Example

```js
isPlainObject({ property: "value" }); // true
isPlainObject(["A", "B", "C", "D"]); // false
isPlainObject(new Date()); // false
isPlainObject(null); // false
```

### `keyBy(array: object[], key: string)`

Convert the given `array` of objects into a single object, where each object in the original array is placed under the value of its given `key`.

#### Parameters

- `array` `{object[]}` — The objects to index.
- `key` `{string}` — The property whose value becomes each output key.

Objects without the given `key` are discarded. If an object has the same value `key` as a previous object, the previous object will be overwritten.

#### Example

```js
keyBy([{ a: 1 }, { a: 2 }], "a"); // { 1: { a: 1 }, 2: { a: 2 } }
```

### `keys(object: object)`

Returns an array of the keys of the given `object`.

#### Parameters

- `object` `{object}` — The object to read keys from.

#### Example

```js
keys({ a: 1, b: 2, c: 3 }); // ["a", "b", "c"]
keys({}); // []
keys("string"); // []
```

### `mapArrayProperty(object: object, property: string, mapper: Function)`

Returns a shallow copy of `object` with the array at `property` replaced by
the result of calling `mapper` over it. If `object[property]` is not a
non-empty array, `property` resolves to `[]` in the result rather than
being omitted.

#### Parameters

- `object` `{object}` — The object to read the array from.
- `property` `{string}` — The property holding the array to map.
- `mapper` `{Function}` — The mapper function, forwarded as-is to `Array.prototype.map`.

#### Example

```js
mapArrayProperty({ items: [1, 2, 3] }, "items", (item) => item * 2);
// { items: [2, 4, 6] }

mapArrayProperty({ total: 0 }, "items", (item) => item);
// { total: 0, items: [] }
```

### `objectContains(object: object, needle: any, { exclude: string[] = null, include: string[] = null, caseInsensitive: boolean = true, allowPartial: boolean = false })`

Returns true if one of the `object`'s values is `needle`. Also works when `object` is an array.

#### Parameters

- `object` `{object}` — The object or array to search.
- `needle` `{any}` — The value to find.
- `options.exclude` `{string[]}` — The object keys to omit from the search.
- `options.include` `{string[]}` — The only object keys to search.
- `options.caseInsensitive` `{boolean}` — Whether string comparisons ignore case.
- `options.allowPartial` `{boolean}` — Whether string comparisons allow partial matches.

String `needle`s are checked case-insensitively by default, and partial matches can be enabled via option.

#### Example

```js
objectContains({ name: "Merida" }, "merida"); // true
objectContains({ name: "Moana" }, "merida"); // false
objectContains({ name: "Mulan" }, "mulan", { caseInsensitive: false }); // false
objectContains({ name: { first: "Tiana" } }, "tia"); // false
objectContains({ name: { first: "Tiana" } }, "tia", { allowPartial: true }); // true
objectContains({ names: ["Ariel", "Jasmine"] }, "ariel"); // true
objectContains({ length: 52 }, 5); // false
```

### `objectLength(object: object)`

Return the number of top-level keys in `object`. Returns `0` for empty or non-objects.

#### Parameters

- `object` `{object}` — The object to count keys on.

#### Example

```js
objectLength({ a: 1, b: 2 }); // 2
objectLength({}); // 0
objectLength("string"); // 0
```

### `omit(object: object, properties: string[])`

Returns a new object with the specified `properties` omitted from the given `object`.

#### Parameters

- `object` `{object}` — The object to copy from.
- `properties` `{string[]}` — The property keys to omit.

#### Example

```js
omit({ a: 1, b: 2, c: 3 }, ["b"]); // { a: 1, c: 3 }
omit({ a: 1, b: 2, c: 3 }, ["a", "c"]); // { b: 2 }
omit({ a: 1, b: 2, c: 3 }, []); // { a: 1, b: 2, c: 3 }
```

### `pick(object: object, properties: string[])`

Returns an object containing only `properties` properties from `object`.

#### Parameters

- `object` `{object}` — The object to copy from.
- `properties` `{string[]}` — The property keys to keep.

Any non-string properties are ignored.

If the object does not have a given property, it is ignored.

#### Example

```js
pick({ a: "one", b: "two", c: "three" }, ["a", "b"]); // { a: "one", b: "two" }
pick({ a: "one", b: "two", c: "three" }, ["a"]); // { a: "one" }
pick({ a: "one", b: "two", c: "three" }, ["a", "d"]); // { a: "one" }
```

### `pickAs(object: object, mapping: object)`

Returns a new object with keys from `mapping` whose values are resolved from
`object` at the paths given by the mapping values.

#### Parameters

- `object` `{object}` — The object to read values from.
- `mapping` `{object}` — The output keys and source paths to use.

Uses `getPathValue` so dot-notation paths are supported.

Missing source paths resolve as `undefined` — the key is always included in
the result.

#### Example

```js
pickAs({ id: 1, location: { name: "London" } }, { id: "id", locationName: "location.name" });
// { id: 1, locationName: "London" }

pickAs({ a: 1 }, { a: "a", b: "missing" });
// { a: 1, b: undefined }
```

### `pluckPathValues(array: object[], path: string)`

Retrieve an array of the `path` value from each of the objects found in `array`.

#### Parameters

- `array` `{object[]}` — The objects to read from.
- `path` `{string}` — The dot-notation path to retrieve from each object.

Any non-objects in `array` are ignored. Objects that don't have the given path yield `undefined` in the result. Empty or invalid input returns `[]`.

#### Example

```js
pluckPathValues([{ user: { name: "Sophie" } }, { user: { name: "Hannah" } }], "user.name"); // ["Sophie", "Hannah"]
pluckPathValues([{ user: { name: "Sophie" } }, { user: {} }], "user.name"); // ["Sophie", undefined]
pluckPathValues([{ user: { name: "Sophie" } }, "not an object"], "user.name"); // ["Sophie"]
pluckPathValues([], "user.name"); // []
```

### `removePathValue(object: object, path: string)`

Remove an object property at `path`. This method makes a copy of the provided object to not modify the original.

#### Parameters

- `object` `{object}` — The object to remove the value from.
- `path` `{string}` — The dot-notation path to remove.

#### Example

```js
removePathValue({ key: "value" }, "key"); // {}
removePathValue({ key: "value" }, "another"); // { key: "value" }
removePathValue({ key: "value", one: { two: { three: "three" } } }, "one.two.three"); // { key: "value", one: { two: {} } }
removePathValue({ key: "value", one: { two: "two" } }, "one.two.three"); // { key: "value", one: { two: "two" } }
```

### `renameProperties(object: object, mapping: object)`

Returns a new object with keys renamed according to the given `mapping`, a
plain object of `{ oldKey: newKey }` pairs. The original object is not
mutated. Renaming is shallow only — nested objects are not deep-renamed.

#### Parameters

- `object` `{object}` — The object to rename keys on.
- `mapping` `{object}` — The existing keys and replacement keys to use.

Use `pickAs` instead when you want to project or whitelist keys into a new
shape; `renameProperties` renames keys in place while keeping all other keys.

#### Example

```js
renameProperties({ a: 1, b: 2 }, { a: "alpha" });
// { alpha: 1, b: 2 }

renameProperties({ a: 1, b: 2 }, { a: "alpha", b: "beta" });
// { alpha: 1, beta: 2 }
```

### `setPathValue(object: object, path: string, value: any)`

Set an object property at `path`.

#### Parameters

- `object` `{object}` — The object to update.
- `path` `{string}` — The dot-notation path to set.
- `value` `{any}` — The value to write at the path.

If any part of the path dot notation chain results in a non-object, no modifications are made.

Objects will be created as necessary to reach the path specified.

This method returns a copy of the object so as to not modify the original.

#### Example

```js
setPathValue({ a: 1 }, "b", 2); // { a: 1, b: 2 }
setPathValue({ a: 1 }, "b.c.d", 2); // { a: 1, b: { c: { d: 2 } } }
setPathValue({ a: 1, b: 2 }, "b.c.d", 4); // { a: 1, b: 2 }
```

### `unwrap(object: object)`

Safely unwrap a single-key object, returning the value of that key. `null` is returned if the object contains more than one key, or the value cannot be retrieved.

#### Parameters

- `object` `{object}` — The object to unwrap.

#### Example

```js
unwrap({ key: "value" }); // "value"
unwrap(null); // null
unwrap({ key_one: "value", key_two: "value two" }); // null
```

### `values(object: object)`

Returns an array of the values of the given `object`.

#### Parameters

- `object` `{object}` — The object to read values from.

#### Example

```js
values({ a: 1, b: 2, c: 3 }); // [1, 2, 3]
values({}); // []
values("string"); // []
```

## String

### `capitalise(value: any)`

Returns the string with the first character uppercased and the remaining
characters unchanged. Handles surrogate pairs correctly by iterating code
points rather than UTF-16 code units. Returns an empty string if the provided
`value` is not a non-empty string.

#### Parameters

- `value` `{any}` — The value to capitalise.

#### Example

```js
capitalise("hello world"); // "Hello world"
capitalise("HELLO"); // "HELLO"
capitalise("a"); // "A"
capitalise(""); // ""
capitalise(42); // ""
capitalise("über"); // "Über"
capitalise("αβγ"); // "Αβγ"
```

### `isNonEmptyString(variable: any, { trim: boolean = false })`

Determines whether the given `variable` is both a string and has at least one character. If `trim` is true, the string is trimmed of whitespace before the test is performed.

#### Parameters

- `variable` `{any}` — The value to check.
- `options.trim` `{boolean}` — Whether to trim whitespace before checking length.

#### Example

```js
isNonEmptyString("string"); // true
isNonEmptyString(""); // false
isNonEmptyString(["A", "B"]); // false
isNonEmptyString("  "); // true
isNonEmptyString("  ", { trim: true }); // false
```

### `ltrim(string: string, pattern: string | RegExp = "\\s")`

Trim the left hand side of `string` using the provided string or RegExp `pattern`. Trims whitespace by default.

#### Parameters

- `string` `{string}` — The string to trim.
- `pattern` `{string | RegExp}` — The pattern to trim from the left hand side.

#### Example

```js
ltrim("***string***", "*"); // **string***
ltrim("***string***", new RegExp("\\*")); // **string***
ltrim("***string***", new RegExp("\\*+")); // string***
```

### `rtrim(string: string, pattern: string | RegExp = "\\s")`

Trim the right hand side of `string` using the provided string or RegExp `pattern`. Trims whitespace by default.

#### Parameters

- `string` `{string}` — The string to trim.
- `pattern` `{string | RegExp}` — The pattern to trim from the right hand side.

#### Example

```js
rtrim("***string***", "*"); // ***string**
rtrim("***string***", new RegExp("\\*")); // ***string**
rtrim("***string***", new RegExp("\\*+")); // ***string
```

### `StringManipulator`

`StringManipulator` can be used to chain string methods together safely. A new instance of the class is created, and then any of the string helper methods can be used in any sequence. If the input at any stage is invalid, an empty string is returned.

#### Parameters

- `value` `{any}` — The initial string value to wrap. Non-strings fall back to an empty string.

#### Example

```js
const userId = "82FAA75F-B47A-43B6-82F6-389C9408BB67";

const userIdPreview = new StringManipulator(userId).toLowerCase().truncate(15).value; // 82faa75f-b47a-…
```

### `toCamelCase(value: any)`

Converts a string to camelCase (first word lowercase, subsequent words
capitalised, no separators). Handles kebab-case, PascalCase, snake_case,
SCREAMING_SNAKE_CASE, and mixed separators. Acronyms are normalised
(APIKey → apiKey). Returns an empty string for non-string inputs.

#### Parameters

- `value` `{any}` — The value to convert to camelCase.

#### Example

```js
toCamelCase("kebab-case"); // "kebabCase"
toCamelCase("PascalCase"); // "pascalCase"
toCamelCase("APIKey"); // "apiKey"
toCamelCase("item2Name"); // "item2Name"
toCamelCase("snake_case"); // "snakeCase"
toCamelCase(""); // ""
toCamelCase(42); // ""
```

### `toKebabCase(value: any)`

Converts a string to kebab-case (lowercase words joined by hyphens).
Handles camelCase, PascalCase, snake_case, SCREAMING_SNAKE_CASE, and mixed
separators. Acronyms are split correctly (APIKey → api-key). Returns an
empty string for non-string inputs.

#### Parameters

- `value` `{any}` — The value to convert to kebab-case.

#### Example

```js
toKebabCase("camelCase"); // "camel-case"
toKebabCase("PascalCase"); // "pascal-case"
toKebabCase("APIKey"); // "api-key"
toKebabCase("item2Name"); // "item2-name"
toKebabCase("snake_case"); // "snake-case"
toKebabCase("already-kebab"); // "already-kebab"
toKebabCase(""); // ""
toKebabCase(42); // ""
```

### `toLowerCase(variable: string)`

A safe wrapper around `toLowerCase`, returning an empty string if the provided `variable` is not a string itself.

#### Parameters

- `variable` `{string}` — The string to lowercase.

#### Example

```js
toLowerCase("String"); // string
toLowerCase(""); // ""
toLowerCase(["A", "B"]); // ""
```

### `toNullableString(value: any)`

Coerces the given `value` to a string, returning an empty string for `null`
or `undefined`. Useful for form round-trips where absent string fields should
be `""` rather than `"null"` or `"undefined"`.

#### Parameters

- `value` `{any}` — The value to coerce to a string.

#### Example

```js
toNullableString("hello"); // "hello"
toNullableString(42); // "42"
toNullableString(null); // ""
toNullableString(undefined); // ""
```

### `toPascalCase(value: any)`

Converts a string to PascalCase (each word capitalised, no separators).
Handles camelCase, kebab-case, snake_case, SCREAMING_SNAKE_CASE, and mixed
separators. Acronyms are normalised (APIKey → ApiKey). Returns an empty
string for non-string inputs.

#### Parameters

- `value` `{any}` — The value to convert to PascalCase.

#### Example

```js
toPascalCase("camelCase"); // "CamelCase"
toPascalCase("kebab-case"); // "KebabCase"
toPascalCase("APIKey"); // "ApiKey"
toPascalCase("item2Name"); // "Item2Name"
toPascalCase("snake_case"); // "SnakeCase"
toPascalCase(""); // ""
toPascalCase(42); // ""
```

### `toScreamingSnakeCase(value: any)`

Converts a string to SCREAMING_SNAKE_CASE (uppercase words joined by
underscores). Handles camelCase, PascalCase, kebab-case, snake_case, and
mixed separators. Acronyms are split correctly (APIKey → API_KEY). Returns
an empty string for non-string inputs.

#### Parameters

- `value` `{any}` — The value to convert to SCREAMING_SNAKE_CASE.

#### Example

```js
toScreamingSnakeCase("camelCase"); // "CAMEL_CASE"
toScreamingSnakeCase("PascalCase"); // "PASCAL_CASE"
toScreamingSnakeCase("APIKey"); // "API_KEY"
toScreamingSnakeCase("item2Name"); // "ITEM2_NAME"
toScreamingSnakeCase("kebab-case"); // "KEBAB_CASE"
toScreamingSnakeCase(""); // ""
toScreamingSnakeCase(42); // ""
```

### `toSnakeCase(value: any)`

Converts a string to snake_case (lowercase words joined by underscores).
Handles camelCase, PascalCase, kebab-case, SCREAMING_SNAKE_CASE, and mixed
separators. Acronyms are split correctly (APIKey → api_key). Returns an
empty string for non-string inputs.

#### Parameters

- `value` `{any}` — The value to convert to snake_case.

#### Example

```js
toSnakeCase("camelCase"); // "camel_case"
toSnakeCase("PascalCase"); // "pascal_case"
toSnakeCase("APIKey"); // "api_key"
toSnakeCase("item2Name"); // "item2_name"
toSnakeCase("kebab-case"); // "kebab_case"
toSnakeCase(""); // ""
toSnakeCase(42); // ""
```

### `toUpperCase(variable: string)`

A safe wrapper around `toUpperCase`, returning an empty string if the provided `variable` is not a string itself.

#### Parameters

- `variable` `{string}` — The string to uppercase.

#### Example

```js
toUpperCase("string"); // "STRING"
toUpperCase(""); // ""
toUpperCase(["A", "B"]); // ""
```

### `trim(string, pattern: string | RegExp = "\\s")`

Trim both sides of `string` using the provided string or RegExp `pattern`. Trims whitespace by default.

#### Parameters

- `string` `{string}` — The string to trim.
- `pattern` `{string | RegExp}` — The pattern to trim from both sides.

#### Example

```js
trim("   string   "); // string
trim("* *string* *", "*"); // *string*
trim("***string***", new RegExp("\\*")); // **string**
trim("***string***", new RegExp("\\*+")); // string
```

### `truncate(string: string, length: number = 10, { decoration: string = "…", preserveWords: boolean = false, strict: boolean = true, includeDecoration: boolean = true, position: "start" | "end" | "middle" = "end" })`

Truncate a string to a given length, with various options for how the truncation occurs.

#### Parameters

- `string` `{string}` — The string to truncate.
- `length` `{number}` — The length to truncate the string to.
- `options.decoration` `{string}` — The decoration to append to the string if it is truncated.
- `options.includeDecoration` `{boolean}` — Whether to include the length of the decoration in length calculations.
- `options.preserveWords` `{boolean}` — Whether to avoid breaking a word during truncation.
- `options.strict` `{boolean}` — When preserving words, if strict the resulting length will be less than the desired length.
- `options.position` `{"start" | "end" | "middle"}` — Where to truncate: `"end"` (default), `"start"`, or `"middle"`.

If the provided variable is not a string, returns an empty string.

#### Example

```js
truncate("Hello, world!"); // "Hello, wo…"
truncate("Hello, world!", 15); // "Hello, world!"
truncate("Hello, world!", 8); // "Hello, …"
truncate("Hello, world!", 8, { preserveWords: true }); // "Hello,…"
truncate("Hello, world!", 8, { position: "start" }); // "…world!"
truncate("Hello, world!", 8, { position: "middle" }); // "Hell…ld!"
truncate("one two three four", 12, { position: "start", preserveWords: true }); // "…three four"
truncate("one two three four five", 15, { position: "middle", preserveWords: true }); // "one two…five"
truncate(["A", "B"]); // ""
```

## URL

### `getCurrentUrlParameter(parameter: string)`

Retrieve `parameter` from the current browser URL, returning `null` if the parameter is not present.

#### Parameters

- `parameter` `{string}` — The search parameter to retrieve.

#### Example

```js
// https://duckduckgo.com?page=2
getCurrentUrlParameter("page"); // 2
// https://duckduckgo.com?page=2
getCurrentUrlParameter("unknown"); // null
```

### `getSearchParameter(search: string | URLSearchParams, parameter: string)`

Retrieve `parameter` from a URL search string or `URLSearchParams` instance, returning `null` when the parameter is not present.

#### Parameters

- `search` `{string | URLSearchParams}` — The search string or URL search parameters to read from.
- `parameter` `{string}` — The search parameter to retrieve.

#### Example

```js
getSearchParameter("?page=2", "page"); // 2
getSearchParameter("?page=2", "unknown"); // null
```

### `removeCurrentUrlParameter(parameter: string)`

Remove `parameter` from the current browser URL if it exists.

#### Parameters

- `parameter` `{string}` — The search parameter to remove.

#### Example

```js
// https://duckduckgo.com?page=2
removeCurrentUrlParameter("unknown"); // https://duckduckgo.com?page=2
// https://duckduckgo.com?page=2
removeCurrentUrlParameter("page"); // https://duckduckgo.com
```

### `removeSearchParameter(search: string | URLSearchParams, parameter: string)`

Return a search string with `parameter` removed.

#### Parameters

- `search` `{string | URLSearchParams}` — The search string or URL search parameters to update.
- `parameter` `{string}` — The search parameter to remove.

#### Example

```js
removeSearchParameter("?page=2", "unknown"); // ?page=2
removeSearchParameter("?page=2", "page"); // ""
```

### `updateCurrentUrlParameter(parameter: string, value: string | null)`

Update the current browser URL to set `parameter` to `value`, adding `parameter` if it doesn't already exist, or overwriting any current value if it doesn't. If `value` is `null`, the parameter is removed.

#### Parameters

- `parameter` `{string}` — The search parameter to update.
- `value` `{string | null}` — The value to set, or `null` to remove the parameter.

#### Example

```js
// https://duckduckgo.com
updateCurrentUrlParameter("page", "2"); // https://duckduckgo.com?page=2
// https://duckduckgo.com?page=2
updateCurrentUrlParameter("page", "3"); // https://duckduckgo.com?page=3
// https://duckduckgo.com?page=3
updateCurrentUrlParameter("page", null); // https://duckduckgo.com
```

### `updateSearchParameter(search: string | URLSearchParams, parameter: string, value: string | null)`

Return a search string with `parameter` set to `value`. If `value` is `null`, the parameter is removed.

#### Parameters

- `search` `{string | URLSearchParams}` — The search string or URL search parameters to update.
- `parameter` `{string}` — The search parameter to update.
- `value` `{string | null}` — The value to set, or `null` to remove the parameter.

#### Example

```js
updateSearchParameter("", "page", "2"); // ?page=2
updateSearchParameter("?page=2", "page", "3"); // ?page=3
updateSearchParameter("?page=3", "page", null); // ""
```

## Vue

### `callComponentMethod(component, method: string, ...parameters: any)`

If the given `component` is an object and contains a function parameter `method`, call that method with any additional `parameters` and return its result. This helper allows safe calling of a method when an object might not exist.

#### Parameters

- `component` `{object}` — The component instance or component reference to call.
- `method` `{string}` — The method name to call.
- `params` `{any[]}` — Additional parameters to pass to the method.

#### Example

```js
// component = { method: () => "result" }
callComponentMethod(component, "method", "parameterOne"); // result
callComponentMethod(component, "undefinedMethod"); // undefined
callComponentMethod(null); // undefined
```

### `getSlotText(slotReference)`

Retrieve the text from the given `slotReference`. `slotReference` is a direct reference to a slot - for example `slots.default`. Text is concatenated when multiple children exist.

#### Parameters

- `slot` `{Function | object[]}` — The slot function or vnode array to read.
- `options` `{object}` — Options for reading slot text.
- `options.props` `{object}` — Props to pass when rendering a slot function.
- `options.trim` `{boolean}` — Whether to trim whitespace from the returned text.

#### Example

```js
// slots.default = () => [{ type: Text, children: "Text content" }]
getSlotText(slots.default); // "Text content"
// slots.default = () => [{ type: Text, children: [{ type: Text, children: "First text" }, { type: Text, children: "Second text" }] }]
getSlotText(slots.default); // "First textSecond text"
// slots.default = () => [{ type: Comment }]
getSlotText(slots.default); // ""
getSlotText("string"); // ""
```

### `isNonEmptySlot(slotReference)`

Determines whether the given `slotReference` contains content. `slotReference` is a direct reference to a slot - for example `slots.default`.

#### Parameters

- `slot` `{Function}` — The slot function to check.
- `props` `{object}` — Props to pass when rendering the slot function.

#### Example

```js
// slots.default = () => [{ type: Text, children: "Text content" }]
isNonEmptySlot(slots.default); // true
// slots.default = () => [{ type: Comment }]
isNonEmptySlot(slots.default); // false
isNonEmptySlot("string"); // false
```

<!-- helpers:end -->
