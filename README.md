# filterLimitedTo

Selects a subset of items from array and returns it as a new array with a maximum number of elements.

This is a variation of [https://docs.angularjs.org/api/ng/filter/filter](https://docs.angularjs.org/api/ng/filter/filter) that adds an optional limit parameter.
It is specially usefull for large arrays when you would use a [limitTo](https://docs.angularjs.org/api/ng/filter/limitTo) afterwards.

## Usage

### In HTML Template Binding

  {{ filter_expression | filterLimitedTo : expression : comparator : limit }}

### In JavaScript

  $filter('filterLimitedTo')(array, expression, comparator, limit)

## Notice

Note that the comparator parameter is optional, so this should work:

### In HTML Template Binding

  {{ filter_expression | filterLimitedTo : expression : limit }}

### In JavaScript

  $filter('filterLimitedTo')(array, expression, limit)
