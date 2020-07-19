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
const collect = <T>(collection: T[]): CollectionProxy<T> => {
  return new CollectionProxy<T>(collection)
}

export = collect
