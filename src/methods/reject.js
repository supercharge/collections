'use strict'

const map = require('./map')

/**
 * Inverse of Array#filter(), removing all items from the array that satisfy
 * the `callback` testing function. The callback should return `true`
 * if an item should be removed from the resulting collection.
 *
 * @param {Array} array
 * @param {Function} callback
 *
 * @returns {Array} resulting array of filtered items
 */
module.exports = async function reject (array, callback) {
  const mapped = await map(array, callback)

  return array.filter((_, i) => !mapped[i])
}
