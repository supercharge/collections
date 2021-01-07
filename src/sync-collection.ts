'use strict'

import { isAsyncFunction, tap } from '@supercharge/goodies'
import { PendingAsyncCollection } from './pending-async-collection'

export class SyncCollection<T> {
  /**
   * Stores the list of items in the collection.
   */
  private readonly items: T[]

  /**
   *
   * @param items
   * @param callChain
   */
  constructor (items: T | T[]) {
    this.items = ([] as T[]).concat(items || [])
  }

  /**
   * Returns the array of items.
   *
   * @returns {Array}
   */
  all (): T[] {
    return this.items
  }

  /**
   * Alias for the `.some` method. This function determines
   * whether any item in the `array` passes the truth test
   * implemented by the given `callback` function.
   *
   * @param {Function} callback
   *
   * @returns {Boolean}
   */
  any (callback: (value: T, index: number, items: T[]) => Promise<unknown>): Promise<boolean>
  any (callback: (value: T, index: number, items: T[]) => unknown): boolean
  any (callback: (value: T, index: number, items: T[]) => unknown): any {
    return this.some(callback)
  }

  /**
   * Returns the average of all collection items
   *
   * @returns {Number}
   */
  avg (): number {
    return this.sum() / this.size()
  }

  /**
   * Breaks the collection into multiple, smaller collections of the given `size`.
   *
   * @param {Number} size
   *
   * @returns {SyncCollection}
   */
  chunk (size: number): SyncCollection<T[]> {
    const chunks = new SyncCollection<T[]>([])

    while (this.size()) {
      chunks.push(
        this.items.splice(0, size)
      )
    }

    return chunks
  }

  /**
   * Creates a shallow clone of the collection.
   *
   * @returns {SyncCollection}
   */
  clone (): SyncCollection<T> {
    return new SyncCollection<T>(this.items)
  }

  /**
   * Collapse a collection of arrays into a single, flat collection.
   *
   * @returns {SyncCollection}
   */
  collapse (): SyncCollection<T> {
    return new SyncCollection<T>(
      ([] as T[]).concat(...this.items)
    )
  }

  /**
   * Removes all falsy values from the given `array`. Falsy values
   * are `null`, `undefined`, `''`, `false`, `0`, `-0`, `0n`, `NaN`.
   *
   * @returns {SyncCollection}
   */
  compact (): SyncCollection<T> {
    return this.filter((item: T) => {
      return !!item
    })
  }

  /**
   * Creates a new collection containing the concatenated items
   * of the original collection with the new `items`.
   *
   * @param {*} items
   *
   * @returns {SyncCollection}
   */
  concat (...items: T[]): SyncCollection<T> {
    return new SyncCollection<T>(
      this.clone().all().concat(...items)
    )
  }

  /**
   * Counts the items in the collection. By default, it behaves like an alias
   * for the `size()` method counting each individual item. The `callback`
   * function allows you to count a subset of items in the collection.
   *
   * @param {Function} predicate
   *
   * @returns {Number}
   */
  count (predicate?: (item: T, index: number) => unknown): number
  count (predicate?: (item: T, index: number) => Promise<unknown>): Promise<number>
  count (predicate?: (item: T, index: number) => unknown): any {
    if (!predicate) {
      return this.size()
    }

    return isAsyncFunction(predicate)
      ? this.proxy('count', predicate).all()
      : this.filter(predicate).size()
  }

  /**
   * Removes all values from the collection that are present in the given array.
   *
   * @param {*} items
   *
   * @returns {SyncCollection}
   */
  diff (items: T[]): SyncCollection<T> {
    return new SyncCollection<T>(
      this.items.filter((item: any) => {
        return !items.includes(item)
      })
    )
  }

