'use strict'

const Collection = require('./src/collection')

module.exports = function collect (...args) {
  return new Collection(...args)
}
