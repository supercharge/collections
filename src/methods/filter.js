'use strict'

const map = require('./map')

/**
 * Asynchronously filter the given `array` using the provided `callback`.
 * At first, this function uses an async version of Array.map to run the
 * `callback` on every item. This returns an array of boolean values,
 * like `[ true, false, true ]`. The final filter results will be
 * calculated based on the boolean results and only those items
 * having a `true` result in the boolean array will survive.
 *
 * @param {Array} array
 * @param {Function} callback
 *
 * @returns {Array} resulting array of filtered items
 */
module.exports = async function filter (array, callback) {
  const mapped = await map(array, callback)

  return array.filter((_, i) => mapped[i])
}
