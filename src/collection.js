'use strict'

const Methods = require('./methods')
const Queue = require('@supercharge/queue-datastructure')

class Collection {
  constructor (array) {
    this._callQueue = new Queue()
    this._items = array
  }

  collapse (callback) {
    return this._enqueue('collapse', callback)
  }

  compact () {
    return this._enqueue('compact')
  }

  every (callback) {
    return this.run(
      this._enqueue('every', callback)
    )
  }

  filter (callback) {
    return this._enqueue('filter', callback)
  }

  find (callback) {
    return this.run(
      this._enqueue('find', callback)
    )
  }

  flatMap (callback) {
    return this._enqueue('flatMap', callback)
  }

  forEach (callback) {
    return this.run(
      this._enqueue('forEach', callback)
    )
  }

  map (callback) {
    return this._enqueue('map', callback)
  }

  mapSeries (callback) {
    return this._enqueue('mapSeries', callback)
  }

  reduce (reducer, initial) {
    return this.run(
      this._enqueue('reduce', reducer, initial)
    )
  }

  reduceRight (reducer, initial) {
    return this.run(
      this._enqueue('reduceRight', reducer, initial)
    )
  }

  some (callback) {
    return this.run(
      this._enqueue('some', callback)
    )
  }

  _enqueue (method, callback, initial) {
    this._callQueue.enqueue({ method: Methods[method], callback, initial })

    return this
  }

  async run () {
    while (this._callQueue.isNotEmpty()) {
      try {
        const { method, callback, initial } = this._callQueue.dequeue()
        this._items = await method(this._items, callback, initial)
      } catch (error) {
        this._callQueue.clear()
        throw error
      }
    }

    return this._items
  }
}

module.exports = Collection
