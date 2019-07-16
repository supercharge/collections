'use strict'

const CollectionProxy = require('./src/collection-proxy')

const collect = collection => {
  return new CollectionProxy(collection)
}

module.exports = collect
module.exports.default = collect
