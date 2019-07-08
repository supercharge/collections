'use strict'

// const mapSeries = require('./mapSeries')

/**
 * Asynchronous version of Array#forEach(), running all
 * transformations in sequence. It runs the given
 * `callback` on each item of the `array`.
 *
 * @param {Array} array
 * @param {Function} callback
 */
module.exports = async function forEachSeries (array, callback) {
  for (const index in array) {
    await callback(array[index], index, array)
  }
}
