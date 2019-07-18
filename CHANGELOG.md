# Changelog


## [1.2.0](https://github.com/superchargejs/collections/compare/v1.1.0...v1.2.0) - 2019-07-xx

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