  /**
   * Asynchronous version of `Array#every()`, running the (async) testing
   * function in sequence. Returns `true` if all items in the collection
   * pass the check implemented by the `callback`, otherwise `false`.
   *
   * @param {Function} callback
   *
   * @returns {Boolean} Returns `true` if all items pass the predicate check, `false` otherwise.
   */
  every (predicate: (value: T, index: number, items: T[]) => unknown): boolean
  every (predicate: (value: T, index: number, items: T[]) => Promise<unknown>): Promise<boolean>
  every (predicate: (value: T, index: number, items: T[]) => unknown): any {
    return isAsyncFunction(predicate)
      ? this.proxy('every', predicate)
      : this.items.every(predicate)
  }

  /**
   * Asynchronous version of Array#filter(), running the (async) testing
   * function in sequence. The `callback` should return `true`
   * if an item should be included in the resulting collection.
   *
   * @param {Function} predicate
   *
   * @returns {Array}
   */
  filter (predicate: (value: T, index: number, items: T[]) => Promise<unknown>): PendingAsyncCollection<T>
  filter (predicate: (value: T, index: number, items: T[]) => unknown): SyncCollection<T>
  filter (predicate: (value: T, index: number, items: T[]) => any): SyncCollection<T> | PendingAsyncCollection<T> {
    return isAsyncFunction(predicate)
      ? this.proxy('filter', predicate)
      : new SyncCollection<T>(
        this.items.filter(predicate)
      )
  }

  /**
   * A variant of the `filter` method running the (async) testing
   * function only if the given `condition` is `true`.
   *
   * @param {Boolean} condition
   * @param {Function} callback
   *
   * @returns {Array}
   */
  filterIf (condition: boolean, predicate: (value: T, index: number, items: T[]) => Promise<unknown>): PendingAsyncCollection<T>
  filterIf (condition: boolean, predicate: (value: T, index: number, items: T[]) => unknown): this
  filterIf (condition: boolean, predicate: (value: T, index: number, items: T[]) => any): any {
    if (isAsyncFunction(predicate)) {
      return this.proxy('filterIf', predicate, condition)
    }

    return condition
      ? this.filter(predicate)
      : this
  }

  /**
   * Asynchronous version of Array#find(), running the (async) testing
   * function in sequence. Returns the first item in the collection
   * satisfying the given `callback`, `undefined` otherwise.
   *
   * @param {Function} predicate
   *
   * @returns {*} the found value
   */
  find (predicate: (value: T, index: number, items: T[]) => T): T
  find (predicate: (value: T, index: number, items: T[]) => Promise<T>): Promise<T>
  find (predicate: (value: T, index: number, items: T[]) => any): any {
    return isAsyncFunction(predicate)
      ? this.proxy('find', predicate).all()
      : this.items.find(predicate)
  }

  /**
   * Returns the first item in the collection. This method behaves like
   * Array#find if you provide a `predicate` function.
   *
   * @param {Function} predicate
   *
   * @returns {*} the found value
   */
  first (predicate?: (value: T, index: number, items: T[]) => T): T
  first (predicate?: (value: T, index: number, items: T[]) => Promise<T>): PendingAsyncCollection<T>
  first (predicate?: (value: T, index: number, items: T[]) => any): any {
    if (!predicate) {
      return this.items[0]
    }

    return isAsyncFunction(predicate)
      ? this.proxy('first', predicate).all()
      : this.find(predicate)
  }

  /**
   * Flattens the collection one level deep.
   *
   * @returns {SyncCollection}
   */
  flatten (): SyncCollection<T> {
    return this.collapse()
  }

  /**
   * Asynchronous version of Array#flatMap(). It invokes the `action` callback
   * on each collection item. The callback can modify and return the item
   * resulting in a new collection of modified items. At the end,
   * flatMap flattens the mapped results.
   *
   * @param {Function} action
   *
   * @returns {SyncCollection}
   */
  flatMap<R> (action: (value: T, index: number, items: T[]) => R): SyncCollection<R>
  flatMap<R> (action: (value: T, index: number, items: T[]) => Promise<R>): PendingAsyncCollection<R>
  flatMap (action: (value: T, index: number, items: T[]) => any): any {
    return isAsyncFunction(action)
      ? this.proxy('flatMap', action)
      : this.map(action).collapse()
  }

