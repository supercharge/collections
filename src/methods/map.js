'use strict'

/**
 * Asynchronous version of Array#map(), running all transformations
 * in parallel. It runs the given `callback` on each item of the
 * `array` and returns an array of transformed items.
 *
 * @param {Array} array
 * @param {Function} callback
 *
 * @returns {Array} resulting array of transformed items
 */
module.exports = async function map (array, callback) {
  return Promise.all(array.map(callback))
}
