# Changelog

## 1.4.3 — 2026-06-29

### Fixes

- `CHANGELOG.md` is now included in the published npm package.

## 1.4.2 — 2026-06-28

### Fixes

- `deepMerge` now preserves class instances (`Date`, custom classes, Vue refs) instead of flattening them into `{}`. Recursion is restricted to plain objects (those whose `constructor` is `Object`) via an `isPlainObject` guard, replacing the broader `isObject` check. When source and target disagree on plain-object vs class instance at the same key, the source value replaces the target.

## 1.4.1 — 2026-06-27

### Fixes

- Root import (`@lewishowles/helpers`) no longer re-exports Vue helpers, so it does not require Vue to be installed. Vue helpers remain available through the `@lewishowles/helpers/vue` subpath.

## 1.4.0 — 2026-06-27

### New helpers

#### array

- Added `groupBy` — groups an array of objects into sub-arrays keyed by a property value. Supports dot-path notation for nested properties via `getPathValue`. Items with missing property values are grouped under `"undefined"`.
- Added `partition` — splits an array into a tuple of `[matching[], nonMatching[]]` based on a predicate. Always returns two arrays, even for non-array or non-function predicate input.
- Added `uniqueBy` — removes duplicate objects from an array based on a property value, keeping the first occurrence. Supports dot-path notation via `getPathValue`.

#### object

- Added `flattenObject` — collapses a nested object into a single-level object with dot-notation keys. Arrays are preserved as leaf values rather than being flattened into indexed keys.
- Added `pickAs` — picks and renames keys from an object via a mapping of `{ outputKey: sourcePath }`, using `getPathValue` for source-path resolution so dot-notation flattening works for free.

## 1.3.0 — 2026-06-26

### Changes

