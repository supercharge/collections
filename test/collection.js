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
      .map(async item => item * 2)
      .filter(async item => item > 2)
      .all()

    expect(result).to.equal([4, 6])
  })

  it('chunk', async () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8]

    expect(
      await Collect(input)
        .chunk(3)
        .all()
    ).to.equal([[1, 2, 3], [4, 5, 6], [7, 8]])
    expect(input).to.equal([1, 2, 3, 4, 5, 6, 7, 8])

    expect(
      await Collect([1, 2, 3, 4, 5, 6, 7, 8])
        .map(item => item * 10)
        .filter(item => item > 50)
        .chunk(2)
        .all()
    ).to.equal([[60, 70], [80]])
  })

  it('clone', async () => {
    const collection = Collect([1, 2, 3])
    const shallow = collection.clone()
    expect(collection === shallow).to.be.false()
    expect(collection[0] === shallow[0]).to.be.true()

    const objects = Collect([{ name: 'Marcus' }])
    const clone = collection.clone()
    expect(objects === clone).to.be.false()
    expect(objects[0] === clone[0]).to.be.true()
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
    expect(elapsed < 80).to.be.true()
  })

  it('filterSeries', async () => {
    const start = Date.now()

    expect(
      await Collect([1, 2, 3])
        .filterSeries(async (item) => {
          await pause(50)

          return item > 1
        })
        .all()
    ).to.equal([2, 3])

    const elapsed = Date.now() - start
    expect(elapsed >= 150 && elapsed < 200).to.be.true() // filter should run in sequence
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

  it('rejectSeries', async () => {
    const start = Date.now()

    expect(
      await Collect([1, 2, 3])
        .rejectSeries(async (item) => {
          await pause(50)

          return item % 2 === 0 // remove all evens
        })
        .all()
    ).to.equal([1, 3])

    const elapsed = Date.now() - start
    expect(elapsed >= 150 && elapsed < 200).to.be.true() // reject should run in sequence
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

  it('findSeries', async () => {
    const start = Date.now()

    expect(
      await Collect([1, 2, 3]).findSeries(async item => {
        await pause(50)
        return item === 2
      })
    ).to.equal(2)

    const elapsed = Date.now() - start
    expect(elapsed >= 150 && elapsed < 200).to.be.true() // find should run in sequence

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

  it('everySeries', async () => {
    const start = Date.now()

    expect(
      await Collect([1, 2, 3]).everySeries(async item => {
        await pause(50)

        return item > 5
      })
    ).to.be.false()

    const elapsed = Date.now() - start
    expect(elapsed >= 150 && elapsed < 200).to.be.true()

    expect(
      await Collect([1, 2, 3]).map(item => item * 10).everySeries(item => item > 5)
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

  it('max', async () => {
    expect(
      await Collect([10, 20, 2, 1]).max()
    ).to.equal(20)

    expect(
      await Collect([55, 5, 10]).max()
    ).to.equal(55)
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

    // keeps order of collection pipeline
    const collection6 = Collect([1, 2, 3, 4, 5]).map(item => item * 10).filter(item => item > 10)
    const chunk6 = collection6.splice(0, 1)
    expect(await collection6.all()).to.equal([30, 40, 50])
    expect(await chunk6.all()).to.equal([20])
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

  it('someSeries', async () => {
    const start = Date.now()

    expect(
      await Collect([1, 2, 3]).someSeries(async item => {
        await pause(50)

        return item > 5
      })
    ).to.be.false()

    const elapsed = Date.now() - start
    expect(elapsed >= 150 && elapsed < 200).to.be.true()

    expect(
      await Collect([1, 2, 3]).map(item => item * 2).someSeries(item => item > 5)
    ).to.be.true()
  })

  it('sum', async () => {
    expect(
      await Collect([1, 2, 3]).sum()
    ).to.equal(6)
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

  it('intersect', async () => {
    const items = [1, 2, 3, 3]
    const collection = await Collect(items)
    const intersect = collection.intersect([2, 3, 4, 5])
    expect(await intersect.all()).to.equal([2, 3])
    expect(await collection.all()).to.equal(items)
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

  it('take', async () => {
    const items = [1, 2, 3, 4, 5, 6]
    const collection = await Collect(items)

    const firstTwo = collection.take(2)
    expect(await collection.all()).to.equal(items)
    expect(await firstTwo.all()).to.equal([1, 2])

    const lastTwo = collection.take(-2)
    expect(await collection.all()).to.equal(items)
    expect(await lastTwo.all()).to.equal([5, 6])

    const pipeline = await Collect([1, 2, 3, 4, 5, 6])
      .map(item => item * 10)
      .filter(item => item > 20)
    const all = pipeline.take(30)
    expect(await pipeline.all()).to.equal([30, 40, 50, 60])
    expect(await all.all()).to.equal([30, 40, 50, 60])
  })

  it('takeAndRemove', async () => {
    const collection = await Collect([1, 2, 3, 4, 5, 6])
    const firstTwo = collection.takeAndRemove(2)
    expect(await collection.all()).to.equal([3, 4, 5, 6])
    expect(await firstTwo.all()).to.equal([1, 2])

    const collection2 = await Collect([1, 2, 3, 4, 5, 6])
    const lastTwo = collection2.takeAndRemove(-2)
    expect(await lastTwo.all()).to.equal([5, 6])
    expect(await collection2.all()).to.equal([1, 2, 3, 4])

    const pipeline = await Collect([1, 2, 3, 4, 5, 6])
      .map(item => item * 10)
      .filter(item => item > 20)
    const all = pipeline.takeAndRemove(30)
    expect(await pipeline.all()).to.equal([])
    expect(await all.all()).to.equal([30, 40, 50, 60])
  })

  it('toJSON', async () => {
    expect(
      await Collect([11, 22, 33, 44, 55, 66]).toJSON()
    ).to.be.equal('[11,22,33,44,55,66]')

    expect(
      await Collect([{ test: 'value1', test2: 2 }]).toJSON()
    ).to.be.equal('[{"test":"value1","test2":2}]')
  })

  it('unique', async () => {
    const items = [1, 2, 2, 1, 3, 4, 4]
    const collection = await Collect(items)
    const unique = collection.unique()

    expect(await unique.all()).to.equal([1, 2, 3, 4])
    expect(await collection.all()).to.equal(items)
  })

  it('union', async () => {
    const items = [1, 2, 3]
    const collection = await Collect(items)
    const union = collection.union([2, 3, 4, 5])

    expect(await union.all()).to.equal([1, 2, 3, 4, 5])
    expect(await collection.all()).to.equal(items)
  })

  it('push', async () => {
    expect(
      await Collect([1, 2, 3])
        .push(4)
        .all()
    ).to.equal([1, 2, 3, 4])

    expect(
      await Collect([1, 2, 3])
        .push(4, 5, 6)
        .all()
    ).to.equal([1, 2, 3, 4, 5, 6])

    expect(
      await Collect([1, 2, 3])
        .map(item => item * 2)
        .filter(item => item > 5)
        .push(10, 20, 30)
        .all()
    ).to.equal([6, 10, 20, 30])
  })

  it('shift', async () => {
    const collection = Collect([1, 2, 3])
    const first = await collection.shift()
    expect(first).to.equal(1)
    expect(await collection.all()).to.equal([2, 3])

    const pipeline = Collect([1, 2, 3]).map(item => item * 2).filter(item => item > 5)
    const six = await pipeline.shift()
    expect(six).to.equal(6)
    expect(await pipeline.all()).to.equal([])
  })

  it('concat', async () => {
    const collection = Collect([1, 2, 3])
    const concat = await collection.concat([4, 5])
    expect(await collection.all()).to.equal([1, 2, 3])
    expect(await concat.all()).to.equal([1, 2, 3, 4, 5])

    const collection1 = Collect([1, 2, 3])
    const concat1 = await collection1.concat(4, 5)
    expect(await collection1.all()).to.equal([1, 2, 3])
    expect(await concat1.all()).to.equal([1, 2, 3, 4, 5])

    const pipeline = Collect([1, 2, 3]).map(item => item * 2).filter(item => item > 5)
    const pipedConcat = await pipeline.concat([10, 20])
    expect(await pipeline.all()).to.equal([6])
    expect(await pipedConcat.all()).to.equal([6, 10, 20])
  })

  it('unshift', async () => {
    expect(
      await Collect([1, 2, 3])
        .unshift(4, 5)
        .all()
    ).to.equal([4, 5, 1, 2, 3])

    expect(
      await Collect([1, 2, 3])
        .map(item => item * 2)
        .filter(item => item > 5)
        .unshift(10, 20, 30)
        .all()
    ).to.equal([10, 20, 30, 6])
  })

  it('first', async () => {
    expect(
      await Collect([1, 2, 3]).first()
    ).to.equal(1)

    expect(
      Collect([1, 2, 3]).first(1)
    ).to.reject(Error) // only callback functions are allowed

    expect(
      await Collect([
        { id: 1, name: '1' },
        { id: 2, name: '2' },
        { id: 1, name: '3' }
      ]).first(item => {
        return item.id === 1
      })
    ).to.equal({ id: 1, name: '1' })

    expect(
      await Collect([{ id: 1, name: '1' }]).first(item => {
        return item.name === 'Marcus'
      })
    ).to.equal(undefined)

    expect(
      await Collect([1, 2, 3]).has(item => item === 4)
    ).to.equal(false)
  })

  it('has', async () => {
    expect(
      await Collect([1, 2, 3]).has(item => item === 2)
    ).to.equal(true)

    expect(
      await Collect([1, 2, 3]).has(3)
    ).to.equal(true)

    expect(
      await Collect([1, 2, 3]).has(item => item === 4)
    ).to.equal(false)
  })

  it('throws', async () => {
    const fn = () => { throw new Error() }

    expect(
      Collect([1, 2, 3]).forEach(fn)
    ).to.reject()
  })

  it('reverse', async () => {
    expect(
      await Collect([1, 2, 3]).reverse().all()
    ).to.equal([3, 2, 1])

    expect(
      await Collect([1]).reverse().all()
    ).to.equal([1])

    expect(
      await Collect([]).reverse().all()
    ).to.equal([])

    expect(
      await Collect([1, 2, 3, 2, 1]).reverse().all()
    ).to.equal([1, 2, 3, 2, 1])

    const items = [1, 2, 3]
    const collection = Collect(items)

    expect(
      await collection.reverse().all()
    ).to.equal([3, 2, 1])
    expect(
      await collection.all()
    ).to.equal([1, 2, 3])
  })

  it('avg', async () => {
    expect(
      await Collect([1, 2, 3]).avg()
    ).to.equal(2)

    expect(
      await Collect([4, 1]).avg()
    ).to.equal(2.5)
  })
})