  /**
   * Asynchrounous version of Array#forEach(), running the given
   * `action` function on each `array` item in sequence.
   *
   * @param {Function} action
   */
  forEach (action: (value: T, index: number, items: T[]) => void): void
  forEach (action: (value: T, index: number, items: T[]) => Promise<void>): Promise<void>
  forEach (action: (value: T, index: number, items: T[]) => any): any {
    return isAsyncFunction(action)
      ? this.proxy('forEach', action).all()
      : this.items.forEach(action)
  }

  /**
   * Group the collection items into arrays using the given `key`.
   *
   * @param {String} key
   *
   * @returns {Object}
   */
  groupBy (key: string): any {
    if (key.includes('.')) {
      throw new Error('We do not support nested grouping yet. Please send a PR for that feature?')
    }

    return this.reduce((carry: any, item: any) => {
      const group = item[key] || ''

      if (carry[group] === undefined) {
        carry[group] = []
      }

      carry[group].push(item)

      return carry
    }, {})
  }

  /**
   * Determines whether the the collection contains the item
   * represented by `callback` or if the collection
   * satisfies the given `callback` testing function. Alias of `includes`.
   *
   * @param {Function} predicate
   *
   * @returns {Boolean}
   */
  has (predicate: (value: T, index: number, items: T[]) => any): boolean
  has (predicate: (value: T, index: number, items: T[]) => Promise<any>): Promise<boolean>
  has (predicate: (value: T, index: number, items: T[]) => any): any {
    if (isAsyncFunction(predicate)) {
      return this.proxy('has', predicate)
    }

    return typeof predicate === 'function'
      ? !!this.find(predicate)
      : !!this.items.find((item: any) => {
        return item === predicate
      })
  }

  /**
   * Returns `true` when the collection contains duplicate items, `false` otherwise.
   *
   * @returns {Boolean}
   */
  hasDuplicates (): boolean {
    return (new Set(this.items)).size !== this.size()
  }

  /**
   * Determines whether the the collection contains the item
   * represented by `callback` or if the collection
   * satisfies the given `callback` testing function. Alias of `has`.
   *
   * @param {Function} predicate
   *
   * @returns {Boolean}
   */
  includes (predicate: (value: T, index: number, items: T[]) => any): boolean
  includes (predicate: (value: T, index: number, items: T[]) => Promise<any>): Promise<boolean>
  includes (predicate: (value: T, index: number, items: T[]) => any): any {
    return this.has(predicate)
  }

  /**
   * Creates an array of unique values that are included in both given array
   *
   * @param {Array} items
   *
   * @returns {Array}
   */
  intersect (items: T[]): SyncCollection<T> {
    return new SyncCollection([
      ...new Set(
        this.items.filter(value => items.includes(value))
      )]
    )
  }

  /**
   * Returns `true` when the collection is empty, `false` otherwise.
   *
   * @returns {Boolean}
   */
  isEmpty (): boolean {
    return this.size() === 0
  }

  /**
   * Returns `true` when the collection is not empty, `false` otherwise.
   *
   * @returns {Boolean}
   */
  isNotEmpty (): boolean {
    return !this.isEmpty()
  }

  /**
   * Returns a string by concatenating all of the items
   * in an array with the given `separator`.
   *
   * @param {String} separator
   *
   * @returns {String}
   */
  join (separator: string): string {
    return this.items.join(separator)
  }

  /**
   * Returns the last item in the collection that satisfies the
   * `predicate` testing function, `undefined` otherwise.
   *
   * @param {Function} callback
   *
   * @returns {*} the found value
   */
  last (predicate?: (value: T, index: number, items: T[]) => T): T
  last (predicate?: (value: T, index: number, items: T[]) => Promise<T>): Promise<T>
  last (predicate?: (value: T, index: number, items: T[]) => any): any {
    if (!predicate) {
      return this.items[this.size() - 1]
    }

    return isAsyncFunction(predicate)
      ? this.proxy('last', predicate).all()
      : this.filter(predicate).last()
  }

