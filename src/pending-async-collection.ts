'use strict'

import { QueueItem } from './contracts'
import { Collection } from './collection'
import Queue from '@supercharge/queue-datastructure'

export class PendingAsyncCollection<T> {
  /**
   * Stores the list of items in the collection.
   */
  private items: T[]

  /**
   * Stores all operations on the collection until the values
   * should be returned. Then, the queued operations in
   * the call chain will be processed.
   */
  private readonly callChain: Queue<QueueItem>

  /**
   * Create a new instance of a pending async collection.
   *
   * @param items
   * @param callChain
   */
  constructor (items: T[], callChain?: QueueItem[]) {
    this.items = items
    this.callChain = new Queue<QueueItem>(...callChain ?? [])
  }

  /**
   * Returns the underlying items.
   *
   * @returns {Array}
   */
  private entries (): T[] {
    return this.items
  }

  /**
   * Returns the average of all collection items
   *
   * @returns {Number}
   */
  async avg (): Promise<number> {
    return this.enqueue<number>('avg').all()
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
  async any (callback: (value: T, index: number, items: T[]) => Promise<unknown>): Promise<boolean>
  async any (callback: (value: T, index: number, items: T[]) => unknown): Promise<boolean>
  async any (callback: (value: T, index: number, items: T[]) => Promise<unknown> | unknown): Promise<boolean> {
    return this.some(callback)
  }

  /**
   * Breaks the collection into multiple, smaller
   * collections of the given `size`.
   *
   * @param {Number} size
   *
   * @returns {PendingAsyncCollection}
   */
  chunk (size: number): PendingAsyncCollection<T> {
    return this.enqueue('chunk', undefined, size)
  }

  /**
   * Creates a shallow clone of the collection.
   *
   * @returns {PendingAsyncCollection}
   */
  clone (): PendingAsyncCollection<T> {
    return new PendingAsyncCollection<T>(
      this.items.slice(), this.callChain.items()
    )
  }

  /**
   * Collapse a collection of arrays into a single, flat collection.
   *
   * @returns {PendingAsyncCollection}
   */
  collapse (): PendingAsyncCollection<T> {
    return this.enqueue('collapse')
  }

  /**
   * Removes all falsy values from the given `array`. Falsy values
   * are `null`, `undefined`, `''`, `false`, `0`, `-0`, `0n`, `NaN`.
   *
   * @returns {PendingAsyncCollection}
   */
  compact (): PendingAsyncCollection<T> {
    return this.enqueue('compact')
  }

  /**
   * Creates a new collection containing the concatenated items
   * of the original collection with the new `items`.
   *
   * @param {*} items
   *
   * @returns {PendingAsyncCollection}
   */
  concat (...items: T[]): PendingAsyncCollection<T> {
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
    return this.enqueue<number>('count', callback).all()
  }

  /**
   * Removes all values from the collection that are present in the given array.
   *
   * @param {*} items
   *
   * @returns {PendingAsyncCollection}
   */
  diff (items: T[]): PendingAsyncCollection<T> {
    return this.enqueue('diff', undefined, items)
  }

  /**
   * Asynchronous version of `Array#every()`, running the async testing
   * function in sequence. Returns `true` if all items in the collection
   * pass the check implemented by the `callback`, otherwise `false`.
   *
   * @param {Function} callback
   *
   * @returns {Boolean} Returns `true` if all items pass the predicate check, `false` otherwise.
   */
  async every (predicate: (value: T, index: number, items: T[]) => Promise<unknown>): Promise<boolean>
  async every (predicate: (value: T, index: number, items: T[]) => unknown): Promise<boolean>
  async every (callback: (value: T, index: number, items: T[]) => Promise<unknown> | unknown): Promise<boolean> {
    return this.enqueue<boolean>('every', callback).all()
  }

  /**
   * Asynchronous version of Array#filter(), running the async testing
   * function in sequence. The `callback` should return `true`
   * if an item should be included in the resulting collection.
   *
   * @param {Function} predicate
   *
   * @returns {Array}
   */
  filter (predicate: (value: T, index: number, items: T[]) => Promise<unknown>): PendingAsyncCollection<T>
  filter (predicate: (value: T, index: number, items: T[]) => unknown): PendingAsyncCollection<T>
  filter (predicate: (value: T, index: number, items: T[]) => Promise<unknown> | unknown): PendingAsyncCollection<T> {
    return this.enqueue('filter', predicate)
  }

  /**
   * A variant of the `filter` method running the async testing
   * function only if the given `condition` is `true`.
   *
   * @param {Boolean} condition
   * @param {Function} callback
   *
   * @returns {Array}
   */
  filterIf (condition: boolean, callback: (value: T, index: number, items: T[]) => Promise<unknown>): PendingAsyncCollection<T>
  filterIf (condition: boolean, callback: (value: T, index: number, items: T[]) => unknown): PendingAsyncCollection<T>
  filterIf (condition: boolean, callback: (value: T, index: number, items: T[]) => Promise<unknown> | unknown): PendingAsyncCollection<T> {
    return this.enqueue('filterIf', callback, condition)
  }

  /**
   * Asynchronous version of Array#find(), running the async testing
   * function in sequence. Returns the first item in the collection
   * satisfying the given `callback`, `undefined` otherwise.
   *
   * @param {Function} predicate
   *
   * @returns {*} the found value
   */
  async find<S extends T> (predicate: (value: T, index: number, items: T[]) => value is S): Promise<any>
  async find (predicate: (value: T, index: number, items: T[]) => Promise<unknown>): Promise<T | undefined>
  async find (predicate: (value: T, index: number, items: T[]) => unknown): Promise<T | undefined>
  async find (predicate: (value: T, index: number, items: T[]) => Promise<unknown> | unknown): Promise<T | undefined> {
    return this.enqueue('find', predicate).all()
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
  async first (): Promise<T | undefined>
  async first<S extends T> (predicate?: (value: T, index: number, items: T[]) => value is S): Promise<T | undefined>
  async first (predicate?: (value: T, index: number, items: T[]) => Promise<unknown>): Promise<T | undefined>
  async first (predicate?: (value: T, index: number, items: T[]) => unknown): Promise<T | undefined>
  async first (predicate?: (value: T, index: number, items: T[]) => Promise<unknown> | unknown): Promise<T | undefined> {
    return this.enqueue('first', predicate).all()
  }

  /**
   * Flattens the collection one level deep.
   *
   * @returns {PendingAsyncCollection}
   */
  flatten (): PendingAsyncCollection<T> {
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
   * @returns {PendingAsyncCollection}
   */
  flatMap<R> (callback: (value: T, index: number, items: T[]) => Promise<R> | R): PendingAsyncCollection<any> {
    return this.enqueue('flatMap', callback)
  }

  /**
   * Asynchrounous version of Array#forEach(), running the given
   * `callback` function on each `array` item in sequence.
   *
   * @param {Function} callback
   */
  async forEach (callback: (value: T, index: number, items: T[]) => Promise<void> | void): Promise<void> {
    return this.enqueue<any>('forEach', callback).all()
  }

  /**
   * Group the collection items into arrays using the given `key`.
   *
   * @param {String} key
   *
   * @returns {Object}
   */
  async groupBy (key: keyof T): Promise<any> {
    return this.enqueue('groupBy', undefined, key).all()
  }

  /**
   * Determines whether the the collection contains the item
   * represented by `callback` or if the collection
   * satisfies the given `callback` testing function. Alias of `has`.
   *
   * @param {Function} callback
   *
   * @returns {Boolean}
   */
  async has (callback: (value: T, index: number, items: T[]) => Promise<boolean> | boolean): Promise<boolean> {
    return this.enqueue<boolean>('has', callback).all()
  }

  /**
   * Returns `true` when the collection contains duplicate items, `false` otherwise.
   *
   * @returns {Boolean}
   */
  async hasDuplicates (): Promise<boolean> {
    return this.enqueue<boolean>('hasDuplicates').all()
  }

  /**
   * Determines whether the the collection contains the item
   * represented by `callback` or if the collection
   * satisfies the given `callback` testing function. Alias of `has`.
   *
   * @param {Function} callback
   *
   * @returns {Boolean}
   */
  async includes (callback: (value: T, index: number, items: T[]) => Promise<boolean> | boolean): Promise<boolean> {
    return this.has(callback)
  }

  /**
   * Creates an array of unique values that are included in both given array
   *
   * @param {Array} items
   *
   * @returns {Array}
   */
  intersect (items: T[]): PendingAsyncCollection<T> {
    return this.enqueue('intersect', undefined, items)
  }

  /**
   * Returns `true` when the collection is empty, `false` otherwise.
   *
   * @returns {Boolean}
   */
  async isEmpty (): Promise<boolean> {
    return this.enqueue<boolean>('isEmpty').all()
  }

  /**
   * Returns `true` when the collection is not empty, `false` otherwise.
   *
   * @returns {Boolean}
   */
  async isNotEmpty (): Promise<boolean> {
    return this.enqueue<boolean>('isNotEmpty').all()
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
    return this.enqueue('join', undefined, separator).all()
  }

  /**
   * Returns the last item in the collection that satisfies the
   * `predicate` testing function, `undefined` otherwise.
   *
   * @param {Function} callback
   *
   * @returns {*} the found value
   */
  async last (): Promise<T | undefined>
  async last<S extends T> (predicate?: (value: T, index: number, items: T[]) => value is S): Promise<T | undefined>
  async last (predicate?: (value: T, index: number, items: T[]) => Promise<unknown>): Promise<T | undefined>
  async last (predicate?: (value: T, index: number, items: T[]) => unknown): Promise<T | undefined>
  async last (predicate?: (value: T, index: number, items: T[]) => Promise<unknown> | unknown): Promise<T | undefined> {
    return this.enqueue('last', predicate).all()
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
  map<R> (action: (value: T, index: number, items: T[]) => Promise<R>): PendingAsyncCollection<R>
  map<R> (action: (value: T, index: number, items: T[]) => R): PendingAsyncCollection<R>
  map<R> (action: (value: T, index: number, items: T[]) => R): any {
    return this.enqueue('map', action) as unknown as PendingAsyncCollection<R>
  }

  /**
   * A variant of the `map` method running the async `action`
   * function only if the given `condition` is `true`.
   *
   * @param {Function} callback
   *
   * @returns {Array}
   */
  mapIf<R> (condition: boolean, action: (value: T, index: number, items: T[]) => Promise<R>): PendingAsyncCollection<R>
  mapIf<R> (condition: boolean, action: (value: T, index: number, items: T[]) => R): PendingAsyncCollection<R>
  mapIf<R> (condition: boolean, action: (value: T, index: number, items: T[]) => R): any {
    return this.enqueue('mapIf', action, condition) as unknown as PendingAsyncCollection<R>
  }

  /**
   * Returns the max value in the collection.
   *
   * @returns {Number}
   */
  async max (): Promise<number> {
    return this.enqueue<number>('max').all()
  }

  /**
   * Returns median of the current collection
   *
   * @returns {Number}
   */
  async median (): Promise<number> {
    return this.enqueue<number>('median').all()
  }

  /**
   * Returns the min value in the collection.
   *
   * @returns {Number}
   */
  async min (): Promise<number> {
    return this.enqueue<number>('min').all()
  }

  /**
   * Retrieves all values for the given `keys`.
   *
   * @param {String|Array} keys
   *
   * @returns {Array}
   */
  pluck (keys: string | string[]): PendingAsyncCollection<T> {
    return this
      .clone()
      .enqueue('pluck', undefined, keys)
      .collapse()
  }

  /**
   * Removes and returns the last item from the collection.
   *
   * @returns {*}
   */
  async pop (): Promise<T | undefined> {
    const collection = this.clone()

    this.splice(-1, 1)

    return collection.enqueue('pop').all()
  }

  /**
   * Add one or more items to the end of the collection.
   *
   * @param  {*} items
   *
   * @returns {PendingAsyncCollection}
   */
  push (...items: T[]): PendingAsyncCollection<T> {
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
  async reduce<R> (reducer: (carry: R, currentValue: T, currentIndex?: number, items?: T[]) => Promise<R>, accumulator: R): Promise<R>
  async reduce<R> (reducer: (carry: R, currentValue: T, currentIndex?: number, items?: T[]) => R, accumulator: R): Promise<R>
  async reduce<R> (reducer: (carry: R, currentValue: T, currentIndex: number, items: T[]) => Promise<R> | R, initial: R): Promise<R> {
    return this.enqueue<R>('reduce', reducer, initial).all()
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
  async reduceRight<R> (reducer: (carry: R, currentValue: T, currentIndex?: number, items?: T[]) => Promise<R>, accumulator: R): Promise<R>
  async reduceRight<R> (reducer: (carry: R, currentValue: T, currentIndex?: number, items?: T[]) => R, accumulator: R): Promise<R>
  async reduceRight<R> (reducer: (carry: R, currentValue: T, currentIndex: number, items: T[]) => Promise<R> | R, initial: R): Promise<R> {
    return this.enqueue<R>('reduceRight', reducer, initial).all()
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
  reject (predicate: (value: T, index: number, items: T[]) => Promise<unknown> | unknown): PendingAsyncCollection<T> {
    return this.enqueue('reject', predicate)
  }

  /**
  * Returns a reversed collection. The first item becomes the last one,
  * the second item becomes the second to last, and so on.
  *
  * @returns {PendingAsyncCollection}
  */
  reverse (): PendingAsyncCollection<T> {
    return this.clone().enqueue('reverse')
  }

  /**
   * Removes and returns the first item from the collection.
   *
   * @returns {*}
   */
  async shift (): Promise<T | undefined> {
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
    return this.enqueue<number>('size').all()
  }

  /**
   * Returns a chunk of items beginning at the `start`
   * index without removing them from the collectin.
   * You can `limit` the size of the slice.
   *
   * @param {Number} start
   * @param {Number} limit
   *
   * @returns {PendingAsyncCollection}
   */
  slice (start: number, limit?: number): PendingAsyncCollection<T> {
    return this
      .clone()
      .enqueue('slice', undefined, { start, limit })
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
   * @returns {PendingAsyncCollection}
   */
  splice (start: number, limit: number, ...inserts: T[]): PendingAsyncCollection<T> {
    const collection = this.clone().slice(start, limit || this.items.length)

    this.enqueue('splice', undefined, { start, limit, inserts })

    return collection
  }

  /**
   * Asynchronous version of `Array#some()`, running the async testing function
   * in sequence. Returns `true` if at least one element in the collection
   * passes the check implemented by the `callback`, otherwise `false`.
   *
   * @param {Function} predicate
   *
   * @returns {Boolean}
   */
  async some (callback: (value: T, index: number, items: T[]) => Promise<unknown>): Promise<boolean>
  async some (callback: (value: T, index: number, items: T[]) => unknown): Promise<boolean>
  async some (predicate: (value: T, index: number, items: T[]) => Promise<unknown> | unknown): Promise<boolean> {
    return this.enqueue<boolean>('some', predicate).all()
  }

  /**
   * Returns a sorted list of all collection items, with an optional comparator
   *
   * @param {Function} comparator
   *
   * @returns {PendingAsyncCollection}
   */
  sort (comparator: (a: T, b: T) => number): PendingAsyncCollection<T> {
    return this.clone().enqueue('sort', comparator)
  }

  /**
   * Returns the sum of all collection items.
   *
   * @returns {Number} resulting sum of collection items
   */
  async sum (): Promise<number> {
    return this.enqueue<number>('sum').all()
  }

  /**
   * Take `limit` items from the beginning
   * or end of the collection.
   *
   * @param {Number} limit
   *
   * @returns {PendingAsyncCollection}
   */
  take (limit: number): PendingAsyncCollection<T> {
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
   * @returns {PendingAsyncCollection}
   */
  takeAndRemove (limit: number): PendingAsyncCollection<T> {
    const collection = this.take(limit)

    this.enqueue('takeAndRemove', undefined, limit)

    return collection
  }

  /**
   * Tap into the chain, run the given `callback` and retreive the original value.
   *
   * @returns {PendingAsyncCollection}
   */
  tap (callback: (item: T) => void): PendingAsyncCollection<T> {
    return this.enqueue('tap', callback)
  }

  /**
   * Returns JSON representation of collection
   *
   * @returns {String}
   */
  async toJSON (): Promise<string> {
    return this.enqueue<string>('toJSON').all()
  }

  /**
   * Creates an array of unique values, in order, from all given arrays.
   *
   * @param {Array} items
   *
   * @returns {PendingAsyncCollection}
   */
  union (items: T[]): PendingAsyncCollection<T> {
    return this.concat(...items).unique()
  }

  /**
   * Returns all the unique items in the collection.
   *
   * @param {String|Function}
   *
   * @returns {PendingAsyncCollection}
   */
  unique (key?: string|Function): PendingAsyncCollection<T> {
    return this.enqueue('unique', undefined, key)
  }

  /**
   * Returns all unique items in the collection identified by the given `selector`.
   *
   * @param {Function}
   *
   * @returns {PendingAsyncCollection}
   */
  uniqueBy (selector: (item: T) => Promise<unknown> | unknown): PendingAsyncCollection<T> {
    return this.enqueue('uniqueBy', selector)
  }

  /**
   * Add one or more items to the beginning of the collection.
   *
   * @returns {*}
   */
  unshift (...items: T[]): PendingAsyncCollection<T> {
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
   * @returns {PendingAsyncCollection}
   */
  enqueue<ReturnType = T> (method: string, callback?: Function, data?: any): PendingAsyncCollection<ReturnType> {
    this.callChain.enqueue({ method, callback, data })

    return new PendingAsyncCollection<ReturnType>(
      this.items.slice() as unknown as ReturnType[], this.callChain.items()
    )
  }

  /**
   * Creates a “thenable” allowing you to await collection
   * pipelines instead of appending a `.all()` call.
   *
   * @param {Function} onFullfilled
   *
   * @returns {*}
   */
  async then<R = T[]> (onFullfilled: (value: R) => unknown, onRejected: (reason: any) => unknown): Promise<R | undefined> {
    await Promise.all([])
    try {
      const result = await this.all<R>()

      onFullfilled(result)

      return result
    } catch (error) {
      onRejected(error)
    }
  }

  /**
   * Processes the collection pipeline and returns the result.
   *
   * @returns {*}
   */
  async all<R = T[]> (): Promise<R> {
    let collection: any = new Collection(
      this.clone().entries()
    )

    while (this.callChain.isNotEmpty()) {
      try {
        const { method, callback, data } = this.callChain.dequeue()!

        collection = await (
          callback
            ? collection[method](callback, data)
            : collection[method](data)
        )

        if (collection instanceof Array) {
          this.items = collection
          collection = new Collection(collection)
        }
      } catch (error) {
        this.callChain.clear()

        throw error
      }
    }

    return collection instanceof Collection
      ? collection.all()
      : collection
  }
}
