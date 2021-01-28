'use strict'

const Sinon = require('sinon')
const Lab = require('@hapi/lab')
const Collect = require('../dist')
const { expect } = require('@hapi/code')

const { describe, it } = (exports.lab = Lab.script())

const pause = ms => new Promise(resolve => setTimeout(resolve, ms))

describe('Chained Collection ->', () => {
  it('returns an empty array when used without data', async () => {
    expect(
      await Collect().map(async item => item)
    ).to.equal([])
  })

  it('wraps the initial data in an array if not already array', async () => {
    expect(
      await Collect('Marcus').map(async item => item)
    ).to.equal(['Marcus'])
  })

  it('ensures an empty array when passing an empty value', async () => {
    expect(
      await Collect().map(async item => item)
    ).to.equal([])

    expect(
      await Collect(null).map(async item => item)
    ).to.equal([])
  })

  it('processes a collection pipeline', async () => {
    const result = await Collect([1, 2, 3])
      .map(async item => item * 2)
      .filter(async item => item > 2)

    expect(result).to.equal([4, 6])
  })

  it('chunk', async () => {
    expect(
      await Collect([1, 2, 3, 4, 5, 6, 7, 8])
        .map(async item => item * 10)
        .filter(item => item > 50)
        .chunk(2)
    ).to.equal([[60, 70], [80]])
  })

  it('collapse', async () => {
    expect(
      await Collect([[1], [{}, 'Marcus', true], [22]])
        .map(async item => item)
        .collapse()

    ).to.equal([1, {}, 'Marcus', true, 22])
  })

  it('flatten', async () => {
    expect(
      await Collect([1, 2, [3, 4]])
        .map(async item => item)
        .flatten()

    ).to.equal([1, 2, 3, 4])
  })

  it('compact', async () => {
    expect(
      await Collect([0, null, undefined, 1, false, 2, '', 3, NaN])
        .map(async item => item)
        .compact()
    ).to.equal([1, 2, 3])
  })

  it('map', async () => {
    const start = Date.now()

    expect(
      await Collect([1, 2, 3])
        .map(async item => {
          await pause(10)

          return item * 10
        })
    ).to.equal([10, 20, 30])

    const elapsed = Date.now() - start
    expect(elapsed >= 30).to.be.true() // map should run in sequence

    expect(
      await Collect([1, 2, 3])
        .filter(async item => item > 0)
        .map(async item => {
          await pause(10)

          return item * 10
        })
    ).to.equal([10, 20, 30])
  })

  it('flatMap', async () => {
    const start = Date.now()

    expect(
      await Collect([1, 2, 3])
        .flatMap(async item => {
          await pause(10)

          return [item, item]
        })
    ).to.equal([1, 1, 2, 2, 3, 3])

    const elapsed = Date.now() - start
    expect(elapsed >= 30).to.be.true() // map should run in sequence

    expect(
      await Collect([1, 2, 3])
        .map(async item => item)
        .flatMap(async item => {
          await pause(10)

          return [item, item]
        })
    ).to.equal([1, 1, 2, 2, 3, 3])

    expect(
      await Collect([[1], [2], [3]])
        .flatMap(async item => item)
        .filter(async item => item > 2)
    ).to.equal([3])
  })

  it('filter', async () => {
    const start = Date.now()

    expect(
      await Collect([1, 2, 3]).filter(async (item) => {
        await pause(10)

        return item > 1
      })
    ).to.equal([2, 3])

    const elapsed = Date.now() - start
    expect(elapsed).to.be.within(29, 100)

    expect(
      await Collect([1, 2, 3])
        .map(async item => item)
        .filter(async (item) => {
          await pause(10)

          return item > 1
        })
    ).to.equal([2, 3])
  })

  it('filterIf', async () => {
    const start = Date.now()

    expect(
      await Collect([1, 2, 3]).filterIf(2 > 1, async (item) => {
        await pause(5)

        return item > 1
      })
    ).to.equal([2, 3])

    const elapsed = Date.now() - start
    expect(elapsed).to.be.within(14, 50)

    expect(
      await Collect([1, 2, 3])
        .map(async item => item)
        .filterIf(1 > 7, async (item) => {
          return item > 1
        })
    ).to.equal([1, 2, 3])
  })

  it('reject', async () => {
    const start = Date.now()

    expect(
      await Collect([1, 2, 3, 4, 5]).reject(async (item) => {
        await pause(10)

        return item % 2 === 1 // remove all odds
      })
    ).to.equal([2, 4])

    const elapsed = Date.now() - start
    expect(elapsed >= 50).to.be.true()

    expect(
      await Collect([1, 2, 3, 4, 5])
        .map(async item => item)
        .reject(async (item) => {
          await pause(10)

          return item % 2 === 1 // remove all odds
        })
    ).to.equal([2, 4])
  })

  it('reduce', async () => {
    expect(
      await Collect([1, 2, 3]).reduce(async (carry, item) => {
        await pause(10)

        return carry + item
      }, 0)
    ).to.equal(6)

    expect(
      await Collect(['one', 'two', 'three'])
        .map(async item => item)
        .reduce(async (carry, item) => {
          return `${carry}---${item}`
        }, 'hey')
    ).to.equal('hey---one---two---three')
  })

  it('reduceRight', async () => {
    expect(
      await Collect([1, 2, 3, 4, 5]).reduceRight(async (carry, item) => {
        await pause(10)

        return `${carry}${item}`
      }, '')
    ).to.equal('54321')

    expect(
      await Collect([1, 2, 3, 4, 5])
        .map(async item => item)
        .reduceRight(async (carry, item) => {
          await pause(10)

          return carry.concat(item)
        }, [])
    ).to.equal([5, 4, 3, 2, 1])
  })

  it('find', async () => {
    const start = Date.now()

    expect(
      await Collect([1, 2, 3]).find(async item => item === 2)
    ).to.equal(2)

    const elapsed = Date.now() - start
    expect(elapsed < 100).to.be.true()

    expect(
      await Collect([1, 2, 3])
        .map(async item => item)
        .find(item => item === 10)
    ).to.be.undefined()
  })

  it('every', async () => {
    const start = Date.now()

    expect(
      await Collect([1, 2, 3]).every(async item => item === 2)
    ).to.be.false()

    const elapsed = Date.now() - start
    expect(elapsed < 100).to.be.true()

    expect(
      await Collect([1, 2, 3])
        .map(async item => item)
        .every(async item => item < 10)
    ).to.be.true()
  })

  it('max', async () => {
    expect(
      await Collect([1, 2, 3])
        .map(async item => item * 2)
        .max()
    ).to.equal(6)
  })

  it('diff', async () => {
    expect(
      await Collect([1, 2, 3])
        .map(async item => item * 2)
        .diff([1, 3, 5, 7])
    ).to.equal([2, 4, 6])
  })

  it('slice', async () => {
    const collection = Collect([1, 2, 3, 4, 5, 6]).map(async item => item)
    const chunk = collection.slice(3, 2)

    expect(await collection).to.equal([1, 2, 3, 4, 5, 6])
    expect(await chunk).to.equal([4, 5])
  })

  it('splice', async () => {
    const collection = Collect([1, 2, 3, 4, 5])
      .map(async item => item * 10)
      .filter(item => item > 10)

    const chunk7 = collection.splice(0, 1)
    expect(await collection).to.equal([30, 40, 50])
    expect(await chunk7).to.equal([20])

    // splices all items when passing "null" as limit
    const collection2 = Collect([1, 2, 3, 4, 5])
      .map(async item => item * 10)
      .filter(item => item > 10)

    expect(
      await collection2.splice(0, null)
    ).to.equal([20, 30, 40, 50])
  })

  it('some', async () => {
    const start = Date.now()

    expect(
      await Collect([1, 2, 3]).some(async item => {
        await pause(10)

        return item > 5
      })
    ).to.be.false()

    const elapsed = Date.now() - start
    expect(elapsed).to.be.within(29, 40)

    expect(
      await Collect([1, 2, 3])
        .map(async item => item)
        .some(async item => item < 10)
    ).to.be.true()
  })

  it('any', async () => {
    const start = Date.now()

    expect(
      await Collect([1, 2, 3]).any(async item => {
        await pause(10)

        return item > 5
      })
    ).be.false()

    const elapsed = Date.now() - start
    expect(elapsed).to.be.within(29, 40)

    expect(
      await Collect([1, 2, 3]).any(async item => item < 10)
    ).to.be.true()
  })

  it('sum', async () => {
    expect(
      await Collect([1, 2, 3])
        .map(async item => item * 2)
        .intersect([4, 6])
        .sum()
    ).to.equal(10)
  })

  it('forEach', async () => {
    const start = Date.now()

    await Collect([1, 2, 3, 4]).forEach(async () => {
      await pause(10)
    })

    const elapsed = Date.now() - start
    expect(elapsed).to.be.within(39, 50)

    const callback = Sinon.spy()

    await Collect([1, 2, 3]).forEach(callback)

    expect(callback.called).to.be.true()
    expect(callback.calledWith(1)).to.be.true()
    expect(callback.calledWith(2)).to.be.true()
    expect(callback.calledWith(3)).to.be.true()
    expect(callback.calledWith(4)).to.be.false()

    let value = 0
    await Collect([1, 2, 3, 4])
      .map(async item => item)
      .forEach(async () => {
        value = 10
        await pause(10)
      })

    expect(value).to.equal(10)
  })

  it('intersect', async () => {
    expect(
      await Collect([1, 2, 3, 3])
        .map(async item => item * 2)
        .intersect([4, 5, 6])

    ).to.equal([4, 6])
  })

  it('isEmpty', async () => {
    expect(await Collect().map(async item => item).isEmpty()).to.be.true()
    expect(await Collect(null).map(async item => item).isEmpty()).to.be.true()
    expect(await Collect(undefined).map(async item => item).isEmpty()).to.be.true()

    expect(await Collect([1, 2, 3]).map(async item => item).isEmpty()).to.be.false()
  })

  it('isNotEmpty', async () => {
    expect(await Collect().map(async item => item).isNotEmpty()).to.be.false()
    expect(await Collect(null).map(async item => item).isNotEmpty()).to.be.false()
    expect(await Collect(undefined).map(async item => item).isNotEmpty()).to.be.false()

    expect(await Collect([1, 2, 3]).map(async item => item).isNotEmpty()).to.be.true()
  })

  it('join', async () => {
    expect(
      await Collect([1, 2, 3]).join('-.-')
    ).to.equal('1-.-2-.-3')

    expect(
      await Collect([1, 2, 3])
        .map(async item => item * 2)
        .join('-')
    ).to.equal('2-4-6')
  })

  it('take', async () => {
    const collection = Collect([1, 2, 3, 4, 5, 6])
      .map(async item => item * 10)
      .filter(item => item > 20)

    const all = collection.take(30)
    expect(await collection).to.equal([30, 40, 50, 60])
    expect(await all).to.equal([30, 40, 50, 60])

    const lastTwo = collection.take(-2)
    expect(await collection).to.equal([30, 40, 50, 60])
    expect(await lastTwo).to.equal([50, 60])
  })

  it('takeAndRemove', async () => {
    const pipeline = Collect([1, 2, 3, 4, 5, 6])
      .map(async item => item * 10)
      .filter(item => item > 20)

    const all = pipeline.takeAndRemove(30)
    expect(await pipeline).to.equal([])
    expect(await all).to.equal([30, 40, 50, 60])

    const collection = Collect([1, 2, 3, 4, 5, 6]).map(async item => item)
    const lastTwo = collection.takeAndRemove(-2)
    expect(await lastTwo).to.equal([5, 6])
    expect(await collection).to.equal([1, 2, 3, 4])
  })

  it('unique', async () => {
    const users = [
      { name: 'Marcus' },
      { name: 'Marcus' },
      { name: 'Supercharge' }
    ]

    // with callback
    expect(
      await Collect(users).unique(async item => item.name)
    ).to.equal([
      { name: 'Marcus' },
      { name: 'Supercharge' }
    ])

    // with key
    const uniqueNames = Collect(users)

    expect(
      await uniqueNames
        .map(async item => item)
        .unique('name')
    ).to.equal([
      { name: 'Marcus' },
      { name: 'Supercharge' }
    ])

    // with chain and callback
    expect(
      await Collect(users)
        .map(async item => item)
        .unique(async item => {
          return item.name
        })
    ).to.equal([
      { name: 'Marcus' },
      { name: 'Supercharge' }
    ])
  })

  it('uniqueBy', async () => {
    const items = [
      { name: 'Marcus' },
      { name: 'Supercharge' },
      { name: 'Marcus' }
    ]

    expect(
      await Collect(items).uniqueBy(async item => {
        return item.name
      })
    ).to.equal([
      { name: 'Marcus' },
      { name: 'Supercharge' }
    ])

    expect(
      await Collect(items)
        .map(async item => item)
        .uniqueBy(async item => {
          return item.name
        })
    ).to.equal([
      { name: 'Marcus' },
      { name: 'Supercharge' }
    ])
  })

  it('union', async () => {
    expect(
      await Collect([1, 2, 3])
        .map(async item => item * 2)
        .union([10, 20])
    ).to.equal([2, 4, 6, 10, 20])
  })

  it('push', async () => {
    expect(
      await Collect([1, 2, 3])
        .map(async item => item * 2)
        .filter(item => item > 5)
        .push(10, 20, 30)

    ).to.equal([6, 10, 20, 30])
  })

  it('pop', async () => {
    const asyncPipeline = Collect([1, 2, 3, 4, 5])
      .map(async item => item * 10)
      .filter(item => item > 20)

    const fifty = await asyncPipeline.pop()
    expect(fifty).to.equal(50)
    expect(await asyncPipeline).to.equal([30, 40])
  })

  it('shift', async () => {
    const pipeline = Collect([1, 2, 3, 4, 5])
      .map(async item => item * 2)
      .filter(item => item > 5)

    const six = await pipeline.shift()
    expect(six).to.equal(6)
    expect(await pipeline).to.equal([8, 10])
  })

  it('concat', async () => {
    const collection = Collect([1, 2, 3])
      .map(async item => item * 2)
      .filter(item => item > 5)

    expect(
      await collection.concat(10, 20)
    ).to.equal([6, 10, 20])
  })

  it('sort', async () => {
    expect(
      await Collect([3, 2, 1])
        .map(async item => item * 2)
        .sort()
    ).to.equal([2, 4, 6])
  })

  it('unshift', async () => {
    expect(
      await Collect([1, 2, 3])
        .map(async item => item * 2)
        .filter(item => item > 5)
        .unshift(10, 20, 30)
    ).to.equal([10, 20, 30, 6])
  })

  it('min', async () => {
    expect(
      await Collect([10, 2, -1, 4])
        .map(async item => item * 2)
        .min()
    ).to.equal(-2)
  })

  it('first', async () => {
    expect(
      await Collect([{ id: 1, name: '1' }]).first(async item => {
        return item.name === 'Marcus'
      })
    ).to.equal(undefined)

    expect(
      await Collect([1, 2, 3])
        .map(async item => item)
        .first()
    ).to.equal(1)

    await expect(
      Collect([1, 2, 3])
        .map(async item => item)
        .first('non-function')
    ).to.reject()

    expect(
      await Collect([{ id: 1, name: '1' }])
        .map(async item => item)
        .first(async item => {
          return item.id === 1
        })
    ).to.equal({ id: 1, name: '1' })
  })

  it('has', async () => {
    expect(
      await Collect([1, 2, 3]).has(async item => item === 4)
    ).to.equal(false)

    expect(
      await Collect([1, 2, 3])
        .map(async item => item)
        .has(async item => item === 1)
    ).to.be.true()

    expect(
      await Collect([1, 2, 3])
        .map(async item => item)
        .has(5)
    ).to.be.false()

    expect(
      await Collect([1, 2, 3])
        .map(async item => item)
        .has(1)
    ).to.be.true()
  })

  it('includes', async () => {
    expect(
      await Collect([1, 2, 3]).includes(async item => item === 4)
    ).to.equal(false)

    expect(
      await Collect([1, 2, 3])
        .map(async item => item)
        .includes(async item => item === 1)
    ).to.be.true()

    expect(
      await Collect([1, 2, 3])
        .map(async item => item)
        .includes(5)
    ).to.be.false()

    expect(
      await Collect([1, 2, 3])
        .map(async item => item)
        .includes(1)
    ).to.be.true()
  })

  it('throws', async () => {
    await expect(
      Collect([1, 2, 3]).forEach(async () => {
        throw new Error()
      })
    ).to.reject()
  })

  it('reverse', async () => {
    expect(
      await Collect([1, 2, 3])
        .map(async item => item)
        .reverse()
    ).to.equal([3, 2, 1])
  })

  it('avg', async () => {
    expect(
      await Collect([1, 2, 3])
        .map(async item => item * 2)
        .avg()
    ).to.equal(4)
  })

  it('median', async () => {
    expect(
      await Collect([1, 2, 3])
        .map(async item => item)
        .median()
    ).to.equal(2)

    expect(
      await Collect([1, 3, 2])
        .map(async item => item * 2)
        .median()
    ).to.equal(4)

    expect(
      await Collect([1, 4, 12, 2, 3, 47])
        .map(async item => item * 2) // 2, 8, 24, 4, 6, 94
        .median() // 2, 4, 6, 8, 24, 94
    ).to.equal(7)
  })

  it('last', async () => {
    expect(
      await Collect([{ id: 1, name: '1' }]).last(async item => {
        return item.name === 'Marcus'
      })
    ).to.be.undefined()

    const items = [1, 2, 3]
    expect(
      await Collect(items)
        .map(async item => item * 10)
        .last()
    ).to.equal(30)
    expect(items).to.equal([1, 2, 3])

    await expect(
      Collect(items)
        .map(async item => item * 10)
        .last('name')
    ).to.reject()
  })

  it('tap', async () => {
    expect(
      await Collect([1, 2, 3])
        .map(async value => value * 2)
        .tap(value => value * 10)
        .filter(value => value > 4)
    ).to.equal([6])
  })

  it('hasDuplicates', async () => {
    expect(
      await Collect([1, 1, 2])
        .map(async value => value * 2)
        .hasDuplicates()
    ).to.be.true()
  })

  it('groupBy', async () => {
    const products = [
      { name: 'Macbook', price: 2500 },
      { name: 'Macbook', price: 3000 },
      { name: 'iPhone', price: 1000 }
    ]

    const collection = Collect(products).map(async item => item)

    await expect(
      collection.groupBy('name.price')
    ).to.reject()

    expect(
      await collection.groupBy('nonExistentKey')
    ).to.equal({ '': products })

    expect(
      await collection.groupBy('name')
    ).to.equal({
      Macbook: [
        { name: 'Macbook', price: 2500 },
        { name: 'Macbook', price: 3000 }
      ],
      iPhone: [
        { name: 'iPhone', price: 1000 }
      ]
    })

    expect(await collection).to.equal(products)
  })

  it('pluck', async () => {
    const users = [
      { id: 1, name: 'Marcus', email: 'marcus@test.com' },
      { id: 2, name: 'Norman', email: 'norman@test.com' },
      { id: 3, name: 'Christian', email: 'christian@test.com' }
    ]

    const collection = Collect(users).map(async item => item)

    expect(
      await collection.pluck('name')
    ).to.equal(['Marcus', 'Norman', 'Christian'])

    expect(
      await collection.pluck(['name', 'email'])
    ).to.equal([
      { name: 'Marcus', email: 'marcus@test.com' },
      { name: 'Norman', email: 'norman@test.com' },
      { name: 'Christian', email: 'christian@test.com' }
    ])

    expect(await collection).to.equal(users)
  })

  it('then', async () => {
    expect(
      await Collect([1, 2, 3]).map(async item => item * 2)
    ).to.equal([2, 4, 6])

    expect(
      await Collect([1, 2, 3])
        .map(async item => item * 2)
        .union([1, 3, 5])
        .filter(item => item > 0)
        .sort((a, b) => a - b)
    ).to.equal([1, 2, 3, 4, 5, 6])

    expect(
      await Collect([1, 2, 3]).every(async item => item > 5)
    ).to.be.false()

    await expect(
      Collect([1, 2, 3]).map(async () => {
        throw new Error('failed')
      })
    ).to.reject('failed')
  })

  it('count', async () => {
    expect(
      await Collect([1, 2, 3])
        .map(async item => item)
        .count()
    ).to.equal(3)

    expect(
      await Collect([1, 2, 3])
        .map(async item => item)
        .count(async item => {
          return item > 2
        })
    ).to.equal(1)

    expect(
      await Collect([1, 2, 3]).count(async item => {
        return item > 2
      })
    ).to.equal(1)
  })

  it('size', async () => {
    expect(
      await Collect([1, 2, 3])
        .map(async item => item)
        .size()
    ).to.equal(3)
  })

  it('toJSON', async () => {
    expect(
      await Collect([11, 22, 33, 44, 55, 66])
        .map(async item => item)
        .toJSON()
    ).to.be.equal('[11,22,33,44,55,66]')
  })
})