  /**
   * Asynchronous version of Array#map(), running all transformations
   * in sequence. It runs the given `callback` on each item of
   * the `array` and returns an array of transformed items.
   *
   * @param {Function} action
   *
   * @returns {Array}
   */
  map<R> (action: (value: T, index: number, items: T[]) => R): SyncCollection<R>
  map<R> (action: (value: T, index: number, items: T[]) => Promise<R>): PendingAsyncCollection<R>
  map (action: (value: T, index: number, items: T[]) => any): any {
    return isAsyncFunction(action)
      ? this.proxy('map', action)
      : new SyncCollection<T>(
        this.items.map(action)
      )
  }

  /**
   * Returns the max value in the collection.
   *
   * @returns {Number}
   */
  max (): number {
    return Math.max(
      ...this.items as any[]
    )
  }

  /**
   * Returns median of the current collection
   *
   * @returns {Number}
   */
  median (): number {
    const collection = this.sort((a: any, b: any) => a - b)

    const mid: number = Math.floor(collection.size() / 2)

    return collection.size() % 2 === 1
      ? (collection.all() as any[])[mid]
      : ((collection.all() as any[])[mid] + ((collection.all() as any[])[mid - 1])) / 2 // eslint-disable-line
  }

  /**
   * Returns the min value in the collection.
   *
   * @returns {Number}
   */
  min (): number {
    return Math.min(
      ...this.items as any[]
    )
  }

  /**
   * Retrieves all values for the given `keys`.
   *
   * @param {String|Array} keys
   *
   * @returns {Array}
   */
  pluck (keys: string|string[]): SyncCollection<T> {
    keys = ([] as any[]).concat(keys)

    return keys.length === 1
      ? this.pluckOne(keys[0])
      : this.pluckMany(keys)
  }

  /**
 * Retrieves all values for a single `key`.
 *
 * @param {String} key
 *
 * @returns {Array}
 */
  pluckOne (key: string): SyncCollection<T> {
    return this.map((item: any) => {
      return item[key]
    })
  }

  /**
   * Retrieves all values as an array of objects where
   * each object contains the given `keys`.
   *
   * @param {Array} keys
   *
   * @returns {Array}
   */
  pluckMany (keys: string[]): SyncCollection<T> {
    return this.map((item: any) => {
      const result: any = {}

      keys.forEach(key => {
        result[key] = item[key]
      })

      return result
    })
  }

  /**
   * Removes and returns the last item from the collection.
   *
   * @returns {*}
   */
  pop (): T {
    return tap(this.clone().last(), () => {
      this.items.pop()
    })
  }

  /**
   * Add one or more items to the end of the collection.
   *
   * @param  {*} items
   *
   * @returns {SyncCollection}
   */
  push (...items: T[]): this {
    return tap(this, () => {
      this.items.push(...items)
    })
  }

  /**
   * Asynchronous version of Array#reduce(). It invokes the `reducer`
   * function sequentially on each `array` item. The reducer
   * transforms an accumulator value based on each item.
   *
   * @param {Function} reducer
   * @param {*} accumulator
   *
   * @returns {*} resulting accumulator value
   */
  reduce<R> (reducer: (carry: R, currentValue: T, currentIndex?: number, items?: T[]) => R, accumulator: R): R
  reduce<R> (reducer: (carry: R, currentValue: T, currentIndex?: number, items?: T[]) => Promise<R>, accumulator: R): Promise<R>
  reduce (reducer: (carry: any, currentValue: T, currentIndex?: number, items?: T[]) => any, accumulator: any): any {
    if (isAsyncFunction(reducer)) {
      return this.proxy('reduce', reducer, accumulator).all()
    }

    this.forEach((item: any, index: number) => {
      accumulator = reducer(accumulator, item, index, this.items)
    })

    return accumulator
  }

