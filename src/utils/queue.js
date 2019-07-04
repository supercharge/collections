'use strict'

class Queue {
  /**
   * Creates a new Queue instance and
   * enqueues the given `items`.
   *
   * @param  {Mixed} items
   */
  constructor (items = []) {
    this._queue = Array.isArray(items) ? items : [ items ]
  }

  /**
   * Pushes new `items` into the queue.
   *
   * @param  {Mixed} items
   */
  enqueue (...items) {
    this._queue.push(...items)
  }

  /**
   * Removes and returns the item which is up
   * for processing. Returns `undefined`
   * if the queue is empty.
   *
   * @returns {Mixed}
   */
  dequeue () {
    return this._queue.shift()
  }

  /**
   * Returns the front item without removing it
   * from the queue. Returns `undefined` if
   * the queue is empty.
   *
   * @returns {Mixed}
   */
  peek () {
    return this._queue[0]
  }

  /**
   * Returns the number of items in the queue.
   *
   * @returns {Integer}
   */
  size () {
    return this._queue.length
  }

  /**
   * Returns `true` if there are no items in
   * the queue, `false` otherwise.
   *
   * @returns {Boolean}
   */
  isEmpty () {
    return this.size() === 0
  }

  /**
   * Returns `true` if there are items in
   * the queue, `false` when the queue
   * is empty.
   *
   * @returns {Boolean}
   */
  isNotEmpty () {
    return !this.isEmpty()
  }

  /**
   * Removes all items from the queue.
   */
  clear () {
    this._queue = []
  }
}

module.exports = Queue
