# Changelog

## [1.11.0](https://github.com/superchargejs/collections/compare/v1.10.0...v1.11.0) - 2020-xx-xx

### Added
- `.groupBy()` method

### Updated
- bump deps


## [1.10.0](https://github.com/superchargejs/collections/compare/v1.9.1...v1.10.0) - 2020-01-22

### Added
- `.tap()` method
- `.hasDuplicates()` method

### Fixed
- an empty value creates an empty collection, example: `Collect(null).all()` returns an empty array `[]`


## [1.9.1](https://github.com/superchargejs/collections/compare/v1.9.0...v1.9.1) - 2020-01-07

### Added
- reduce package size by defining published `files` in `package.json`

### Updated
- bump deps
- refine example in readme

### Removed
- `.travis.yml` and moved to GitHub Actions for testing


## [1.9.0](https://github.com/superchargejs/collections/compare/v1.8.0...v1.9.0) - 2019-10-26

### Added
- `.pop()` method


## [1.8.0](https://github.com/superchargejs/collections/compare/v1.7.0...v1.8.0) - 2019-10-24

### Added
- `.last()` method

### Updated
- bump deps


## [1.7.0](https://github.com/superchargejs/collections/compare/v1.6.0...v1.7.0) - 2019-10-11

### Added
- `.median()` method


## [1.6.0](https://github.com/superchargejs/collections/compare/v1.5.1...v1.6.0) - 2019-10-10

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


## [1.5.1](https://github.com/superchargejs/collections/compare/v1.5.0...v1.5.1) - 2019-09-24

### Updated
- bump dependencies
- refine examples in Readme


## [1.5.0](https://github.com/superchargejs/collections/compare/v1.4.1...v1.5.0) - 2019-09-23

### Added
- `.has()` method
- `.first()` method
- `.clone()` method
- `.unshift()` method


## [1.4.1](https://github.com/superchargejs/collections/compare/v1.4.0...v1.4.1) - 2019-07-25

### Fixed
- Initializing the Collection won't automatically flatten the given array


## [1.4.0](https://github.com/superchargejs/collections/compare/v1.3.0...v1.4.0) - 2019-07-24

### Added
- `.someSeries()` method
- `.everySeries()` method

### Updated
- clone the array passed to the collection to remove the reference. This ensures that collection operations won't affect the original array's data


## [1.3.0](https://github.com/superchargejs/collections/compare/v1.2.1...v1.3.0) - 2019-07-23

### Added
- `.push()` method
- `.shift()` method
- `.concat()` method


## [1.2.1](https://github.com/superchargejs/collections/compare/v1.2.0...v1.2.1) - 2019-07-19

### Updated
- keywords in `package.json`


## [1.2.0](https://github.com/superchargejs/collections/compare/v1.1.0...v1.2.0) - 2019-07-19

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


## [1.1.0](https://github.com/superchargejs/collections/compare/v1.0.0...v1.1.0) - 2019-07-15

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
