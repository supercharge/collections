'use strict'

const map = require('./map')

/**
 * Asynchrounous version of Array#every(). Checks whether
 * the `callback` returns `true` for all items in the
 * array. Runs all checks in parallel.
 *
 * @param {Array} array
 * @param {Function} callback
 *
 * @returns {Boolean} Returns `true` if all items pass the predicate check, `false` otherwise.
 */
module.exports = async function every (array, callback) {
  const mapped = await map(array, callback)

  return mapped.every((value) => !!value)
}
