'use strict'

import { SyncCollection } from './sync-collection'

/**
 * Create a new collection for the given `items`. The `items`
 * argument can be a single value or an existing array.
 *
 * @param {*} items
 *
 * @returns {SyncCollection}
 */
const collect = <T>(collection: T | T[]): SyncCollection<T> => {
  return new SyncCollection<T>(collection)
}

export = collect
