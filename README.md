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

If the provided input is not an array, returns `0`.

#### Example

```js
arrayLength(["A", "B", "C", "D"]); // 4
arrayLength([]); // 0
arrayLength(undefined); // 0
```

### `chunk(array: any[], chunkSize: number)`

Split an array into chunks of a specified size

#### Example

```js
chunk([1, 2, 3], 2); // [[1, 2], [3]]
chunk([1, 2, 3], 1); // [[1], [2], [3]]
chunk([1, 2, 3], 5); // [[1, 2, 3]]
```

### `compact(array: any[])`

Remove falsy values from the given array.

#### Example

```js
compact([0, 1, false, 2, "", 3]); // [1, 2, 3]
compact([true, true, true]); // [true, true, true]
```

### `ensureArray(variable: any)`

Ensure that the given variable is an array.

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

#### Example

```js
firstDefined(["a", "b"]); // "a"
firstDefined([undefined, undefined, "c", "d"]); // "c"
firstDefined([]); // undefined
```

### `getNextIndex(index: number, reference: any[], { reverse: boolean = false, wrap: boolean = false })`

Given a starting `index`, determine the next available index in the `reference` array.

- `reverse` - Reverse the direction, finding the previous index instead
- `wrap` - When reaching the end of the array, wrap to the start, and vice-versa

If the provided index is outside of the reference array, or the provided index or reference array are unexpected, a default value of `0` is returned.

#### Example

```js
getNextIndex(3, ["A", "B", "C", "D"]); // 3
getNextIndex(3, ["A", "B", "C", "D"], { wrap: true }); // 0
getNextIndex(3, ["A", "B", "C", "D"], { reverse: true }); // 2
```

### `head(array: any[])`

Returns the first element in `array`.

#### Example

```js
head(["a", "b"]); // "a"
head([]); // undefined
```

### `isNonEmptyArray(variable: any[])`

Determines whether the given `variable` is both an array and has at least one item.

#### Example

```js
isNonEmptyArray(["A", "B", "C", "D"]); // true
isNonEmptyArray([]); // false
isNonEmptyArray("string"); // false
```

### `lastDefined(array: any[])`

Returns the last non-undefined element in `array`.

#### Example

```js
lastDefined(["a", "b"]); // "b"
lastDefined(["a", "b", undefined, undefined]); // "b"
lastDefined([]); // undefined
```

### `pluck(array: any[], property: string)`

Retrieve an array of the `property` value from each of the objects found in `array`.

Any non-objects in `array` are ignored. Objects that don't have the given property yield `undefined` in the result. Empty or invalid input returns `[]`.

Note: `property` is a direct key only, and dot-path notation is not yet supported. Use `getPathValue` for nested access.

#### Example

```js
pluck([{ fruit: "apple" }, { fruit: "banana" }], "fruit"); // ["apple", "banana"]
pluck([{ fruit: "apple" }, { fruit: "banana" }], "colour"); // [undefined, undefined]
pluck([{ fruit: "apple" }, "not an object"], "fruit"); // ["apple"]
pluck([], "property"); // []
```

### `sortByProperty(array: any[], property: string, { ascending: boolean: true })`

Returns a new array containing the `array` of objects, sorted by the value at `property`, with optional direction.

#### Example

```js
sortByProperty([{ name: "Lewis" }, { name: "Alice" }], "name"); // [{ name: "Alice" }, { name: "Lewis" }]
sortByProperty([{ name: "Lewis" }, { name: "Alice" }], "age"); // [{ name: "Lewis" }, { name: "Alice" }]
sortByProperty([{ name: "Lewis" }, { name: "Alice" }], "name", { ascending: false }); // [{ name: "Lewis" }, { name: "Alice" }]
```

### `tail(array: any[])`

Returns the last element in `array`.

#### Example

```js
tail(["a", "b"]); // "b"
tail([]); // undefined
```

### `unique(array: any[])`

Safely reduce the provided `array` to those entries which are unique.

#### Example

```js
unique([1, 2, 2, 3, 4, 4, 5]); // [1, 2, 3, 4, 5]
unique(["a", "b", "a", "c"]); // ["a", "b", "c"]
unique([]); // []
```

## Date

### `configureDateHelpers(config?: object)`

Set project-wide defaults for date parsing and formatting.

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

#### Example

```js
formatDate("22/06/2026");
formatDate("22/06/2026", "shortDate");
formatDate("2026-06-22", { year: "numeric", month: "long", day: "2-digit" });
```

### `getRelativeDateParts(value: any, relativeTo?: any, options?: object)`

Convert two supported dates into relative date parts for use with
`Intl.RelativeTimeFormat` or custom UI rendering.

#### Example

