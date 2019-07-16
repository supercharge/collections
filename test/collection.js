'use strict'

const Collect = require('..')
const Sinon = require('sinon')
const Lab = require('@hapi/lab')
const { expect } = require('@hapi/code')

const { describe, it } = (exports.lab = Lab.script())

const pause = ms => new Promise(resolve => setTimeout(resolve, ms))

describe('Chained Collection', () => {
  it('returns an empty array when used without data', async () => {
    expect(
      await Collect().all()
    ).to.equal([])
  })

  it('wraps the initial data in an array if not already array', async () => {
    expect(
      await Collect('Marcus').all()
    ).to.equal(['Marcus'])
  })

  it('processes a collection pipeline', async () => {
    const result = await Collect([1, 2, 3])
      .map(item => item * 2)
      .filter(item => item > 2)
      .all()

    expect(result).to.equal([4, 6])
  })

  it('map', async () => {
    const start = Date.now()

    expect(
      await Collect([1, 2, 3])
        .map(async item => {
          await pause(50)

          return item * 10
        })
        .all()
    ).to.equal([10, 20, 30])

    const elapsed = Date.now() - start
    expect(elapsed < 100).to.be.true() // map should run in parallel
  })

  it('mapSeries', async () => {
    const start = Date.now()

    expect(
      await Collect([1, 2, 3])
        .mapSeries(async item => {
          await pause(50)

          return item * 10
        })
        .all()
    ).to.equal([10, 20, 30])

    const elapsed = Date.now() - start
    expect(elapsed > 100 && elapsed < 200).to.be.true() // functions should run in sequence
  })

  it('flatMap', async () => {
    const start = Date.now()

    expect(
      await Collect([1, 2, 3])
        .flatMap(async item => {
          await pause(50)

          return [item, item]
        })
        .all()
    ).to.equal([1, 1, 2, 2, 3, 3])

    const elapsed = Date.now() - start
    expect(elapsed < 100).to.be.true() // map should run in parallel
  })

  it('filter', async () => {
    const start = Date.now()

    expect(
      await Collect([1, 2, 3]).filter(async (item) => {
        await pause(50)

        return item > 1
      }).all()
    ).to.equal([2, 3])

    const elapsed = Date.now() - start
    expect(elapsed < 100).to.be.true()
  })

  it('reject', async () => {
    const start = Date.now()

    expect(
      await Collect([1, 2, 3, 4, 5])
        .reject(async (item) => {
          await pause(50)

          return item % 2 === 1 // remove all odds
        })
        .all()
    ).to.equal([2, 4])

    const elapsed = Date.now() - start
    expect(elapsed < 100).to.be.true()
  })

  it('reduce', async () => {
    expect(
      await Collect([1, 2, 3]).reduce(async (carry, item) => {
        await pause(50)

        return carry + item
      }, 0)
    ).to.equal(6)
  })

  it('reduceRight', async () => {
    expect(
      await Collect([1, 2, 3, 4, 5]).reduceRight(async (carry, item) => {
        await pause(50)

        return `${carry}${item}`
      }, '')
    ).to.equal('54321')

    expect(
      await Collect([1, 2, 3, 4, 5]).reduceRight(async (carry, item) => {
        await pause(50)

        return carry.concat(item)
      }, [])
    ).to.equal([5, 4, 3, 2, 1])
  })

  it('find', async () => {
    const start = Date.now()

    expect(
      await Collect([1, 2, 3]).find(item => item === 2)
    ).to.equal(2)

    const elapsed = Date.now() - start
    expect(elapsed < 100).to.be.true()

    expect(
      await Collect([1, 2, 3]).find(item => item === 10)
    ).to.be.undefined()
  })

  it('every', async () => {
    const start = Date.now()

    expect(
      await Collect([1, 2, 3]).every(item => item === 2)
    ).to.be.false()

    const elapsed = Date.now() - start
    expect(elapsed < 100).to.be.true()

    expect(
      await Collect([1, 2, 3]).every(item => item < 10)
    ).to.be.true()
  })

  it('size', async () => {
    expect(
      await Collect([1, 2, 3]).size()
    ).to.equal(3)

    expect(
      await Collect([]).size()
    ).to.equal(0)
  })

  it('slice', async () => {
    const collection1 = await Collect([1, 2, 3, 4, 5, 6])
    const chunk1 = await collection1.slice(3).all()
    expect(await collection1.all()).to.equal([1, 2, 3, 4, 5, 6])
    expect(chunk1).to.equal([4, 5, 6])

    const collection2 = await Collect([1, 2, 3, 4, 5, 6])
    const chunk2 = await collection2.slice(3, 2).all()
    expect(await collection2.all()).to.equal([1, 2, 3, 4, 5, 6])
    expect(chunk2).to.equal([4, 5])
  })

  it('splice', async () => {
    const collection1 = Collect([1, 2, 3, 4, 5])
    const chunk1 = await collection1.splice(2)
    expect(await collection1.all()).to.equal([1, 2])
    expect(await chunk1.all()).to.equal([3, 4, 5])

    // splice with start and limit
    const collection2 = Collect([1, 2, 3, 4, 5])
    const chunk2 = collection2.splice(2, 2)
    expect(await collection2.all()).to.equal([1, 2, 5])
    expect(await chunk2.all()).to.equal([3, 4])

    // inserts items
    const collection3 = Collect([1, 2, 3, 4, 5])
    const chunk3 = collection3.splice(2, 2, 8, 9)
    expect(await collection3.all()).to.equal([1, 2, 8, 9, 5])
    expect(await chunk3.all()).to.equal([3, 4])

    // inserts items from an array
    const collection4 = Collect([1, 2, 3, 4, 5])
    const chunk4 = collection4.splice(2, 2, [10, 11])
    expect(await collection4.all()).to.equal([1, 2, 10, 11, 5])
    expect(await chunk4.all()).to.equal([3, 4])

    // takes more items than available
    const collection5 = Collect([1, 2, 3, 4, 5])
    const chunk5 = collection5.splice(2, 10)
    expect(await collection5.all()).to.equal([1, 2])
    expect(await chunk5.all()).to.equal([3, 4, 5])
  })

  it('some', async () => {
    const start = Date.now()

    expect(
      await Collect([1, 2, 3]).some(item => item > 5)
    ).to.be.false()

    const elapsed = Date.now() - start
    expect(elapsed < 100).to.be.true()

    expect(
      await Collect([1, 2, 3]).some(item => item < 10)
    ).to.be.true()
  })

  it('forEach', async () => {
    const start = Date.now()

    await Collect([1, 2, 3, 4])
      .forEach(async item => {
        await pause(item * 10)
      })

    const elapsed = Date.now() - start
    expect(elapsed < 50).to.be.true()

    const callback = Sinon.spy()

    await Collect([1, 2, 3]).forEach(callback)

    expect(callback.called).to.be.true()
    expect(callback.calledWith(1)).to.be.true()
    expect(callback.calledWith(2)).to.be.true()
    expect(callback.calledWith(3)).to.be.true()
    expect(callback.calledWith(4)).to.be.false()
  })

  it('forEachSeries', async () => {
    const start = Date.now()

    await Collect([1, 2, 3, 4])
      .forEachSeries(async item => {
        await pause(item * 10)
      })

    const elapsed = Date.now() - start
    expect(elapsed >= 100 && elapsed < 150).to.be.true() // functions should run in sequence

    const callback = Sinon.spy()

    await Collect([1, 2, 3]).forEachSeries(callback)

    expect(callback.called).to.be.true()
    expect(callback.calledWith(1)).to.be.true()
    expect(callback.calledWith(2)).to.be.true()
    expect(callback.calledWith(3)).to.be.true()
  })

  it('isEmpty', async () => {
    expect(
      await Collect().isEmpty()
    ).to.be.true()

    expect(
      await Collect([1, 2, 3]).isEmpty()
    ).to.be.false()
  })

  it('isNotEmpty', async () => {
    expect(
      await Collect().isNotEmpty()
    ).to.be.false()

    expect(
      await Collect([1, 2, 3]).isNotEmpty()
    ).to.be.true()
  })

  it('collapse', async () => {
    expect(
      await Collect([[1], [{}, 'Marcus', true], [22]])
        .collapse()
        .all()
    ).to.equal([1, {}, 'Marcus', true, 22])
  })

  it('compact', async () => {
    expect(
      await Collect([0, null, undefined, 1, false, 2, '', 3, NaN])
        .compact()
        .all()
    ).to.equal([1, 2, 3])
  })

  it('throws', async () => {
    const fn = () => { throw new Error() }

    expect(
      Collect([1, 2, 3]).forEach(fn)
    ).to.reject()
  })
})
