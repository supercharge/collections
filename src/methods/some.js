'use strict'

const map = require('./map')

/**
 * Asynchronous version of `Array#some()`. The function
 * tests whether at least one element in the `array`
 * passes the check implemented by the `callback`.
 *
 * @param {Array} array
 * @param {Function} callback
 *
 * @returns {Boolean}
 */
module.exports = async function some (array, callback) {
  const mapped = await map(array, callback)

  return mapped.some((value) => !!value)
}
