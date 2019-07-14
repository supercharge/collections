'use strict'

const Methods = require('./methods')
const Queue = require('@supercharge/queue-datastructure')

class Collection {
  constructor (items = []) {
    this._callChain = new Queue()
    this._items = Array.isArray(items) ? items : [items]
  }

  /**
   * Collapse a collection of arrays into a single, flat collection.
   *
   * @returns {Collection}
   */
  collapse (callback) {
    return this._enqueue('collapse', callback)
  }

  /**
   * Removes all falsey values from the given `array`.
   * Falsey values are `null`, `undefined`, `''`,
   * `false`, `0`, `NaN`.
   *
   * @returns {Collection}
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
   * Asynchronously filter the given `array` using the provided `callback`.
   * At first, this function uses an async version of Array.map to run the
   * `callback` on every item. This returns an array of boolean values,
   * like `[ true, false, true ]`. The final filter results will be
   * calculated based on the boolean results and only those items
   * having a `true` result in the boolean array will survive.
   *
   * @param {Function} callback
   *
   * @returns {Collection}
   */
  filter (callback) {
    return this._enqueue('filter', callback)
  }

  /**
   * Asynchronous version of Array#find(). Returns the first
   * item in the `array` that satisfies the `callback`
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
   * Asynchronous version of Array#flatMap(). It invokes the `callback`
   * on each collection item. The callback can modify and return the
   * item resulting in a new collection of modified items.
   * Ultimately, flatMap flattens the mapped results.
   *
   * @param {Function} callback
   *
   * @returns {Collection}
   */
  flatMap (callback) {
    return this._enqueue('flatMap', callback)
  }

  /**
   * Asynchrounous version of Array#forEach(). It runs the given
   * `callback` function on each `array` item. The callback
   * receives the current array item as a parameter.
   *
   * @param {Function} callback
   */
  forEach (callback) {
    return this.all(
      this._enqueue('forEach', callback)
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
   * @returns {Collection}
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
   * @returns {Collection}
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
   * Returns number of items in the collection’s underlying array.
   *
   * @returns {Number}
   */
  size () {
    return this.all(
      this._enqueue('size')
    )
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
   * Enqueues an operation in the collection pipeline
   * for processing at a later time.
   *
   * @param {String} method
   * @param {Function} callback
   * @param {*} initial
   *
   * @returns {Collection}
   */
  _enqueue (method, callback, initial) {
    this._callChain.enqueue({ method: Methods[method], callback, initial })

    return this
  }

  /**
   * Processes the collection pipeline and returns
   * all items in the collection.
   *
   * @returns {Array}
   */
  async all () {
    while (this._callChain.isNotEmpty()) {
      try {
        const { method, callback, initial } = this._callChain.dequeue()
        this._items = await method(this._items, callback, initial)
      } catch (error) {
        this._callChain.clear()
        throw error
      }
    }

    return this._items
  }
}

module.exports = Collection
