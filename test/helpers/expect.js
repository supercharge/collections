'use strict'

const { expect } = require('expect')

expect.extend({
  toBeWithinRange (received, floor, ceiling) {
    const isWithinRange = received >= floor && received <= ceiling

    if (isWithinRange) {
      return {
        message   () {
          return `expected ${received} not to be within range ${floor} - ${ceiling}`
        },
        pass: true
      }
    }

    return {
      message () {
        return `expected ${received} to be within range ${floor} - ${ceiling}`
      },
      pass: false
    }
  }
})

exports.expect = expect
