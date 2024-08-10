# Changelog

## 0.1.0

The initial version adds six helpers:

### array

- `getNextIndex` - Given a current index and array, determine the next available index
- `isNonEmptyArray` - Determines that the given input is both an array and has at least one item

### general

- `getFriendlyDisplay` - Convert a given variable into a human-readable representation of its type

### number

- `isNumber` - Determines that the given input is a number and not NaN

### object

- `isNonEmptyObject` - Determines that the given input is both an object (and not null, or an array), and has at least one property

### string

- `isNonEmptyString` - Determines that the given input is both a string and has at least one character
