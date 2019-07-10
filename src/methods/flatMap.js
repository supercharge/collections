'use strict'

const map = require('./map')
const collapse = require('./collapse')

/**
 * Asynchronous version of Array#flatMap(). It invokes the `callback`
 * on each collection item. The callback can modify and return the
 * item resulting in a new collection of modified items.
 * Ultimately, flatMap flattens the mapped results.
 *
 * @param {Array} array
 * @param {Function} callback
 *
 * @returns {Array}
 */
module.exports = async function flatMap (array, callback) {
  return collapse(
    await map(array, callback)
  )
}
