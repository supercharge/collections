# Changelog

## [3.1.3](https://github.com/supercharge/collections/compare/v3.1.3...v3.1.4) - 2021-02-05

### Fixed
- fixed types for `first` and `shift`


## [3.1.3](https://github.com/supercharge/collections/compare/v3.1.2...v3.1.3) - 2021-01-28

### Fixed
- fixed another typing issue for `flatMap`


## [3.1.2](https://github.com/supercharge/collections/compare/v3.1.1...v3.1.2) - 2021-01-07

### Fixed
- fixed typings for `map` and `flatMap`


## [3.1.1](https://github.com/supercharge/collections/compare/v3.1.0...v3.1.1) - 2021-01-03

### Fixed
- fixed types: make `predicate` parameter optional for `Collection#first`


## [3.1.0](https://github.com/supercharge/collections/compare/v3.0.0...v3.1.0) - 2020-12-02

### Updated
- bump dependencies
- change typings to allow single values and arrays (`T | T[]`) when creating collections


## [3.0.0](https://github.com/supercharge/collections/compare/v2.4.0...v3.0.0) - 2020-09-03

### Added
- synchronous collections by default
  - all collections were **async** by default until versions `2.x`, you had to await every collection pipeline
  - this changes with the release of version `3.0`: all collections are **sync** by default
  - synchronous collections work like JavaScript’s array methods
  - you must explicitly call `collection.all()` to retrieve the resulting array from a synchronous collection
- a collection becomes async as soon as you provide an **async callback method** to methods like `map`, `filter`, `find`, and so on:

### Updated
- bump dependencies
- change `main` entrypoint in `package.json` to `dist` folder

### Removed
- remove `index.js` file which acted as a middleman to export from `dist` folder

### Breaking Changes
- collections are now synchronous by default, meaning you don’t need to await a collection if you’re not using an async callback

#### Sync Collections
Synchronous collections work like JavaScript’s Array methods. For example, the following pipeline stays a synchronous pipeline:

```js
const Collect = require('@supercharge/collections')

const collection = Collect([1, 2, 3, 4, 5])
  .map(item => item * 2)
  .filter(item => item > 5)
  .sort((a, b) => b -a)

// on sync collections, you must explicitly call `.all()` to retrieve the result

const result = collection.all()
//  [10, 8, 6]
```

#### Async Collections
In comparison, a collection becomes async as soon as you provide an async callback method to methods like `map`, `filter`, `find`, and so on:

```js
const Collect = require('@supercharge/collections')

const collection = Collect([1, 2, 3, 4, 5])
  .map(async item => item * 2) // the collection is async from here on
  .filter(item => item > 5)
  .sort((a, b) => b -a)

// async collections must be awaited

const result = await collection
//  [10, 8, 6]
```


## [2.4.0](https://github.com/supercharge/collections/compare/v2.3.0...v2.4.0) - 2020-07-21

### Added
- `uniqueBy(callback)` method: create a collection of unique items where each unique item is identified by a value returned from the `callback`
- GitHub Action to publish the package in the GitHub Package Registry


## [2.3.0](https://github.com/supercharge/collections/compare/v2.2.0...v2.3.0) - 2020-07-19

### Added
- `flatten()` method: flatten the collection one level deep
- typed collections: improved TypeScript type definitions enable IntelliSense (when possible) inside callback methods


## [2.2.0](https://github.com/supercharge/collections/compare/v2.1.0...v2.2.0) - 2020-07-02

### Added
- `filterIf(condition, callback)` method: a variant of the the `filter` method only filtering the collection if the `condition` evaluates to true


## [2.1.0](https://github.com/supercharge/collections/compare/v2.0.0...v2.1.0) - 2020-06-30

### Added
- `count` method


## [2.0.0](https://github.com/supercharge/collections/compare/v1.13.0...v2.0.0) - 2020-05-21

### Added
- TypeScript typings
- collection pipelines are now awaitable: no need to call `.all()` to retrieve the result
  - before: `await Collect([1, 2, 3]).map(...).filter().all()`
  - now: `await Collect([1, 2, 3]).map(...).filter()`

### Updated
- bump dependencies
- moved code base to TypeScript to automatically generate type definitions

### Breaking Changes
- all `xSeries` methods become the default and were removed
  - for example: `mapSeries` becomes `map` and the `mapSeries` method was removed
  - the methods running async functions in parallel were removed in favor of the sequence versions
  - I found myself defaulting to the `xSeries` methods because I typically don’t want to handle the side-effects of parallel processing on a large collections. That’s why the methods iterating over the items in sequence are the new default.

**Note:** there are no new `xParallel` methods to fill the gap for the missing methods processing async tasks in parallel. If you need the parallel methods, I’m happy to support you on a pull request.


## [1.13.0](https://github.com/supercharge/collections/compare/v1.12.2...v1.13.0) - 2020-03-26

