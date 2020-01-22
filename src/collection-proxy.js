'use strict'

const Collection = require('./collection')
const Queue = require('@supercharge/queue-datastructure')

class CollectionProxy {
  constructor (items, callChain = []) {
    this.items = [].concat(items || [])
    this.callChain = new Queue(callChain)
  }

  /**
   * Breaks the collection into multiple, smaller collections
   * of the given `size`.
   *
   * @param {Number} size
   *
   * @returns {CollectionProxy}
   */
  chunk (size) {
    return this._enqueue('chunk', null, size)
  }

  /**
   * Creates a shallow clone of the collection.
   *
   * @returns {CollectionProxy}
   */
  clone () {
    return new CollectionProxy(
      this.items, this.callChain.items()
    )
  }

  /**
   * Collapse a collection of arrays into a single, flat collection.
   *
   * @returns {CollectionProxy}
   */
  collapse () {
    return this._enqueue('collapse')
  }

  /**
   * Removes all falsey values from the given `array`.
   * Falsey values are `null`, `undefined`, `''`,
   * `false`, `0`, `NaN`.
   *
   * @returns {CollectionProxy}
   */
  compact () {
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
  concat (...items) {
    return this.clone()._enqueue('concat', null, items)
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
  every (callback) {
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
  everySeries (callback) {
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
  filter (callback) {
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
  filterSeries (callback) {
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
  find (callback) {
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
  findSeries (callback) {
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
  first (callback) {
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
  flatMap (callback) {
    return this._enqueue('flatMap', callback)
  }

  /**
   * Asynchrounous version of Array#forEach(), running the given
   * `callback` function on each `array` item in parallel. The
   * callback receives the current array item as a parameter.
   *
   * @param {Function} callback
   */
  forEach (callback) {
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
  forEachSeries (callback) {
    return this.all(
      this._enqueue('forEachSeries', callback)
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
  has (callback) {
    return this.all(
      this._enqueue('has', callback)
    )
  }

  /**
   * Creates an array of unique values that are included in both given array
   *
   * @param {Array} items
   *
   * @returns {Array}
   */
  intersect (items) {
    return this._enqueue('intersect', null, items)
  }

  /**
   * Returns `true` when the collection is empty, `false` otherwise.
   *
   * @returns {Boolean}
   */
  isEmpty () {
    return this.all(
      this._enqueue('isEmpty')
    )
  }

  /**
   * Returns `true` when the collection is not empty, `false` otherwise.
   *
   * @returns {Boolean}
   */
  isNotEmpty () {
    return this.all(
      this._enqueue('isNotEmpty')
    )
  }

  /**
   * Returns a new string by concatenating all of the elements in an array.
   *
   * @returns {String}
   */
  join (separator) {
    return this.all(
      this._enqueue('join', null, separator)
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
  last (callback) {
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
  map (callback) {
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
  mapSeries (callback) {
    return this._enqueue('mapSeries', callback)
  }

  /**
   * Add one or more items to the end of the collection.
   *
   * @param  {*} items
   *
   * @returns {CollectionProxy}
   */
  push (...items) {
    return this._enqueue('push', null, items)
  }

  /**
   * Removes and returns the last item from the collection
   *
   * @param {}
   *
   * @returns {Number}
   */
  pop () {
    const collection = this.clone()

    this.splice(-1, 1)

    return collection._enqueue('pop').all()
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
  reduce (reducer, initial) {
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
  reduceRight (reducer, initial) {
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
  reject (callback) {
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
  rejectSeries (callback) {
    return this._enqueue('rejectSeries', callback)
  }

  /**
   * Removes and returns the first item from the collection.
   *
   * @returns {*}
   */
  shift () {
    const collection = this.clone()

    this.splice(0, 1)

    return collection._enqueue('shift').all()
  }

  /**
   * Returns the number of items in the collection.
   *
   * @returns {Number}
   */
  size () {
    return this.all(
      this._enqueue('size')
    )
  }

  /**
   * Returns the max value in the collection.
   *
   * @returns {Number}
   */
  max () {
    return this.all(
      this._enqueue('max')
    )
  }

  /**
   * Removes all values from the collection that are present in the given array.
   *
   * @param {*} items
   *
   * @returns {CollectionProxy}
   */
  diff (items) {
    return this._enqueue('diff', null, { items })
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
  slice (start, limit) {
    return this._enqueue('slice', null, { start, limit })
  }

  /**
   * Removes and returns a chunk of items beginning at the `start`
   * index. You can `limit` the size of the slice. You may also
   * replace the removed chunk with new items.
   *
   * @param {Number} start
   * @param {Number} limit
   * @param  {...*} inserts
   *
   * @returns {CollectionProxy}
   */
  splice (start, limit, ...inserts) {
    const collection = this.clone().slice(start, limit)

    this._enqueue('splice', null, { start, limit, inserts })

    return collection
  }

  /**
  * Returns a reversed collection. The first item becomes the last one,
  * the second item becomes the second to last, and so on.
  *
  * @returns {CollectionProxy}
  */
  reverse () {
    return this.clone()._enqueue('reverse')
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
  some (callback) {
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
  someSeries (callback) {
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
  sort (comparator) {
    return this.clone()._enqueue('sort', comparator)
  }

  /**
   * Returns the sum of all collection items.
   *
   * @returns {Number} resulting sum of collection items
   */
  sum () {
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
  take (limit) {
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
  takeAndRemove (limit) {
    const collection = this.take(limit)

    this._enqueue('takeAndRemove', null, limit)

    return collection
  }

  /**
   * Returns JSON representation of collection
   *
   * @returns {String}
   */
  toJSON () {
    return this.all(
      this._enqueue('toJSON')
    )
  }

  /**
   * Returns all the unique items in the collection.
   *
   * @returns {CollectionProxy}
   */
  unique () {
    return this._enqueue('unique')
  }

  /**
   * Creates an array of unique values, in order, from all given arrays.
   *
   * @param {Array} items
   *
   * @returns {CollectionProxy}
   */
  union (items) {
    return this.concat(items).unique()
  }

  /**
   * Add one or more items to the beginning of the collection.
   *
   * @returns {*}
   */
  unshift (...items) {
    return this._enqueue('unshift', null, items)
  }

  /**
   * Returns the min value in the collection.
   *
   * @returns {Number}
   */
  min () {
    return this.all(
      this._enqueue('min')
    )
  }

  /**
   * Returns the average of all collection items
   *
   * @returns {Number}
   */
  avg () {
    return this.all(
      this._enqueue('avg')
    )
  }

  /**
   * Returns median of the current collection
   *
   * @returns {Number}
   */
  median () {
    return this.all(
      this._enqueue('median')
    )
  }

  /**
   * Returns `true` when the collection contains duplicate items, `false` otherwise.
   *
   * @returns {Boolean}
   */
  async hasDuplicates () {
    return this.all(
      this._enqueue('hasDuplicates')
    )
  }

  /**
   * Tap into the chain, run the given `callback` and retreive the original value.
   *
   * @returns {CollectionProxy}
   */
  tap (callback) {
    return this._enqueue('tap', callback)
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
  _enqueue (method, callback, data) {
    this.callChain.enqueue({ method, callback, data })

    return this
  }

  /**
   * Processes the collection pipeline and returns
   * all items in the collection.
   *
   * @returns {Array}
   */
  async all () {
    let collection = new Collection(this.items)

    while (this.callChain.isNotEmpty()) {
      try {
        const { method, callback, data } = this.callChain.dequeue()
        collection = await (
          callback ? collection[method](callback, data) : collection[method](data)
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

module.exports = CollectionProxy
