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
   * Alias for the `.someSeries` method. This function determines
   * whether any item in the `array` passes the truth test
   * implemented by the given `callback` function.
   *
   * @param {Function} callback
   *
   * @returns {Boolean}
   */
  async anySeries (callback: Function): Promise<boolean> {
    return this.someSeries(callback)
  }

  /**
   * Returns the average of all collection items
   *
   * @returns {Number}
   */
  async avg (): Promise<number> {
    return this.all(
      this._enqueue('avg')
    )
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
    return this._enqueue('chunk', undefined, size)
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
    return this._enqueue('collapse')
  }

  /**
   * Removes all falsey values from the given `array`.
   * Falsey values are `null`, `undefined`, `''`,
   * `false`, `0`, `NaN`.
   *
   * @returns {CollectionProxy}
   */
  compact (): this {
    return this._enqueue('compact')
  }

  /**
   * Creates a new collection containing the
   * concatenated items of the original
   * collection with the new `items`.
   *
   * @param {*} items
   *
   * @returns {CollectionProxy}
   */
  concat (...items: any[]): CollectionProxy {
    return this.clone()._enqueue('concat', undefined, items)
  }

  /**
   * Removes all values from the collection that are present in the given array.
   *
   * @param {*} items
   *
   * @returns {CollectionProxy}
   */
  diff (items: any[]): this {
    return this._enqueue('diff', undefined, items)
  }

  /**
   * Asynchrounous version of Array#every(). Checks whether
   * the `callback` returns `true` for all items in the
   * array. Runs all checks in parallel.
   *
   * @param {Function} callback
   *
   * @returns {Boolean} Returns `true` if all items pass the predicate check, `false` otherwise.
   */
  async every (callback: Function): Promise<boolean> {
    return this.all(
      this._enqueue('every', callback)
    )
  }

  /**
   * Asynchronous version of `Array#every()`, running the (async) testing function
   * **in sequence**. Returns `true` if all items in the collection pass the
   * check implemented by the `callback`, otherwise `false`.
   *
   * @param {Function} callback
   *
   * @returns {Boolean} Returns `true` if all items pass the predicate check, `false` otherwise.
   */
  async everySeries (callback: Function): Promise<boolean> {
    return this.all(
      this._enqueue('everySeries', callback)
    )
  }

  /**
   * Asynchronous version of Array#filter(). The `callback`
   * testing function should return `true` if an item
   * should be included in the resulting collection.
   *
   * @param {Function} callback
   *
   * @returns {CollectionProxy}
   */
  filter (callback: Function): this {
    return this._enqueue('filter', callback)
  }

  /**
   * Asynchronous version of Array#filter(), running the (async) testing
   * function **in series**. The `callback` should return `true`
   * if an item should be included in the resulting collection.
   *
   * @param {Function} callback
   *
   * @returns {CollectionProxy}
   */
  filterSeries (callback: Function): this {
    return this._enqueue('filterSeries', callback)
  }

  /**
   * Asynchronous version of Array#find(). Returns the first
   * item in the collection that satisfies the `callback`
   * testing function, `undefined` otherwise.
   *
   * @param {Function} callback
   *
   * @returns {*} the found value
   */
  async find (callback: Function): Promise<any> {
    return this.all(
      this._enqueue('find', callback)
    )
  }

  /**
   * Asynchronous version of Array#find(), running the (async) testing
   * function **in sequence**. Returns the first item in the
   * collection that satisfying the check, `undefined` otherwise.
   *
   * @param {Function} callback
   *
   * @returns {*} the found value
   */
  async findSeries (callback: Function): Promise<any> {
    return this.all(
      this._enqueue('findSeries', callback)
    )
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
    return this.all(
      this._enqueue('first', callback)
    )
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
    return this._enqueue('flatMap', callback)
  }

  /**
   * Asynchrounous version of Array#forEach(), running the given
   * `callback` function on each `array` item in parallel. The
   * callback receives the current array item as a parameter.
   *
   * @param {Function} callback
   */
  async forEach (callback: Function): Promise<void> {
    return this.all(
      this._enqueue('forEach', callback)
    )
  }

  /**
   * Asynchrounous version of Array#forEach(), running the given
   * `callback` function on each `array` item **in sequence**.
   * The callback receives the current array item as a parameter.
   *
   * @param {Function} callback
   */
  async forEachSeries (callback: Function): Promise<void> {
    return this.all(
      this._enqueue('forEachSeries', callback)
    )
  }

  /**
   * Group the collection items into arrays using the given `key`.
   *
   * @param {String} key
   *
   * @returns {Object}
   */
  async groupBy (key: string): Promise<any> {
    return this.all(
      this._enqueue('groupBy', undefined, key)
    )
  }

  /**
   * Returns `true` when the collection satisfies the given
   * `callback` testing function, `false` otherwise.
   *
   * @param {Function} callback
   *
   * @returns {Boolean}
   */
  async has (callback: Function): Promise<boolean> {
    return this.all(
      this._enqueue('has', callback)
    )
  }

  /**
   * Returns `true` when the collection contains duplicate items, `false` otherwise.
   *
   * @returns {Boolean}
   */
  async hasDuplicates (): Promise<boolean> {
    return this.all(
      this._enqueue('hasDuplicates')
    )
  }

  /**
   * Creates an array of unique values that are included in both given array
   *
   * @param {Array} items
   *
   * @returns {Array}
   */
  intersect (items: any[]): this {
    return this._enqueue('intersect', undefined, items)
  }

  /**
   * Returns `true` when the collection is empty, `false` otherwise.
   *
   * @returns {Boolean}
   */
  async isEmpty (): Promise<boolean> {
    return this.all(
      this._enqueue('isEmpty')
    )
  }

  /**
   * Returns `true` when the collection is not empty, `false` otherwise.
   *
   * @returns {Boolean}
   */
  async isNotEmpty (): Promise<boolean> {
    return this.all(
      this._enqueue('isNotEmpty')
    )
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
    return this.all(
      this._enqueue('join', undefined, separator)
    )
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
    return this.all(
      this._enqueue('last', callback)
    )
  }

  /**
   * Asynchronous version of Array#map(), running all transformations
   * in parallel. It runs the given `callback` on each item of the
   * `array` and returns an array of transformed items.
   *
   * @param {Function} callback
   *
   * @returns {CollectionProxy}
   */
  map (callback: Function): this {
    return this._enqueue('map', callback)
  }

  /**
   * Asynchronous version of Array#map(), running all transformations
   * in sequence. It runs the given `callback` on each item of
   * the `array` and returns an array of transformed items.
   *
   * @param {Function} callback
   *
   * @returns {CollectionProxy}
   */
  mapSeries (callback: Function): this {
    return this._enqueue('mapSeries', callback)
  }

  /**
   * Returns the max value in the collection.
   *
   * @returns {Number}
   */
  async max (): Promise<number> {
    return this.all(
      this._enqueue('max')
    )
  }

  /**
   * Returns median of the current collection
   *
   * @returns {Number}
   */
  async median (): Promise<number> {
    return this.all(
      this._enqueue('median')
    )
  }

  /**
   * Returns the min value in the collection.
   *
   * @returns {Number}
   */
  async min (): Promise<number> {
    return this.all(
      this._enqueue('min')
    )
  }

  /**
   * Retrieves all values for the given `keys`.
   *
   * @param {String|Array} keys
   *
   * @returns {Array}
   */
  pluck (keys: string|string[]): this {
    return this._enqueue('pluck', undefined, keys).collapse()
  }

  /**
   * Removes and returns the last item from the collection.
   *
   * @returns {*}
   */
  async pop (): Promise<any> {
    const collection = this.clone()

    this.splice(-1, 1)

    return collection._enqueue('pop').all()
  }

  /**
   * Add one or more items to the end of the collection.
   *
   * @param  {*} items
   *
   * @returns {CollectionProxy}
   */
  push (...items: any[]): this {
    return this._enqueue('push', undefined, items)
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
    return this.all(
      this._enqueue('reduce', reducer, initial)
    )
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
    return this.all(
      this._enqueue('reduceRight', reducer, initial)
    )
  }

  /**
   * Inverse of Array#filter(), **removing** all items satisfying the
   * `callback` testing function. The callback should return `true`
   * if an item should be removed from the resulting collection.
   *
   * @param {Function} callback
   *
   * @returns {CollectionProxy}
   */
  reject (callback: Function): this {
    return this._enqueue('reject', callback)
  }

  /**
   * Inverse of Array#filter(), **removing** all items satisfying the `callback`
   * testing function. Processes each item in sequence. The callback should
   * return `true` if an item should be removed from the resulting collection.
   *
   * @param {Function} callback
   *
   * @returns {CollectionProxy}
   */
  rejectSeries (callback: Function): this {
    return this._enqueue('rejectSeries', callback)
  }

  /**
  * Returns a reversed collection. The first item becomes the last one,
  * the second item becomes the second to last, and so on.
  *
  * @returns {CollectionProxy}
  */
  reverse (): CollectionProxy {
    return this.clone()._enqueue('reverse')
  }

  /**
   * Removes and returns the first item from the collection.
   *
   * @returns {*}
   */
  async shift (): Promise<any> {
    const collection = this.clone()

    this.splice(0, 1)

    return collection._enqueue('shift').all()
  }

  /**
   * Returns the number of items in the collection.
   *
   * @returns {Number}
   */
  async size (): Promise<number> {
    return this.all(
      this._enqueue('size')
    )
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
    return this._enqueue('slice', undefined, { start, limit })
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

    this._enqueue('splice', undefined, { start, limit, inserts })

    return collection
  }

  /**
   * Asynchronous version of `Array#some()`. This function
   * tests whether at least one element in the `array`
   * passes the check implemented by the `callback`.
   *
   * @param {Function} callback
   *
   * @returns {Boolean}
   */
  async some (callback: Function): Promise<boolean> {
    return this.all(
      this._enqueue('some', callback)
    )
  }

  /**
   * Asynchronous version of `Array#some()`, running the (async) testing function
   * **in sequence**. Returns `true` if at least one element in the collection
   * passes the check implemented by the `callback`, otherwise `false`.
   *
   * @param {Function} callback
   *
   * @returns {Boolean}
   */
  async someSeries (callback: Function): Promise<boolean> {
    return this.all(
      this._enqueue('someSeries', callback)
    )
  }

  /**
   * Returns a sorted list of all collection items, with an optional comparator
   *
   * @param {Function} comparator
   *
   * @returns {CollectionProxy}
   */
  sort (comparator: Function): CollectionProxy {
    return this.clone()._enqueue('sort', comparator)
  }

  /**
   * Returns the sum of all collection items.
   *
   * @returns {Number} resulting sum of collection items
   */
  async sum (): Promise<number> {
    return this.all(
      this._enqueue('sum')
    )
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

    this._enqueue('takeAndRemove', undefined, limit)

    return collection
  }

  /**
   * Tap into the chain, run the given `callback` and retreive the original value.
   *
   * @returns {CollectionProxy}
   */
  tap (callback: Function): this {
    return this._enqueue('tap', callback)
  }

  /**
   * Returns JSON representation of collection
   *
   * @returns {String}
   */
  async toJSON (): Promise<string> {
    return this.all(
      this._enqueue('toJSON')
    )
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
    return this._enqueue('unique', undefined, key)
  }

  /**
   * Add one or more items to the beginning of the collection.
   *
   * @returns {*}
   */
  unshift (...items: any[]): this {
    return this._enqueue('unshift', undefined, items)
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
  _enqueue (method: string, callback?: Function, data?: any): this {
    this.callChain.enqueue({ method, callback, data })

    return this
  }

  /**
   * Processes the collection pipeline and returns
   * all items in the collection.
   *
   * @returns {*}
   */
  async all (_?: any): Promise<any> {
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
