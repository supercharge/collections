'use strict'

const Lab = require('@hapi/lab')
const { expect } = require('@hapi/code')
const { map, filter, find, forEach, every, some } = require('..')

const { describe, it } = (exports.lab = Lab.script())

const pause = ms => new Promise(resolve => setTimeout(resolve, ms))

describe('Collection Methods', () => {
  it('map', async () => {
    const start = Date.now()

    const result = await map([ 1, 2, 3 ], async (timeout) => {
      await pause(50)

      return timeout * 10
    })

    expect(result).to.be.equal([ 10, 20, 30 ])

    const elapsed = Date.now() - start
    expect(elapsed < 100).to.be.true() // functions should run in parallel
  })

  it('filter', async () => {
    const start = Date.now()

    const result = await filter([ 1, 2, 3 ], async (item) => {
      await pause(50)

      return item > 1
    })

    expect(result).to.be.equal([ 2, 3 ])

    const elapsed = Date.now() - start
    expect(elapsed < 100).to.be.true()
  })

  it('find', async () => {
    const start = Date.now()

    const result = await find([ 1, 2, 3 ], async (item) => {
      await pause(50)

      return item === 3
    })

    expect(result).to.be.equal(3)

    const elapsed = Date.now() - start
    expect(elapsed < 100).to.be.true()
  })

  it('forEach', async () => {
    const start = Date.now()

    await forEach([ 1, 2, 3, 4 ], async (item) => {
      await pause(item * 10)
    })

    const elapsed = Date.now() - start
    expect(elapsed < 100).to.be.true()
  })

  it('every', async () => {
    const start = Date.now()

    expect(
      await every([ 1, 2, 3 ], async (item) => {
        await pause(50)

        return item > 0
      })
    ).to.be.true()

    const elapsed = Date.now() - start
    expect(elapsed < 100).to.be.true()

    expect(
      await every([ 1, 2, 3 ], async (item) => {
        await pause(50)

        return item > 1
      })
    ).to.be.false()
  })

  it('some', async () => {
    const start = Date.now()

    expect(
      await some([ 1, 2, 3 ], async (item) => {
        await pause(50)

        return item > 2
      })
    ).to.be.true()

    const elapsed = Date.now() - start
    expect(elapsed < 100).to.be.true()

    expect(
      await some([ 1, 2, 3 ], async (item) => {
        await pause(50)

        return item > 3
      })
    ).to.be.false()
  })
})
