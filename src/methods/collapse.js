'use strict'

/**
 * Collapse a collection of arrays into a single, flat collection.
 *
 * @param {Array} array
 *
 * @returns {Array}
 */
module.exports = function collapse (array) {
  return [].concat(...array)
}
