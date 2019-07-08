'use strict'

const map = require('./map')
const collapse = require('./collapse')

module.exports = async function flatMap (array, callback) {
  return collapse(
    await map(array, callback)
  )
}
