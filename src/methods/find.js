'use strict'

const map = require('./map')

/**
 * Asynchronous version of Array#find(). Returns the first
 * item in the `array` that satisfies the `callback`
 * testing function, `undefined` otherwise.
 *
 * @param {Array} array
 * @param {Function} callback
 *
 * @returns {*} the found value
 */
module.exports = async function find (array, callback) {
  const mapped = await map(array, callback)

  return array.find((_, i) => mapped[i])
}
