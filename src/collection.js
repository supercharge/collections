'use strict'

const Chainable = require('./chainable')

module.exports = function collection (...args) {
  return new Chainable(...args)
}
