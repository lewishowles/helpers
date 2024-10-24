# Helpers

A library of gorgeous Javascript methods to make working with—and validating—data quicker and less error-prone, letting the developer concentrate on the fun stuff.

These helpers are grouped by type, which makes multiple imports a little more manageable. For example:

```
import { getNextIndex } from "@lewishowles/helpers/array";
```

## Array

### `arrayLength(array)`

Determine the number of items in the given `array`.

If the provided input is not an array, returns `0`.

#### Example

```js
arrayLength(['A', 'B', 'C', 'D']); // 4
arrayLength([]); // 0
arrayLength(undefined); // 0
```

### `firstDefined(array)`

Returns the first non-undefined element in `array`.

#### Example

```js
firstDefined(["a", "b"]); // "a"
firstDefined([undefined, undefined "c", "d"]); // "c"
firstDefined([]); // undefined
```

### `getNextIndex(index, reference, { reverse = false, wrap = false })`

Given a starting `index`, determine the next available index in the `reference` array.

- `reverse` - Reverse the direction, finding the previous index instead
- `wrap` - When reaching the end of the array, wrap to the start, and vice-versa

If the provided index is outside of the reference array, or the provided index or reference array are unexpected, a default value of `0` is returned.

#### Example

```js
getNextIndex(3, ['A', 'B', 'C', 'D']); // 3
getNextIndex(3, ['A', 'B', 'C', 'D'], { wrap: true }); // 0
getNextIndex(3, ['A', 'B', 'C', 'D'], { reverse: true }); // 2
```

### `head(array)`

Returns the first element in `array`.

#### Example

```js
head(["a", "b"]); // "a"
head([]); // undefined
```

### `isNonEmptyArray(variable)`

Determines whether the given `variable` is both an array and has at least one item.

#### Example

```js
isNonEmptyArray(['A', 'B', 'C', 'D']); // true
isNonEmptyArray([]); // false
isNonEmptyArray("string"); // false
```

### `lastDefined(array)`

Returns the last non-undefined element in `array`.

#### Example

```js
lastDefined(["a", "b"]); // "b"
lastDefined(["a", "b", undefined, undefined]); // "b"
lastDefined([]); // undefined
```

### `pluck(array, property)`

Retrieve an array of the `property` value from each of the objects found in `array`.

Any non-objects in `array` are ignored.

#### Example

```js
pluck({ property: "value" }, "property"); // "value"
pluck({ nested: { property: { value: "seven" } } }, "nested.property.value"); // "seven"
pluck({ nested: { property: { value: "seven" } } }, "nested.mistake.value"); // null
pluck([], "property"); // null
```

### `tail(array)`

Returns the last element in `array`.

#### Example

```js
tail(["a", "b"]); // "b"
tail([]); // undefined
```

## General

### `getFriendlyDisplay(variable)`

Convert a given `variable` into a human-readable representation of its type.

#### Example

```js
getFriendlyDisplay(['A', 'B', 'C', 'D']); // <array[4]>
getFriendlyDisplay([]); // <array[0]>
getFriendlyDisplay("hello"); // hello <string>
```

### `isFunction(variable)`

Determines whether the given `variable` is a function.

#### Example

```js
isFunction(() => "Hello")); // true
isFunction("function"); // false
isFunction(5); // false
```

