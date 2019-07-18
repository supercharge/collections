'use strict'

const Collection = require('./collection')
const Queue = require('@supercharge/queue-datastructure')

class CollectionProxy {
  constructor (items = [], callChain = []) {
    this.callChain = new Queue(callChain)
    this.items = Array.isArray(items) ? items : [items]
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
    const collection = new CollectionProxy(
      this.items.slice(0), this.callChain.items()
    ).slice(start, limit)

    this._enqueue('splice', null, { start, limit, inserts })

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
  some (callback) {
    return this.all(
      this._enqueue('some', callback)
    )
  }

  take (amount) {
    const collection = new CollectionProxy(this.items.slice(0), this.callChain.items())

    if (amount < 0) {
      return collection.slice(amount)
    }

    return collection.slice(0, amount)
  }

  takeAndRemove (amount) {
    const collection = new CollectionProxy(this.items.slice(0), this.callChain.items())

    this._enqueue('takeAndRemove', null, amount)

    return amount < 0
      ? collection.splice(amount)
      : collection.splice(0, amount)
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
