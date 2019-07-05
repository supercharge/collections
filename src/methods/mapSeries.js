'use strict'

/**
 * Asynchronous version of Array#map(), running all transformations
 * in sequence. It runs the given `callback` on each item of
 * the `array` and returns an array of transformed items.
 *
 * @param {Array} array
 * @param {Function} callback
 *
 * @returns {Array} resulting array of transformed items
 */
module.exports = async function mapSeries (array, callback) {
  const results = []

  for (const index in array) {
    results.push(
      await callback(array[index], index, array)
    )
  }

  return results
}
