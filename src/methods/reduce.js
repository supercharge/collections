'use strict'

/**
 * Asynchronous version of Array#reduce(). It invokes the `reducer`
 * function sequentially on each `array` item. The reducer
 * transforms an accumulator value based on each item.
 *
 * @param {Array} array
 * @param {Function} reducer
 * @param {*} initial accumulator value
 *
 * @returns {*} resulting accumulator value
 */
module.exports = async function reduce (array, reducer, accumulator) {
  for (const index in array) {
    accumulator = await reducer(accumulator, array[index], index, array)
  }

  return accumulator
}
