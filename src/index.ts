'use strict'

import { CollectionProxy } from './collection-proxy'

/**
 * Create a new collection for the given `items`. The `items`
 * argument can be a single value or an existing array.
 *
 * @param {*} items
 *
 * @returns {CollectionProxy}
 */
const collect = (collection: any): CollectionProxy => {
  return new CollectionProxy(collection)
}

export = collect
