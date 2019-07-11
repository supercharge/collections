'use strict'

const Collection = require('./src/collection')

const collect = collection => {
  return new Collection(collection)
}

module.exports = collect
module.exports.default = collect