```js
getRelativeDateParts("2026-06-22T10:00:00", "2026-06-22T10:01:00");
// { value: -1, unit: "minute" }
```

### `parseDate(value: any, options?: object)`

Convert `Date`, timestamp, Temporal, ISO/RFC 9557 string, or configured
token-format string input into a Temporal date value.

Token strings use Day.js-style tokens such as `DD/MM/YYYY`. Invalid or empty
values return `null`.

#### Example

```js
parseDate("2026-06-22"); // Temporal.PlainDate
parseDate("2026-06-22T10:15:30Z"); // Temporal.Instant
parseDate("22/06/2026 10:15", { inputFormat: "DD/MM/YYYY HH:mm" }); // Temporal.PlainDateTime
```

### `toEpochMilliseconds(value: any, options?: object)`

Convert a supported date input into epoch milliseconds. Plain dates and
plain date-times use the configured timezone.

#### Example

```js
toEpochMilliseconds("22/06/2026");
toEpochMilliseconds("06/22/2026", { inputFormat: "MM/DD/YYYY", timeZone: "America/New_York" });
```

## Form

### `validateField(fieldName: string, validationRules: object[], formData: object)`

Validate a field given its `fieldName`, the field's `validationRules`, and the sum total `formData`.

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
validateField("username", [{ rule: "required", message: "Enter a username" }], { username: "" }); // { valid: false, errors: ["Enter a username"], validated: true }
validateField("username", [{ rule: "required", message: "Enter a username" }], {
	username: "jack_skellington",
}); // { valid: true, errors: [], validated: true }
```

## General

### `getFriendlyDisplay(variable: any)`

Convert a given `variable` into a human-readable representation of its type.

#### Example

```js
getFriendlyDisplay(["A", "B", "C", "D"]); // <array[4]>
getFriendlyDisplay([]); // <array[0]>
getFriendlyDisplay("hello"); // hello <string>
```

### `isFunction(variable: any)`

Determines whether the given `variable` is a function.

#### Example

```js
isFunction(() => "Hello"); // true
isFunction("function"); // false
isFunction(5); // false
```

### `size(variable: any)`

Determine the size of the given `variable`. For strings, the number of characters is used; for numbers, the value itself; for arrays, the length; for objects, the number of top-level properties. Returns `0` if no reasonable size can be determined.

#### Example

```js
size("hello"); // 5
size(42); // 42
size([1, 2, 3]); // 3
size({ a: 1, b: 2 }); // 2
size(null); // 0
```

### `validateOrFallback(value: any, comparison: function | string, fallback: any)`

Apply `comparison` to the provided `value`, returning `value` if `true`, and `fallback` if not.

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

#### Example

```js
isNumber(4); // true
isNumber(NaN); // false
isNumber("string"); // false
```

### `isNumeric(variable: any)`

Determines whether the given `variable` is a number, or a string containing a number.

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

#### Example

```js
round(4.567); // 5
round(4.567, 2); // 4.57
round(4.567, 0); // 5
round(4.567, -1); // 0
```

## Object

### `addProperty(object: object, key: string, value: any)`

Add a shallow key / value pair to an object without overwriting any existing value.
That is, only if that key isn't already present, or if its value is undefined
or null.

#### Example

```js
addProperty({ one: "One", two: "Two" }, "one", "Two"); // { one: "One", two: "Two" }
addProperty({ one: "One", two: "Two" }, "three", "Three"); // { one: "One", two: "Two", three: "Three" }
addProperty({ one: "One", two: null }, "two", "Two"); // { one: "One", two: "Two" }
```

### `deepCopy(object: object)`

Returns a recursive copy of `object`.

#### Example

```js
deepCopy({ key: "value" }); // { key: "value" }
deepCopy(["a", "b"]); // ["a", "b"]
```

### `deepMerge(object: object)`

Recursively merges two or more objects. The values of later objects override those of earlier objects.

#### Example

```js
deepMerge({ key: "value" }, { value: "key" }); // { key: "value", value: "key" }
deepMerge({ key: "value", a: { b: 2 } }, { key: "modified", a: { c: 3 } }); // { key: "modified", a { b: 2, c: 3 }}
```

### `getPathValue(object: object, path: string, returnValue: any = undefined)`

Retrieve the `object` property value found at `path`, or `returnValue`.

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

#### Example

```js
hasAnyPath({ a: { b: { c: 1 } } }, ["a.b.c"]); // true
hasAnyPath({ a: { b: { c: 1 } } }, ["a.b.d", "a.b.c"]); // true
hasAnyPath({ a: { b: { c: 1 } } }, ["a.b.d"]); // false
hasAnyPath({ a: { b: { c: 1 } } }, ["a.b.e", "a.b.f"]); // false
```

### `isNonEmptyObject(variable: any)`

Determines whether the given `variable` is both an object (and not null, or an array), and has at least one property.

#### Example

```js
isNonEmptyObject({ property: "value" }); // true
isNonEmptyObject({}); // false
isNonEmptyObject("string"); // false
```

### `isObject(variable: any)`

Determine whether the given `variable` is an object, excluding arrays and null.

#### Example

```js
isObject({ property: "value" }); // true
isObject(["A", "B", "C", "D"]); // false
isObject(null); // false
```

### `keyBy(array: object[], key: string)`

Convert the given `array` of objects into a single object, where each object in the original array is placed under the value of its given `key`.

Objects without the given `key` are discarded. If an object has the same value `key` as a previous object, the previous object will be overwritten.

#### Example

```js
keyBy([{ a: 1 }, { a: 2 }], "a"); // { 1: { a: 1 }, 2: { a: 2 } }
```

### `keys(object: object)`

Returns an array of the keys of the given `object`.

#### Example

```js
keys({ a: 1, b: 2, c: 3 }); // ["a", "b", "c"]
keys({}); // []
keys("string"); // []
```

### `objectContains(object: object, needle: any, { exclude: string[] = null, include: string[] = null, caseInsensitive: boolean = true, allowPartial: boolean = false })`

Returns true if one of the `object`'s values is `needle`. Also works when `object` is an array.

String `needle`s are checked case-insensitively by default, and partial matches can be enabled via option.

`exclude` defines an array of properties to exclude from the search, while `include` defines an array of properties which are searched exclusively. If `include` is defined, `exclude` is ignored.

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

#### Example

```js
objectLength({ a: 1, b: 2 }); // 2
objectLength({}); // 0
objectLength("string"); // 0
```

### `omit(object: object, properties: string[])`

Returns a new object with the specified `properties` omitted from the given `object`.

#### Example

```js
omit({ a: 1, b: 2, c: 3 }, ["b"]); // { a: 1, c: 3 }
omit({ a: 1, b: 2, c: 3 }, ["a", "c"]); // { b: 2 }
omit({ a: 1, b: 2, c: 3 }, []); // { a: 1, b: 2, c: 3 }
```

### `pick(object: object, properties: string[])`

Returns an object containing only `properties` properties from `object`.

Any non-string properties are ignored.

If the object does not have a given property, it is ignored.

#### Example

```js
pick({ a: "one", b: "two", c: "three" }, ["a", "b"]); // { a: "one", b: "two" }
pick({ a: "one", b: "two", c: "three" }, ["a"]); // { a: "one" }
pick({ a: "one", b: "two", c: "three" }, ["a", "d"]); // { a: "one" }
```

### `pluckPathValues(array: object[], path: string)`

Retrieve an array of the `path` value from each of the objects found in `array`.

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

#### Example

```js
removePathValue({ key: "value" }, "key"); // {}
removePathValue({ key: "value" }, "another"); // { key: "value" }
removePathValue({ key: "value", one: { two: { three: "three" } } }, "one.two.three"); // { key: "value", one: { two: {} } }
removePathValue({ key: "value", one: { two: "two" } }, "one.two.three"); // { key: "value", one: { two: "two" } }
```

### `setPathValue(object: object, path: string, value: any)`

Set an object property at `path`.

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

#### Example

```js
unwrap({ key: "value" }); // "value"
unwrap(null); // null
unwrap({ key_one: "value", key_two: "value two" }); // null
```

### `values(object: object)`

Returns an array of the values of the given `object`.

#### Example

```js
values({ a: 1, b: 2, c: 3 }); // [1, 2, 3]
values({}); // []
values("string"); // []
```

## String

### `isNonEmptyString(variable: any, { trim: boolean = false })`

Determines whether the given `variable` is both a string and has at least one character. If `trim` is true, the string is trimmed of whitespace before the test is performed.

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

#### Example

```js
ltrim("***string***", "*"); // **string***
ltrim("***string***", new RegExp("\\*")); // **string***
ltrim("***string***", new RegExp("\\*+")); // string***
```

### `rtrim(string: string, pattern: string | RegExp = "\\s")`

Trim the right hand side of `string` using the provided string or RegExp `pattern`. Trims whitespace by default.

#### Example

```js
rtrim("***string***", "*"); // ***string**
rtrim("***string***", new RegExp("\\*")); // ***string**
rtrim("***string***", new RegExp("\\*+")); // ***string
```

### `StringManipulator`

`StringManipulator` can be used to chain string methods together safely. A new instance of the class is created, and then any of the string helper methods can be used in any sequence. If the input at any stage is invalid, an empty string is returned.

#### Example

```js
const userId = "82FAA75F-B47A-43B6-82F6-389C9408BB67";

