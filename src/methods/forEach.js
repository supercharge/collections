'use strict'

const map = require('./map')

/**
 * Asynchrounous version of Array#forEach(). It runs the given
 * `callback` function on each `array` item. The callback
 * receives the current array item as a parameter.
 *
 * @param {Array} array
 * @param {Function} callback
 */
module.exports = async function forEach (array, callback) {
  await map(array, callback)
}