### `validateOrFallback(value, comparison, fallback)`

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
getFriendlyDisplay({}, isNonEmptyObject, null); // null
getFriendlyDisplay(5, "number", 0); // 5
```

## Number

### `clamp(number, minimum, maximum)`

Ensure that the provided `number` is between `minimum` and `maximum` (inclusive). If `number` is lower than `minimum`, `minimum` is returned. If `number` is higher than maximum, `maximum` is returned.

If `number` is not a number, `minimum` is returned.

#### Example

```js
isNumber(4); // true
isNumber(NaN); // false
isNumber("string"); // false
```

### `isNumber(variable)`

Determines whether the given `variable` is a number and not NaN.

#### Example

```js
isNumber(4); // true
isNumber(NaN); // false
isNumber("string"); // false
```

## Object

### `deepCopy(object)`

Returns a recursive copy of `object`.

#### Example

```js
deepCopy({ key: "value" }); // { key: "value" }
deepCopy(["a", "b"]); // ["a", "b"]
```

### `deepMerge(object)`

Recursively merges two or more objects. The values of later objects override those of earlier objects.

#### Example

```js
deepMerge({ key: "value" }, { value: "key" }); // { key: "value", value: "key" }
deepMerge({ key: "value", a: { b: 2 }}, { key: "modified", a: { c: 3 }}); // { key: "modified", a { b: 2, c: 3 }}
```

### `get(object, path)`

Retrieve the `object` property value found at `path`, or null.

#### Example

```js
get({ property: "value" }, "property"); // "value"
get({ nested: { property: { value: "seven" } } }, "nested.property.value"); // "seven"
get({ nested: { property: { value: "seven" } } }, "nested.mistake.value"); // null
get([], "property"); // null
```

### `isNonEmptyObject(variable)`

Determines whether the given `variable` is both an object (and not null, or an array), and has at least one property.

#### Example

```js
isNonEmptyObject({ property: "value" }); // true
isNonEmptyObject({}); // false
isNonEmptyObject("string"); // false
```

### `isObject(variable)`

Determine whether the given `variable` is an object, excluding arrays and null.

#### Example

```js
isObject({ property: "value" }); // true
isObject(['A', 'B', 'C', 'D']); // false
isObject(null); // false
```

### `pick(object, properties)`

Returns an object containing only `properties` properties from `object`.

Any non-string properties are ignored.

If the object does not have a given property, it is ignored.

#### Example

```js
pick({ a: "one", b: "two", c: "three" }, ["a", "b"]); // { a: "one", b: "two" }
pick({ a: "one", b: "two", c: "three" }, ["a"]); // { a: "one" }
pick({ a: "one", b: "two", c: "three" }, ["a", "d"]); // { a: "one" }
```

## String

### `isNonEmptyString(variable, { trim: false })`

Determines whether the given `variable` is both a string and has at least one character. If `trim` is true, the string is trimmed of whitespace before the test is performed.

#### Example

```js
isNonEmptyObject("string"); // true
isNonEmptyObject(""); // false
isNonEmptyObject(["A", "B"]); // false
isNonEmptyObject("  "); // true
isNonEmptyObject("  ", { trim: true }); // false
```

## Vue

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

### `runComponentMethod(component, method, ...parameters)`

If the given `component` is an object and contains a function parameter `method`, call that method with any additional `parameters`. This helper allows safe running of a method when an object might not exist.

#### Example

```js
// component = { method: () => {} }
runComponentMethod(component, "method", "parameterOne"); // true
runComponentMethod(component, "undefinedMethod"); // undefined
runComponentMethod(null); // undefined
```

## Chart

### `chartColours`, `extendedColours`, and `brightColours`

Each returns a set of accessible chart colours. Colours are provided as Tailwind text colour classes. Full classes are provided to avoid any issues with Tailwind not being able to determine compound classes. Text colours are provided as text colours are more likely to be used elsewhere, as opposed to fill colours, and thus the final CSS bundle is likely to be smaller. To use a colour to fill an SVG shape, combine it with `fill-current`.

Note that when `brightColours` is used in a pie chart, there is a chance that two adjacent colours may not be sufficiently distinct based on the number of slices.

#### Example

```js
import { chartColours } from "@lewishowles/helpers/chart";
import { getNextIndex } from "@lewishowles/helpers/array";

const startIndex = 0;
const nextIndex = getNextIndex(0, chartColours, { wrap: true });
const colour = chartColours[nextIndex];
```

### `getNextColour(index, overrideColours)`

Retrieve the next colour for a chart segment based on the current `index`. Optionally provide the colours to choose from with `overrideColours`.

#### Example

```js
import { getNextColour } from "@lewishowles/helpers/chart";
```

```html
<path
	v-for="(figure, index) in figures"
	:key="figure.id"
	v-bind="{
		fill: getNextColour(index)
	}"
/>
```
