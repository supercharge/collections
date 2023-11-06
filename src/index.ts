'use strict'

import { PendingAsyncCollection } from './pending-async-collection.js'

/**
 * Create a new collection for the given `items`. The `items`
 * argument can be a single value or an existing array.
 *
 * @param {*} items
 *
 * @returns {PendingAsyncCollection}
 */
const collect = <T>(collection?: T | T[]): PendingAsyncCollection<T> => {
  return new PendingAsyncCollection<T>(
    ([] as T[]).concat(collection ?? [])
  )
}

export default collect
export const Collect = collect
