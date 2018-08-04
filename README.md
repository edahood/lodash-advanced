# Lodash Advanced Filters for Node.js

---
### Main Features

- **Adds "where" Filter to lodash which supports similar finders to most good db ORMs**
- **Adds Helpful utils to lodash**
  - lodash.forceArray ensures that the value is an array or makes it a 1 element array and returns
  - lodash.between Check if a value is between two other values (supports Date's too)
  - lodash.where Filter an array using complex filters on properties, supports "and","or" and nested
  - lodash.allTruthy Check if all values in an array are Truthy or Functions that return Truthy when executed
  - lodash.anyTruthy Check if ANY values in an array are Truty or Functions that return Truthy when executed
  - lodash.uuid Get a UUID value (uuid/v4)
  - lodash.isPromise Check if a value is a Promise or something that has a "then" function as a property
  - lodash.splitUntil Split a string limiting the results and re-joining any remaining items as the last element
  - lodash.isJSON Get the value type of a JSON stringified value, used to detect if a string is a serialized Object or Array or what not
  - lodash.ilike Do a case Insensitive RegEx compare against a value
  - lodash.like Do a case Sensitive RegEx compare against a value
  - lodash.annotate Rekey and object to use its path as the key in a flat object dot separated
  - lodash.deannotate Restore an object to its deep original form which was annotated using lodash.annotate
  - lodash.isDate Check if a value is a Date, a Date String, or a number which can be used as a date, like from Date.getTime()

- **Support for lodash.runInContext**
  - Can be loaded onto a clean lodash instance by passing options {isolate: true} when loading

---

### Demo

Sample Complex Samples combining stuff up

``` javascript
 // Get a lodash instance with awesome mixins added
 const _ = require('lodash-advanced')();
 let rows = [{name: 'jon', age: 13}, {name: 'carol', age: 80}, {name: 'men', age: 15}];
 let record = {title: 'blah blah', views: 999, tag: 'people.players.bfc_456.vld'};

// Find items where the age is Greater Than 45
console.log(
  _.where(rows, {age: {gt: 45}})
)
//RESULT [{name: 'carol', age: 80}]

// Find items where name starts with Jo (CASE INSENSITIVE) OR  (age > 70 and name ends with 'ol' CASE SENSITIVE)
console.log(
_.where(rows, {
            or: [
                {age: {gt: 70}, name: {like: 'ol$'} },
                {name: {ilike: '^jo'} }
            ]
           }
  )
)
//RESULT [{name: 'jon', age: 13}, {name: 'carol', age: 80}]

```

### Installation

``` bash
$ npm install --save lodash-advanced
```

### Usage


### Support


### Maintainers