const userIdPreview = new StringManipulator(userId).toLowerCase().truncate(15).value; // 82faa75f-b47a-…
```

### `toLowerCase(variable: string)`

A safe wrapper around `toLowerCase`, returning an empty string if the provided `variable` is not a string itself.

#### Example

```js
toLowerCase("String"); // string
toLowerCase(""); // ""
toLowerCase(["A", "B"]); // ""
```

### `toUpperCase(variable: string)`

A safe wrapper around `toUpperCase`, returning an empty string if the provided `variable` is not a string itself.

#### Example

```js
toUpperCase("string"); // "STRING"
toUpperCase(""); // ""
toUpperCase(["A", "B"]); // ""
```

### `trim(string, pattern: string | RegExp = "\\s")`

Trim both sides of `string` using the provided string or RegExp `pattern`. Trims whitespace by default.

#### Example

```js
trim("   string   "); // string
trim("* *string* *", "*"); // *string*
trim("***string***", new RegExp("\\*")); // **string**
trim("***string***", new RegExp("\\*+")); // string
```

### `truncate(string: string, length: number = 10, { decoration: string = "…", preserveWords: boolean = false, strict: boolean = true, includeDecoration: boolean = true })`

Truncate a string to a given length, with various options for how the truncation occurs.

If the provided variable is not a string, returns an empty string.

- `length`: The length to truncate the string to
- `decoration`: The decoration to append to the string if it is truncated
- `includeDecoration`: Whether to include the length of the decoration in length calculations
- `preserveWords`: Whether to avoid breaking a word during truncation
- `strict`: When preserving words, if strict the resulting length will be less than the desired length

#### Example

```js
truncate("Hello, world!"); // "Hello, wo…"
truncate("Hello, world!", 15); // "Hello, world!"
truncate("Hello, world!", 8); // "Hello, …"
truncate("Hello, world!", 8, { preserveWords: true }); // "Hello,…"
truncate(["A", "B"]); // ""
```

## URL

### `getCurrentUrlParameter(parameter: string)`

Retrieve `parameter` from the current browser URL, returning `null` if the parameter is not present.

#### Example

```js
// https://duckduckgo.com?page=2
getCurrentUrlParameter("page"); // 2
// https://duckduckgo.com?page=2
getCurrentUrlParameter("unknown"); // null
```

### `getSearchParameter(search: string | URLSearchParams, parameter: string)`

Retrieve `parameter` from a URL search string or `URLSearchParams` instance, returning `null` when the parameter is not present.

#### Example

```js
getSearchParameter("?page=2", "page"); // 2
getSearchParameter("?page=2", "unknown"); // null
```

### `removeCurrentUrlParameter(parameter: string)`

Remove `parameter` from the current browser URL if it exists.

#### Example

```js
// https://duckduckgo.com?page=2
removeCurrentUrlParameter("unknown"); // https://duckduckgo.com?page=2
// https://duckduckgo.com?page=2
removeCurrentUrlParameter("page"); // https://duckduckgo.com
```

### `removeSearchParameter(search: string | URLSearchParams, parameter: string)`

Return a search string with `parameter` removed.

#### Example

```js
removeSearchParameter("?page=2", "unknown"); // ?page=2
removeSearchParameter("?page=2", "page"); // ""
```

### `updateCurrentUrlParameter(parameter: string, value: string | null)`

Update the current browser URL to set `parameter` to `value`, adding `parameter` if it doesn't already exist, or overwriting any current value if it doesn't. If `value` is `null`, the parameter is removed.

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

#### Example

```js
updateSearchParameter("", "page", "2"); // ?page=2
updateSearchParameter("?page=2", "page", "3"); // ?page=3
updateSearchParameter("?page=3", "page", null); // ""
```

## Vue

### `callComponentMethod(component, method: string, ...parameters: any)`

If the given `component` is an object and contains a function parameter `method`, call that method with any additional `parameters` and return its result. This helper allows safe calling of a method when an object might not exist.

#### Example

```js
// component = { method: () => "result" }
callComponentMethod(component, "method", "parameterOne"); // result
callComponentMethod(component, "undefinedMethod"); // undefined
callComponentMethod(null); // undefined
```

### `getSlotText(slotReference)`

Retrieve the text from the given `slotReference`. `slotReference` is a direct reference to a slot - for example `slots.default`. Text is concatenated when multiple children exist.

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

#### Example

```js
// slots.default = () => [{ type: Text, children: "Text content" }]
isNonEmptySlot(slots.default); // true
// slots.default = () => [{ type: Comment }]
isNonEmptySlot(slots.default); // false
isNonEmptySlot("string"); // false
```

<!-- helpers:end -->