  /**
   * Asynchronous version of Array#reduceRight(). It invokes the `reducer`
   * function sequentially on each `array` item, from right-to-left. The
   * reducer transforms an accumulator value based on each item.
   *
   * @param {Function} reducer
   * @param {*} initial accumulator value
   *
   * @returns {*} resulting accumulator value
   */
  reduceRight<R> (reducer: (carry: R, currentValue: T, currentIndex: number, items: T[]) => Promise<R>, accumulator: R): Promise<R>
  reduceRight<R> (reducer: (carry: R, currentValue: T, currentIndex: number, items: T[]) => R, accumulator: R): R
  reduceRight<R> (reducer: (carry: R, currentValue: T, currentIndex: number, items: T[]) => R, accumulator: R): any {
    if (isAsyncFunction(reducer)) {
      return this.proxy('reduceRight', reducer, accumulator).all()
    }

    let index = this.items.length

    while (index--) {
      accumulator = reducer(accumulator, this.items[index], index, this.items)
    }

    return accumulator
  }

  /**
   * Inverse of Array#filter(), **removing** all items satisfying the `callback`
   * testing function. Processes each item in sequence. The callback should
   * return `true` if an item should be removed from the resulting collection.
   *
   * @param {Function} predicate
   *
   * @returns {Array}
   */
  reject (predicate: (value: T, index: number, items: T[]) => Promise<unknown>): PendingAsyncCollection<T>
  reject (predicate: (value: T, index: number, items: T[]) => unknown): SyncCollection<T>
  reject (predicate: (value: T, index: number, items: T[]) => any): any {
    if (isAsyncFunction(predicate)) {
      return this.proxy('reject', predicate)
    }

    return this.filter((item, index, items) => {
      return !predicate(item, index, items)
    })
  }

  /**
  * Returns a reversed collection. The first item becomes the last one,
  * the second item becomes the second to last, and so on.
  *
  * @returns {SyncCollection}
  */
  reverse (): SyncCollection<T> {
    return new SyncCollection(
      this.clone().all().reverse()
    )
  }

  /**
   * Removes and returns the first item from the collection.
   *
   * @returns {*}
   */
  shift (): T {
    return tap(this.clone().first(), () => {
      this.items.shift()
    })
  }

  /**
   * Returns the number of items in the collection.
   *
   * @returns {Number}
   */
  size (): number {
    return this.items.length
  }

  /**
   * Returns a chunk of items beginning at the `start`
   * index without removing them from the collectin.
   * You can `limit` the size of the slice.
   *
   * @param {Number} start
   * @param {Number} limit
   *
   * @returns {SyncCollection}
   */
  slice (start: number, limit?: number): SyncCollection<T> {
    return new SyncCollection<T>(
      this.items
        .slice(start)
        .slice(0, limit)
    )
  }

  /**
   * Removes and returns a chunk of items beginning at the `start`
   * index. You can `limit` the size of the slice. You may also
   * replace the removed chunk with new items.
   *
   * @param {Number} start
   * @param {Number} limit
   * @param  {Array} inserts
   *
   * @returns {SyncCollection}
   */
  splice (start: number, limit?: number, ...inserts: T[]): SyncCollection<T> {
    const flattend = Array.prototype.concat(...inserts)

    return new SyncCollection(
      this.items.splice(start, limit ?? this.size(), ...flattend)
    )
  }

  /**
   * Asynchronous version of `Array#some()`, running the (async) testing function
   * in sequence. Returns `true` if at least one element in the collection
   * passes the check implemented by the `callback`, otherwise `false`.
   *
   * @param {Function} predicate
   *
   * @returns {Boolean}
   */
  some (predicate: (value: T, index: number, items: T[]) => Promise<unknown>): Promise<boolean>
  some (predicate: (value: T, index: number, items: T[]) => unknown): boolean
  some (predicate: (value: T, index: number, items: T[]) => unknown): any {
    return isAsyncFunction(predicate)
      ? this.proxy('some', predicate).all()
      : this.items.some(predicate)
  }

