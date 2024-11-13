# Changelog

## 0.13.0 - #

### Updates

`validateField` - No longer bails if a `required` rule is reached. We might as well be clear to users what other requirements there are at the same time.

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