### Updated
- `unique` supports a string or callback function as a parameter to identify unique values


## [1.12.2](https://github.com/supercharge/collections/compare/v1.12.1...v1.12.2) - 2020-03-12

### Fixed
- `findSeries` now stops when the first matching item is found


## [1.12.1](https://github.com/supercharge/collections/compare/v1.12.0...v1.12.1) - 2020-03-12

### Updated
- `has`: uses `findSeries` instead of `find` to determine whether the condition matches


## [1.12.0](https://github.com/supercharge/collections/compare/v1.11.0...v1.12.0) - 2020-02-11

### Added
- `.pluck()` method
- `.any()` method as an alias for `.some()`
- `.anySeries()` method as an alias for `.someSeries()`

### Updated
- bump deps


## [1.11.0](https://github.com/supercharge/collections/compare/v1.10.0...v1.11.0) - 2020-01-30

### Added
- `.groupBy()` method

### Updated
- bump deps


## [1.10.0](https://github.com/supercharge/collections/compare/v1.9.1...v1.10.0) - 2020-01-22

### Added
- `.tap()` method
- `.hasDuplicates()` method

### Fixed
- an empty value creates an empty collection, example: `Collect(null).all()` returns an empty array `[]`


## [1.9.1](https://github.com/supercharge/collections/compare/v1.9.0...v1.9.1) - 2020-01-07

### Added
- reduce package size by defining published `files` in `package.json`

### Updated
- bump deps
- refine example in readme

### Removed
- `.travis.yml` and moved to GitHub Actions for testing


## [1.9.0](https://github.com/supercharge/collections/compare/v1.8.0...v1.9.0) - 2019-10-26

### Added
- `.pop()` method


## [1.8.0](https://github.com/supercharge/collections/compare/v1.7.0...v1.8.0) - 2019-10-24

### Added
- `.last()` method

### Updated
- bump deps


## [1.7.0](https://github.com/supercharge/collections/compare/v1.6.0...v1.7.0) - 2019-10-11

### Added
- `.median()` method


## [1.6.0](https://github.com/supercharge/collections/compare/v1.5.1...v1.6.0) - 2019-10-10

### Added
- `.sum()` method
- `.avg()` method
- `.min()` method
- `.max()` method
- `.join()` method
- `.sort()` method
- `.diff()` method
- `.union()` method
- `.intersect()` method
- `.toJSON()` method
- `.reverse()` method

### Updated
- bump dependencies


## [1.5.1](https://github.com/supercharge/collections/compare/v1.5.0...v1.5.1) - 2019-09-24

### Updated
- bump dependencies
- refine examples in Readme


## [1.5.0](https://github.com/supercharge/collections/compare/v1.4.1...v1.5.0) - 2019-09-23

### Added
- `.has()` method
- `.first()` method
- `.clone()` method
- `.unshift()` method


## [1.4.1](https://github.com/supercharge/collections/compare/v1.4.0...v1.4.1) - 2019-07-25

### Fixed
- Initializing the Collection won't automatically flatten the given array


## [1.4.0](https://github.com/supercharge/collections/compare/v1.3.0...v1.4.0) - 2019-07-24

### Added
- `.someSeries()` method
- `.everySeries()` method

### Updated
- clone the array passed to the collection to remove the reference. This ensures that collection operations won't affect the original array's data


## [1.3.0](https://github.com/supercharge/collections/compare/v1.2.1...v1.3.0) - 2019-07-23

### Added
- `.push()` method
- `.shift()` method
- `.concat()` method


## [1.2.1](https://github.com/supercharge/collections/compare/v1.2.0...v1.2.1) - 2019-07-19

### Updated
- keywords in `package.json`


## [1.2.0](https://github.com/supercharge/collections/compare/v1.1.0...v1.2.0) - 2019-07-19

### Added
- `.chunk()` method
- `.slice()` method
- `.splice()` method
- `.findSeries()` method
- `.filterSeries()` method
- `.rejectSeries()` method
- `.take()` method
- `.takeAndRemove()` method

### Updated
- internal refactoring from individual files for each method to a single `Collections` class
- added NPM script to list all tests (`npm run list-tests`)
- added NPM script to run a single test (`npm run test single <id>`: get the ID from the list of tests)


## [1.1.0](https://github.com/supercharge/collections/compare/v1.0.0...v1.1.0) - 2019-07-15

### Added
- `.size()` method
- `.isEmpty()` method
- `.isNotEmpty()` method
- `.reject()` method (as an inverse method to `.filter()`)
- `.forEachSeries()` method (it was implemented for 1.0, but not exported 😅)

### Updated
- bump dev dependencies
- refined docblocks for methods


## 1.0.0 - 2019-07-12

### Added
- `1.0.0` release 🚀 🎉
