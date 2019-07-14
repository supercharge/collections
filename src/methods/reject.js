'use strict'

const map = require('./map')

/**
 * Text
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
