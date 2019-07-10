'use strict'

/**
 * Asynchronous version of Array#reduceRight(). It invokes the `reducer`
 * function sequentially on each `array` item, from right-to-left. The
 * reducer transforms an accumulator value based on each item.
 *
 * @param {Array} array
 * @param {Function} reducer
 * @param {*} initial accumulator value
 *
 * @returns {*} resulting accumulator value
 */
module.exports = async function reduceRight (array, reducer, accumulator) {
  let index = array.length

  while (index--) {
    accumulator = await reducer(accumulator, array[index], index, array)
  }

  return accumulator
}
