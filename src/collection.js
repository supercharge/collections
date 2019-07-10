'use strict'

const Methods = require('./methods')
const Queue = require('@supercharge/queue-datastructure')

class Collection {
  constructor (items = []) {
    this._callChain = new Queue()
    this._items = items
  }

  collapse (callback) {
    return this._enqueue('collapse', callback)
  }

  compact () {
    return this._enqueue('compact')
  }

  every (callback) {
    return this.all(
      this._enqueue('every', callback)
    )
  }

  filter (callback) {
    return this._enqueue('filter', callback)
  }

  find (callback) {
    return this.all(
      this._enqueue('find', callback)
    )
  }

  flatMap (callback) {
    return this._enqueue('flatMap', callback)
  }

  forEach (callback) {
    return this.all(
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
    return this.all(
      this._enqueue('reduce', reducer, initial)
    )
  }

  reduceRight (reducer, initial) {
    return this.all(
      this._enqueue('reduceRight', reducer, initial)
    )
  }

  some (callback) {
    return this.all(
      this._enqueue('some', callback)
    )
  }

  _enqueue (method, callback, initial) {
    this._callChain.enqueue({ method: Methods[method], callback, initial })

    return this
  }

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