  /**
   * Returns a sorted list of all collection items, with an optional comparator
   *
   * @param {Function} comparator
   *
   * @returns {SyncCollection}
   */
  sort (comparator: (a: T, b: T) => number): SyncCollection<T> {
    return new SyncCollection<T>(
      this.clone().all().sort(comparator)
    )
  }

  /**
   * Returns the sum of all collection items.
   *
   * @returns {Number} resulting sum of collection items
   */
  sum (): number {
    return new SyncCollection<number>(
      this.items as any[]
    ).reduce((carry: number, item: number) => {
      return carry + item
    }, 0)
  }

  /**
   * Take `limit` items from the beginning
   * or end of the collection.
   *
   * @param {Number} limit
   *
   * @returns {SyncCollection}
   */
  take (limit: number): SyncCollection<T> {
    const collection = this.clone()

    return limit < 0
      ? collection.slice(limit)
      : collection.slice(0, limit)
  }

  /**
   * Take and remove `limit` items from the
   * beginning or end of the collection.
   *
   * @param {Number} limit
   *
   * @returns {SyncCollection}
   */
  takeAndRemove (limit: number): SyncCollection<T> {
    return limit < 0
      ? this.splice(limit)
      : this.splice(0, limit)
  }

  /**
   * Tap into the chain, run the given `callback` and retreive the original value.
   *
   * @returns {SyncCollection}
   */
  tap (_callback: (item: T) => void): this {
    // return this.proxy('tap', callback)
    // TODO

    return this
  }

  /**
   * Returns JSON representation of collection
   *
   * @returns {String}
   */
  toJSON (): string {
    return JSON.stringify(this.items)
  }

  /**
   * Creates an array of unique values, in order, from all given arrays.
   *
   * @param {Array} items
   *
   * @returns {SyncCollection}
   */
  union (items: T[]): SyncCollection<T> {
    return this.concat(...items).unique()
  }

  /**
   * Returns all the unique items in the collection.
   *
   * @param {String|Function}
   *
   * @returns {SyncCollection}
   */
  unique (key?: string | Function): SyncCollection<T> {
    if (key) {
      return this.uniqueBy(
        this.valueRetriever(key)
      )
    }

    return new SyncCollection<T>(
      Array.from(
        new Set(this.items)
      )
    )
  }

  /**
   * Returns all unique items in the collection identified by the given `selector`.
   *
   * @param {Function}
   *
   * @returns {SyncCollection}
   */
  uniqueBy (selector: (item: T) => unknown): SyncCollection<T>
  uniqueBy (selector: (item: T) => unknown | Promise<unknown>): PendingAsyncCollection<T>
  uniqueBy (selector: (item: T) => any): any {
    if (isAsyncFunction(selector)) {
      return this.proxy('uniqueBy', selector)
    }

    const exists = new Set()

    return this.reject((item: any) => {
      const id = selector(item)

      if (exists.has(id)) {
        return true
      }

      exists.add(id)
    })
  }

  /**
   * Create a value receiving callback.
   *
   * @param {*} value
   *
   * @returns {Function}
   */
  private valueRetriever (value: any): (item: any) => any {
    return typeof value === 'function'
      ? value
      : function (item: any) {
        return item[value]
      }
  }

  /**
   * Add one or more items to the beginning of the collection.
   *
   * @returns {SyncCollection}
   */
  unshift (...items: T[]): this {
    return tap(this, () => {
      this.items.unshift(...items)
    })
  }

  /**
   * Enqueues an operation in the collection pipeline
   * for processing at a later time.
   *
   * @param {String} method
   * @param {Function} callback
   * @param {*} data
   *
   * @returns {SyncCollection}
   */
  private proxy (method: string, callback?: Function, data?: any): PendingAsyncCollection<T> {
    return new PendingAsyncCollection<T>(
      this.items
    ).enqueue(method, callback, data)
  }
}
