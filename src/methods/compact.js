'use strict'

const filter = require('./filter')

/**
 * Removes all falsey values from the given `array`.
 * Falsey values are `null`, `undefined`, `''`,
 * `false`, `0`, `NaN`.
 *
 * @param {Array} array
 *
 * @returns {Array}
 */
module.exports = function compact (array) {
  return filter(array, item => item)
}
