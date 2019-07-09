'use strict'

const Methods = require('./methods')
const Queue = require('@supercharge/queue-datastructure')

class Collection {
  constructor (array) {
    this._callQueue = new Queue()
    this._items = array
  }

  flatMap (callback) {
    return this._enqueue('flatMap', callback)
  }

  map (callback) {
    return this._enqueue('map', callback)
  }

  mapSeries (callback) {
    return this._enqueue('mapSeries', callback)
  }

  filter (callback) {
    return this._enqueue('filter', callback)
  }

  reduce (reducer, initial) {
    return this.run(
      this._enqueue('reduce', reducer, initial)
    )
  }

  find (callback) {
    return this.run(
      this._enqueue('find', callback)
    )
  }

  forEach (callback) {
    return this.run(
      this._enqueue('forEach', callback)
    )
  }

  collapse (callback) {
    return this._enqueue('collapse', callback)
  }

  every (callback) {
    return this.run(
      this._enqueue('every', callback)
    )
  }

  some (callback) {
    return this.run(
      this._enqueue('some', callback)
    )
  }

  _enqueue (method, callback, additional) {
    this._callQueue.enqueue({ method: Methods[method], callback, additional })

    return this
  }

  async run () {
    while (this._callQueue.isNotEmpty()) {
      try {
        const { method, callback, additional } = this._callQueue.dequeue()
        this._items = await method(this._items, callback, additional)
      } catch (error) {
        this._callQueue.clear()
        throw error
      }
    }

    return this._items
  }
}

module.exports = Collection
