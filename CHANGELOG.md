# Changelog

## 0.2.0

Added 11 new helpers:

### array

- `arrayLength` - Determines the number of items in the given array, or 0 if the input is not an array
- `head` - Get the first element in an array
- `tail` - Get the last element in an array
- `firstDefined` - Get the first non-undefined element in an array
- `lastDefined` - Get the last non-undefined element in an array
- `pluck` - Turn an array of objects into an array of the value of a property from those objects

### object

- `deepCopy` - Recursively copy an object or array
- `deepMerge` - Recursively merge two or more objects
- `get` - Get an object's property value at a given path
- `isObject` - Determines if the given input is an object, excluding arrays and null
- `pick` - Returns an object containing only the specified properties

## 0.1.0

The initial version adds six helpers:

### array

- `getNextIndex` - Given a current index and array, determine the next available index
- `isNonEmptyArray` - Determines that the given input is both an array and has at least one item
- `pluck` - Generate an array containing the value of the given property of each of the input objects.

### general

- `getFriendlyDisplay` - Convert a given variable into a human-readable representation of its type

### number

- `isNumber` - Determines that the given input is a number and not NaN

### object

- `isNonEmptyObject` - Determines that the given input is both an object (and not null, or an array), and has at least one property

### string

- `isNonEmptyString` - Determines that the given input is both a string and has at least one character
