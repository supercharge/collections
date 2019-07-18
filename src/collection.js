'use strict'

class Collection {
  constructor (items = []) {
    this.items = items
  }

  /**
   * Processes the collection pipeline and returns
   * all items in the collection.
   *
   * @returns {Array}
   */
  async all () {
    return this.items
  }

  /**
   * Breaks the collection into multiple, smaller collections
   * of the given `size`.
   *
   * @param {Number} size
   *
   * @returns {Array}
   */
  chunk (size) {
    const chunks = []

    while (this.size()) {
      chunks.push(
        this.items.splice(0, size)
      )
    }

    return chunks
  }

  /**
   * Collapse a collection of arrays into a single, flat collection.
   *
   * @returns {Array}
   */
  collapse () {
    return [].concat(...this.items)
  }

  /**
   * Removes all falsey values from the given `array`.
   * Falsey values are `null`, `undefined`, `''`,
   * `false`, `0`, `NaN`.
   *
   * @returns {Array}
   */
  async compact () {
    return this.filter(item => item)
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
  async every (callback) {
    const mapped = await this.map(callback)

    return mapped.every(value => value)
  }

  /**
   * Asynchronous version of Array#filter(). The `callback`
   * testing function should return `true` if an item
   * should be included in the resulting collection.
   *
   * @param {Function} callback
   *
   * @returns {Array}
   */
  async filter (callback) {
    const mapped = await this.map(callback)

    return this.items.filter((_, i) => mapped[i])
  }

  /**
   * Asynchronous version of Array#filter(), running the (async) testing
   * function **in sequence**. The `callback` should return `true`
   * if an item should be included in the resulting collection.
   *
   * @param {Function} callback
   *
   * @returns {Array}
   */
  async filterSeries (callback) {
    const mapped = await this.mapSeries(callback)

    return this.items.filter((_, i) => mapped[i])
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
  async find (callback) {
    const mapped = await this.map(callback)

    return this.items.find((_, i) => mapped[i])
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
  async findSeries (callback) {
    const mapped = await this.mapSeries(callback)

    return this.items.find((_, i) => mapped[i])
  }

  /**
   * Asynchronous version of Array#flatMap(). It invokes the `callback`
   * on each collection item. The callback can modify and return the
   * item resulting in a new collection of modified items.
   * Ultimately, flatMap flattens the mapped results.
   *
   * @param {Function} callback
   *
   * @returns {Array}
   */
  async flatMap (callback) {
    this.items = await this.map(callback)

    return this.collapse()
  }

  /**
   * Asynchrounous version of Array#forEach(), running the given
   * `callback` function on each `array` item in parallel. The
   * callback receives the current array item as a parameter.
   *
   * @param {Function} callback
   */
  async forEach (callback) {
    await this.map(callback)
  }

  /**
   * Asynchrounous version of Array#forEach(), running the given
   * `callback` function on each `array` item **in sequence**.
   * The callback receives the current array item as a parameter.
   *
   * @param {Function} callback
   */
  async forEachSeries (callback) {
    await this.mapSeries(callback)
  }

  /**
   * Returns `true` when the collection is empty, `false` otherwise.
   *
   * @returns {Boolean}
   */
  isEmpty () {
    return this.items.length === 0
  }

  /**
   * Returns `true` when the collection is not empty, `false` otherwise.
   *
   * @returns {Boolean}
   */
  isNotEmpty () {
    return this.items.length > 0
  }

  /**
   * Asynchronous version of Array#map(), running all transformations
   * in parallel. It runs the given `callback` on each item of the
   * `array` and returns an array of transformed items.
   *
   * @param {Function} callback
   *
   * @returns {Array}
   */
  async map (callback) {
    return Promise.all(this.items.map(callback))
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
  async mapSeries (callback) {
    const results = []

    for (const index in this.items) {
      results.push(
        await callback(this.items[index], index, this.items)
      )
    }

    return results
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
  async reduce (reducer, accumulator) {
    for (const index in this.items) {
      accumulator = await reducer(accumulator, this.items[index], index, this.items)
    }

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
  async reduceRight (reducer, accumulator) {
    let index = this.items.length

    while (index--) {
      accumulator = await reducer(accumulator, this.items[index], index, this.items)
    }

    return accumulator
  }

  /**
   * Inverse of Array#filter(), **removing** all items satisfying the
   * `callback` testing function. The callback should return `true`
   * if an item should be removed from the resulting collection.
   *
   * @param {Function} callback
   *
   * @returns {Array}
   */
  async reject (callback) {
    const mapped = await this.map(callback)

    return this.items.filter((_, i) => !mapped[i])
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
  async rejectSeries (callback) {
    const mapped = await this.mapSeries(callback)

    return this.items.filter((_, i) => !mapped[i])
  }

  /**
   * Returns the number of items in the collection.
   *
   * @returns {Number}
   */
  size () {
    return this.items.length
  }

  /**
   * Returns a chunk of items beginning at the `start`
   * index without removing them from the collection.
   * You can `limit` the size of the slice.
   *
   * @param {Number} start
   * @param {Number} limit
   *
   * @returns {Array}
   */
  slice ({ start, limit }) {
    const chunk = this.items.slice(start)

    if (limit) {
      return chunk.slice(0, limit)
    }

    return chunk.slice(0)
  }

  /**
  * Removes and returns a chunk of items beginning at the `start`
  * index from the collection. You can `limit` the size of the
  * slice and replace the removed items with `inserts`.
  *
  * @param {Number} start
  * @param {Number} limit
  * @param {*} inserts
  *
  * @returns {Array}
  */
  splice ({ start, limit, inserts }) {
    const flattend = Array.prototype.concat(...inserts)
    this.items.splice(start, limit || this.items.length, ...flattend)

    return this.items.slice(0)
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
  async some (callback) {
    const mapped = await this.map(callback)

    return mapped.some(value => value)
  }

  /**
   * Take and remove `limit` items from the
   * beginning or end of the collection.
   *
   * @param {Integer} limit
   *
   * @returns {CollectionProxy}
   */
  takeAndRemove (limit) {
    return limit < 0
      ? this.items.splice(0, this.size() + limit)
      : this.items.splice(limit)
  }

  /**
   * Returns all the unique items in the collection.
   *
   * @returns {Array}
   */
  async unique () {
    return Array.from(new Set(this.items))
  }
}

module.exports = Collection