- `validateField` and `validateForm` are now async, returning `Promise<ValidationResult>` and `Promise<{ valid, validated, results }>` respectively. Sync callers must `await` the result.
- `validateField` now accepts [Standard Schema](https://github.com/standard-schema/standard-schema) objects (Zod, Valibot, ArkType schemas) in the rules array alongside object rules and function shorthand. Schemas are detected via the `~standard` property, validated through `~standard.validate(value)`, and any returned issues are mapped to error strings.
- Function shorthand rules are now awaited, so async functions work naturally in the rules array.

## 1.2.0 — 2026-06-26

### New helpers

#### array

- Added `toggleItem` to add an item to an array if absent, or remove all occurrences if present. Supports an optional comparator — either a function `(a, b) => boolean` or a string key for object matching. Always returns a new array.
- Added `range` to generate a numeric array between two values, inclusive of both ends. Supports single-argument shorthand (`range(5)` → `[0..5]`), explicit start and end, and an optional step. Direction is inferred automatically when `start > end`; a negative step can also be passed explicitly.

#### form

- Added `validateForm` to validate multiple fields at once, delegating to `validateField` for each field's rules. Returns `{ valid, validated, results }` where `results` maps each field name to its `validateField` result. Cross-field rules work naturally because the full `formData` is passed through.

## 1.1.0 — 2026-06-25

### Fixes

- `updateCurrentUrlParameter` now preserves existing `window.history.state` when updating the URL, instead of replacing it with `null`. Passing `null` cleared any state set by the SPA or other callers, which could break navigation or component state restoration.

- `validateField` now accepts bare functions in the rules array as a shorthand for custom validation. Each function receives `(value, formData)` and returns an error message string (single error), a string array (multiple errors), or any other value (valid). Object rules continue to work unchanged.

### New helpers

#### date

- Added `configureDateHelpers` to set project-wide locale, timezone, input format, default format, and named output formats. Defaults are `en-GB`, `Europe/London`, and Day.js-style `DD/MM/YYYY` token parsing.
- Added `parseDate` to convert `Date`, timestamps, Temporal types, ISO/RFC 9557 strings, and configured token-format strings into Temporal date values. Invalid or empty input returns `null`.
- Added `toEpochMilliseconds` to convert supported date input into epoch milliseconds. Plain dates and plain date-times are anchored to the configured timezone before conversion.
- Added `formatDate` to format supported date input using a named configured format, a Day.js-style token string, or `Intl.DateTimeFormat` options. Uses the configured locale, timezone, and default format.
- Added `getRelativeDateParts` to compute the relative value and unit between two dates, returning parts suitable for `Intl.RelativeTimeFormat` or custom UI rendering.
- Added `formatRelativeDate` to format a supported date input as a relative date string (e.g. `3 minutes ago`, `in 2 days`), using `Intl.RelativeTimeFormat` with the configured locale.

## 1.0.1

### Fixes

- `callComponentMethod` now calls the method with its component bound as `this`. Detached calls broke native DOM methods such as `focus` and `showModal`, which throw when invoked without their owning element.

## 1.0.0

### New helpers

- `ensureArray` - Ensures the input is an array by converting any non-array values to a single-item array.
- The package now has a root export, so helpers can be imported from `@lewishowles/helpers`.

#### object

- `pluckPathValues` - Retrieve nested path values from each object in an array.

#### url

- `getSearchParameter` - Retrieve a parameter from a search string or `URLSearchParams`.
- `removeSearchParameter` - Remove a parameter from a search string or `URLSearchParams`.
- `updateSearchParameter` - Add, remove, or update a parameter in a search string or `URLSearchParams`.

#### form

- `validateField` now has four cross-field rules. Each can read the whole `formData`, not just its own field's value:
  - `custom` - An escape hatch that runs your `validate(value, formData)` and passes when it returns a truthy value.
  - `required_if` - Requires a value only when another field meets a condition (`field` strictly equals `value`, or `field` has a value when `value` is omitted).
  - `same` - Requires the value to match another field's value.
  - `different` - Requires the value to differ from another field's value.

### Breaking changes

#### Object and array helper names

Several helpers have been renamed so their names describe what they do more clearly.

| Before                  | After             |
| ----------------------- | ----------------- |
| `add`                   | `addProperty`     |
| `forget`                | `removePathValue` |
| `get`                   | `getPathValue`    |
| `hasAny`                | `hasAnyPath`      |
| `set`                   | `setPathValue`    |
| `sortObjectsByProperty` | `sortByProperty`  |

The old helper names are no longer exported.

`getPathValue` now returns `undefined` when a path is missing unless you pass a fallback value.

```js
getPathValue(object, "user.name");
getPathValue(object, "user.name", "Unknown");
```

Use `pluckPathValues` when you need the same nested path from every object in an array.

```js
pluckPathValues(users, "profile.name");
```

#### Form validation

`validateField` now returns a structured result instead of `true` or an array of errors.

```js
const result = validateField(value, rules);

if (!result.valid) {
	console.log(result.errors);
}
```

The result shape is:

```js
{
	valid: boolean,
	errors: string[],
	validated: boolean,
}
```

#### Vue helpers

`runComponentMethod` has been replaced by `callComponentMethod`.

`callComponentMethod` returns the method's result, including promises, while keeping the same safe handling for missing methods.

#### URL helpers

Search-parameter helpers are now available for code that should not read or write `window`.

Use these for pure search-string or `URLSearchParams` work:

- `getSearchParameter`
- `updateSearchParameter`
- `removeSearchParameter`

Use the URL helpers when you want browser URL behaviour:

- `getCurrentUrlParameter`
- `updateCurrentUrlParameter`
- `removeCurrentUrlParameter`

The browser URL helpers have been renamed to make their `window` usage clear.

| Before               | After                       |
| -------------------- | --------------------------- |
| `getUrlParameter`    | `getCurrentUrlParameter`    |
| `removeUrlParameter` | `removeCurrentUrlParameter` |
| `updateUrlParameter` | `updateCurrentUrlParameter` |

#### Package format

The package is now ESM-only. Use `import` instead of `require`.

```js
import { getPathValue } from "@lewishowles/helpers";
```

#### Safer invalid input

`sortByProperty` now returns `[]` when the first argument is not an array.

## 0.19.0 - 2024-05-07

### New helpers

#### vue

- `getSlotText` - Retrieve the text from the given Vue slot.

## 0.18.0 - 2024-03-04

### New helpers

#### object

- `add` - Add a key/value pair to an object if that key doesn't already have a value
- `forget` - Remove the given (optionally deeply nested) key from the given object
- `hasAny` - Check whether the given object has any of the (optionally deeply nested) keys
- `keyBy` - Convert an array of objects into a single object keyed by the value of the given property
- `set` - Set the value of an (optionally deeply nested) key.
- `unwrap` - Retrieve the value from a single-key object

#### array

- `chunk` - Chunk the given array into arrays of the given size
- `compact` - Remove any falsy values from an array

### Updates

- `get` - Now has a new third parameter for the value to return when the path is not found.

## 0.17.0 - 2025-01-26

### New helpers

#### url

- `getUrlParameter` - Retrieve the current value of a given parameter.

## 0.16.1 - 2025-01-26

### Fixes

- Fixes incorrect URL helper exports
- Attempts to remove some circular imports

## 0.16.0 - 2025-01-26

### New helpers

#### url

- `updateUrlParameter` - Add, remove or update the value of a URL parameter.
- `removeUrlParameter` - Remove a given URL parameter if it exists.

## 0.15.0 - 2025-01-12

### New helpers

#### array

- `sortObjectsByProperty` - Sort a list of objects by a given property.
- `unique` - Return an arary containing only unique entries.

#### number

- `round` - Round a given number to the specified number of decimal places.

#### object

- `keys` - Safely retrieve the keys of an object.
- `values` - Safely retrieve the values of an object.
- `omit` - Omit the provided properties from a given object.

## 0.14.0 - 2024-11-19

### New helpers

#### string

- `StringManipulator` - A new class that allows the chaining of string methods.
- `toLowerCase` - A safe wrapper around `toLowerCase`, returning an empty string if the provided variable is not itself a string.
- `toUpperCase` - A safe wrapper around `toUpperCase`, returning an empty string if the provided variable is not itself a string.
- `trim` - Trim both sides of a string, trimming whitespace by default.
- `ltrim` - Trim the left hand side of a string, trimming whitespace by default.
- `rtrim` - Trim the right hand side of a string, trimming whitespace by default.
- `truncate` - Truncate a string, with various options for how the truncation is performed—such as preserving words.

## 0.13.0 - 2024-11-13

### New helpers

#### general

`size` - Determine the size of a variable - characters in a string, items in an array, properties in an object, or the value of a number.

#### object

`objectLength` - The number of (top level) keys in an object.

### Updates

`validateField` - No longer bails if a `required` rule is reached. We might as well be clear to users what other requirements there are at the same time.
`validateField` - `minimum_length` has been renamed to `min` and can now apply to numbers, arrays and objects.
`validateField` - `maximum_length` has been renamed to `max` and can now apply to numbers, arrays and objects.
`validateField` - Added new `in` validation to determine if the value is in a list of options.
`validateField` - Added new `not_in` validation to determine if the value is in a list of options.
`validateField` - Added new `size` validation to determine if the value is exactly `size`.
`validateField` - Added new `between` validation to determine if the value is between a `min` and `max`.

## 0.12.0 - 2024-11-11

### New helpers

#### number

- `isNumeric` - Determine whether a given value is a number, or a string containing a number.

#### form

- `validateField` - Given a field name, validation rules, and form data, validate a field's current value.

## 0.11.0 - 2024-10-28

### Updates

#### object

- `objectContains` - Now provides `include` and `exclude` options to limit the properties that are searched.

## 0.10.0 - 2024-10-25

### New helpers

#### object

- `objectContains` - Given an object (or array) and a needle, search for that needle within the object's values.

## 0.9.0 - 2024-10-23

### Updates

#### string

- `isNonEmptyString` - A new `trim` option (default: `false`) can be provided to allow the string to be trimmed before testing.

## 0.8.0 - 2024-10-16

### New helpers

#### general

- `validateOrFallback` - Given a value and validation function, ensure the value matches, or return the provided fallback.

#### number

- `clamp` - Given a value, minimum and maximum, ensure the returned value is between the extremes.

## 0.7.1 - 2024-09-06

### Updates

#### chart

- `chartColours`, `extendedColours` and `brightColours` now have dark mode colours.

## 0.7.0 - 2024-09-05

### Updates

#### chart

- `getNextColour` - Can now be provided with an alternate set of colours.
- `extendedColours` and `brightColours` - New options for chart colours.

#### array

- `getNextIndex` - Will now handle starting indexes outside of the provided array, if wrap is enabled, by wrapping as necessary.

## 0.6.0 - 2024-09-04

### New helpers

#### chart

- `getNextColour` - Given an index, retrieve the next chart colour in the list of available colours.

## 0.5.1 - 2024-09-02

### Changes

#### vue

- `runComponentMethod` - Updated the code to check for the existence of the method differently, avoiding a Vue warning around enumerating component properties.

## 0.5.0 - 2024-08-31

### New helpers

#### vue

- `runComponentMethod` - Run a method from a component (or object) if it exists.

## 0.4.0 - 2024-08-18

### New helpers

#### chart

- `chartColours` - An array of six accessible colours for use in charts.

## 0.3.1 - 2024-08-17

- `deepMerge` - Fixes an issue where if objects shared a key, but the types of their values were different, no replacement would be made.

## 0.3.0 - 2024-08-14

### New helpers

#### general

- `isFunction` - Determines if the given variable is a function

#### vue

- `isNonEmptySlot` - Determine if a slot is empty by checking its content for validity

## 0.2.0 - 2024-08-11

### New helpers

#### array

- `arrayLength` - Determines the number of items in the given array, or 0 if the input is not an array
- `head` - Get the first element in an array
- `tail` - Get the last element in an array
- `firstDefined` - Get the first non-undefined element in an array
- `lastDefined` - Get the last non-undefined element in an array
- `pluck` - Turn an array of objects into an array of the value of a property from those objects

#### object

- `deepCopy` - Recursively copy an object or array
- `deepMerge` - Recursively merge two or more objects
- `get` - Get an object's property value at a given path
- `isObject` - Determines if the given input is an object, excluding arrays and null
- `pick` - Returns an object containing only the specified properties

## 0.1.0 - 2024-08-10

### New helpers

#### array

- `getNextIndex` - Given a current index and array, determine the next available index
- `isNonEmptyArray` - Determines that the given input is both an array and has at least one item
- `pluck` - Generate an array containing the value of the given property of each of the input objects.

#### general

- `getFriendlyDisplay` - Convert a given variable into a human-readable representation of its type

#### number

- `isNumber` - Determines that the given input is a number and not NaN

#### object

- `isNonEmptyObject` - Determines that the given input is both an object (and not null, or an array), and has at least one property

#### string

- `isNonEmptyString` - Determines that the given input is both a string and has at least one character
