'use strict'

import { Collection } from './collection'
import Queue from '@supercharge/queue-datastructure'

export class CollectionProxy {
  /**
   * Stores the list of items in the collection.
   */
  private readonly items: any[]

  /**
   * Stores all operations on the collection until the values
   * should be returned. Then, the queued operations in
   * the call chain will be processed.
   */
  private readonly callChain: Queue

  /**
   *
   * @param items
   * @param callChain
   */
  constructor (items: any, callChain: any[] = []) {
    this.items = [].concat(items || [])
    this.callChain = new Queue(callChain)
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
  async any (callback: Function): Promise<boolean> {
    return this.some(callback)
  }

  /**
   * Returns the average of all collection items
   *
   * @returns {Number}
   */
  async avg (): Promise<number> {
    return this.enqueue('avg')
  }

  /**
   * Breaks the collection into multiple, smaller
   * collections of the given `size`.
   *
   * @param {Number} size
   *
   * @returns {CollectionProxy}
   */
  chunk (size: number): this {
    return this.enqueue('chunk', undefined, size)
  }

  /**
   * Creates a shallow clone of the collection.
   *
   * @returns {CollectionProxy}
   */
  clone (): CollectionProxy {
    return new CollectionProxy(
      this.items, this.callChain.items()
    )
  }

  /**
   * Collapse a collection of arrays into a single, flat collection.
   *
   * @returns {CollectionProxy}
   */
  collapse (): this {
    return this.enqueue('collapse')
  }

  /**
   * Removes all falsey values from the given `array`.
   * Falsey values are `null`, `undefined`, `''`,
   * `false`, `0`, `NaN`.
   *
   * @returns {CollectionProxy}
   */
  compact (): this {
    return this.enqueue('compact')
  }

  /**
   * Creates a new collection containing the concatenated items
   * of the original collection with the new `items`.
   *
   * @param {*} items
   *
   * @returns {CollectionProxy}
   */
  concat (...items: any[]): CollectionProxy {
    return this.clone().enqueue('concat', undefined, items)
  }

  /**
   * Counts the items in the collection. By default, it behaves like an alias
   * for the `size()` method counting each individual item. The `callback`
   * function allows you to count a subset of items in the collection.
   *
   * @param {Function} callback
   *
   * @returns {Number}
   */
  async count (callback?: Function): Promise<number> {
    return this.enqueue('count', callback).all()
  }

  /**
   * Removes all values from the collection that are present in the given array.
   *
   * @param {*} items
   *
   * @returns {CollectionProxy}
   */
  diff (items: any[]): this {
    return this.enqueue('diff', undefined, items)
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
  async every (callback: Function): Promise<boolean> {
    return this.enqueue('every', callback)
  }

  /**
   * Asynchronous version of Array#filter(), running the (async) testing
   * function in sequence. The `callback` should return `true`
   * if an item should be included in the resulting collection.
   *
   * @param {Function} callback
   *
   * @returns {Array}
   */
  filter (callback: Function): this {
    return this.enqueue('filter', callback)
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
  filterIf (condition: boolean, callback: Function): this {
    return this.enqueue('filterIf', callback, condition)
  }

  /**
   * Asynchronous version of Array#find(), running the (async) testing
   * function in sequence. Returns the first item in the collection
   * satisfying the given `callback`, `undefined` otherwise.
   *
   * @param {Function} callback
   *
   * @returns {*} the found value
   */
  async find (callback: Function): Promise<any> {
    return this.enqueue('find', callback)
  }

  /**
   * Alias for Array#find. Returns the first item in
   * the collection that satisfies the `callback`
   * testing function, `undefined` otherwise.
   *
   * @param {Function} callback
   *
   * @returns {*} the found value
   */
  async first (callback: Function): Promise<any> {
    return this.enqueue('first', callback).all()
  }

  /**
   * Flattens the collection one level deep.
   *
   * @returns {CollectionProxy}
   */
  flatten (): this {
    return this.enqueue('collapse')
  }

  /**
   * Asynchronous version of Array#flatMap(). It invokes the `callback`
   * on each collection item. The callback can modify and return the
   * item resulting in a new collection of modified items.
   * Ultimately, flatMap flattens the mapped results.
   *
   * @param {Function} callback
   *
   * @returns {CollectionProxy}
   */
  flatMap (callback: Function): this {
    return this.enqueue('flatMap', callback)
  }

  /**
   * Asynchrounous version of Array#forEach(), running the given
   * `callback` function on each `array` item in sequence.
   *
   * @param {Function} callback
   */
  async forEach (callback: Function): Promise<void> {
    return this.enqueue('forEach', callback).all()
  }

  /**
   * Group the collection items into arrays using the given `key`.
   *
   * @param {String} key
   *
   * @returns {Object}
   */
  async groupBy (key: string): Promise<any> {
    return this.enqueue('groupBy', undefined, key).all()
  }

  /**
   * Determines whether the the collection contains the item
   * represented by `callback` or if the collection
   * satisfies the given `callback` testing function.
   *
   * @param {Function} callback
   *
   * @returns {Boolean}
   */
  async has (callback: Function): Promise<boolean> {
    return this.enqueue('has', callback)
  }

  /**
   * Returns `true` when the collection contains duplicate items, `false` otherwise.
   *
   * @returns {Boolean}
   */
  async hasDuplicates (): Promise<boolean> {
    return this.enqueue('hasDuplicates')
  }

  /**
   * Creates an array of unique values that are included in both given array
   *
   * @param {Array} items
   *
   * @returns {Array}
   */
  intersect (items: any[]): this {
    return this.enqueue('intersect', undefined, items)
  }

  /**
   * Returns `true` when the collection is empty, `false` otherwise.
   *
   * @returns {Boolean}
   */
  async isEmpty (): Promise<boolean> {
    return this.enqueue('isEmpty')
  }

  /**
   * Returns `true` when the collection is not empty, `false` otherwise.
   *
   * @returns {Boolean}
   */
  async isNotEmpty (): Promise<boolean> {
    return this.enqueue('isNotEmpty')
  }

  /**
   * Returns a string by concatenating all of the items
   * in an array with the given `separator`.
   *
   * @param {String} separator
   *
   * @returns {String}
   */
  async join (separator: string): Promise<string> {
    return this.enqueue('join', undefined, separator)
  }

  /**
   * Returns the last item in the collection
   * that satisfies the `callback` testing
   * function, `undefined` otherwise.
   *
   * @param {Function} callback
   *
   * @returns {*} the found value
   */
  async last (callback: Function): Promise<any> {
    return this.enqueue('last', callback).all()
  }

  /**
   * Asynchronous version of Array#map(), running all transformations
   * in sequence. It runs the given `callback` on each item of
   * the `array` and returns an array of transformed items.
   *
   * @param {Function} callback
   *
   * @returns {Array}
   */
  map (callback: Function): this {
    return this.enqueue('map', callback)
  }

  /**
   * Returns the max value in the collection.
   *
   * @returns {Number}
   */
  async max (): Promise<number> {
    return this.enqueue('max')
  }

  /**
   * Returns median of the current collection
   *
   * @returns {Number}
   */
  async median (): Promise<number> {
    return this.enqueue('median')
  }

  /**
   * Returns the min value in the collection.
   *
   * @returns {Number}
   */
  async min (): Promise<number> {
    return this.enqueue('min')
  }

  /**
   * Retrieves all values for the given `keys`.
   *
   * @param {String|Array} keys
   *
   * @returns {Array}
   */
  pluck (keys: string|string[]): this {
    return this.enqueue('pluck', undefined, keys).collapse()
  }

  /**
   * Removes and returns the last item from the collection.
   *
   * @returns {*}
   */
  async pop (): Promise<any> {
    const collection = this.clone()

    this.splice(-1, 1)

    return collection.enqueue('pop')
  }

  /**
   * Add one or more items to the end of the collection.
   *
   * @param  {*} items
   *
   * @returns {CollectionProxy}
   */
  push (...items: any[]): this {
    return this.enqueue('push', undefined, items)
  }

  /**
   * Asynchronous version of Array#reduce(). It invokes the `reducer`
   * function sequentially on each `array` item. The reducer
   * transforms an accumulator value based on each item.
   *
   * @param {Function} reducer
   * @param {*} initial accumulator value
   *
   * @returns {*} resulting accumulator value
   */
  async reduce (reducer: Function, initial: any): Promise<any> {
    return this.enqueue('reduce', reducer, initial).all()
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
  async reduceRight (reducer: Function, initial: any): Promise<any> {
    return this.enqueue('reduceRight', reducer, initial).all()
  }

  /**
   * Inverse of Array#filter(), **removing** all items satisfying the `callback`
   * testing function. Processes each item in sequence. The callback should
   * return `true` if an item should be removed from the resulting collection.
   *
   * @param {Function} callback
   *
   * @returns {Array}
   */
  reject (callback: Function): this {
    return this.enqueue('reject', callback)
  }

  /**
  * Returns a reversed collection. The first item becomes the last one,
  * the second item becomes the second to last, and so on.
  *
  * @returns {CollectionProxy}
  */
  reverse (): CollectionProxy {
    return this.clone().enqueue('reverse')
  }

  /**
   * Removes and returns the first item from the collection.
   *
   * @returns {*}
   */
  async shift (): Promise<any> {
    const collection = this.clone()

    this.splice(0, 1)

    return collection.enqueue('shift').all()
  }

  /**
   * Returns the number of items in the collection.
   *
   * @returns {Number}
   */
  async size (): Promise<number> {
    return this.enqueue('size').all()
  }

  /**
   * Returns a chunk of items beginning at the `start`
   * index without removing them from the collectin.
   * You can `limit` the size of the slice.
   *
   * @param {Number} start
   * @param {Number} limit
   *
   * @returns {CollectionProxy}
   */
  slice (start: number, limit?: number): this {
    return this.enqueue('slice', undefined, { start, limit })
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
   * @returns {CollectionProxy}
   */
  splice (start: number, limit: number, ...inserts: any[]): CollectionProxy {
    const collection = this.clone().slice(start, limit)

    this.enqueue('splice', undefined, { start, limit, inserts })

    return collection
  }

  /**
   * Asynchronous version of `Array#some()`, running the (async) testing function
   * in sequence. Returns `true` if at least one element in the collection
   * passes the check implemented by the `callback`, otherwise `false`.
   *
   * @param {Function} callback
   *
   * @returns {Boolean}
   */
  async some (callback: Function): Promise<boolean> {
    return this.enqueue('some', callback).all()
  }

  /**
   * Returns a sorted list of all collection items, with an optional comparator
   *
   * @param {Function} comparator
   *
   * @returns {CollectionProxy}
   */
  sort (comparator: Function): CollectionProxy {
    return this.clone().enqueue('sort', comparator)
  }

  /**
   * Returns the sum of all collection items.
   *
   * @returns {Number} resulting sum of collection items
   */
  async sum (): Promise<number> {
    return this.enqueue('sum').all()
  }

  /**
   * Take `limit` items from the beginning
   * or end of the collection.
   *
   * @param {Number} limit
   *
   * @returns {CollectionProxy}
   */
  take (limit: number): CollectionProxy {
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
   * @returns {CollectionProxy}
   */
  takeAndRemove (limit: number): CollectionProxy {
    const collection = this.take(limit)

    this.enqueue('takeAndRemove', undefined, limit)

    return collection
  }

  /**
   * Tap into the chain, run the given `callback` and retreive the original value.
   *
   * @returns {CollectionProxy}
   */
  tap (callback: Function): this {
    return this.enqueue('tap', callback)
  }

  /**
   * Returns JSON representation of collection
   *
   * @returns {String}
   */
  async toJSON (): Promise<string> {
    return this.enqueue('toJSON').all()
  }

  /**
   * Creates an array of unique values, in order, from all given arrays.
   *
   * @param {Array} items
   *
   * @returns {CollectionProxy}
   */
  union (items: any): CollectionProxy {
    return this.concat(items).unique()
  }

  /**
   * Returns all the unique items in the collection.
   *
   * @param {String|Function}
   *
   * @returns {CollectionProxy}
   */
  unique (key?: string|Function): this {
    return this.enqueue('unique', undefined, key)
  }

  /**
   * Add one or more items to the beginning of the collection.
   *
   * @returns {*}
   */
  unshift (...items: any[]): this {
    return this.enqueue('unshift', undefined, items)
  }

  /**
   * Enqueues an operation in the collection pipeline
   * for processing at a later time.
   *
   * @param {String} method
   * @param {Function} callback
   * @param {*} data
   *
   * @returns {CollectionProxy}
   */
  private enqueue (method: string, callback?: Function, data?: any): this {
    this.callChain.enqueue({ method, callback, data })

    return this
  }

  /**
   * Creates a “thenable” allowing you to await collection
   * pipelines instead of appending a `.all()` call.
   *
   * @param {Function} onFullfilled
   *
   * @returns {*}
   */
  async then (onFullfilled: (value: any) => any, onRejected: (value: any) => any): Promise<void> {
    try {
      onFullfilled(
        await this.all()
      )
    } catch (error) {
      onRejected(error)
    }
  }

  /**
   * Processes the collection pipeline and returns
   * all items in the collection.
   *
   * @returns {*}
   */
  async all (): Promise<any> {
    let collection: any = new Collection(this.items)

    while (this.callChain.isNotEmpty()) {
      try {
        const { method, callback, data } = this.callChain.dequeue()
        collection = await (
          callback
            ? collection[method](callback, data)
            : collection[method](data)
        )

        if (collection instanceof Array) {
          collection = new Collection(collection)
        }
      } catch (error) {
        this.callChain.clear()
        throw error
      }
    }

    if (collection instanceof Collection) {
      return collection.all()
    }

    return collection
  }
}
