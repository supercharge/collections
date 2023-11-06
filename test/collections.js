
import { test } from 'uvu'
import { Collect } from '../dist/index.js'
import { expect } from './helpers/expect.js'

const pause = ms => new Promise(resolve => setTimeout(resolve, ms))

test('returns an empty array when used without data', async () => {
  expect(
    await Collect().map(async item => item)
  ).toEqual([])
})

test('wraps the initial data in an array if not already array', async () => {
  expect(
    await Collect('Marcus').map(async item => item)
  ).toEqual(['Marcus'])
})

test('ensures an empty array when passing an empty value', async () => {
  expect(
    await Collect().map(async item => item)
  ).toEqual([])

  expect(
    await Collect(null).map(async item => item)
  ).toEqual([])
})

test('processes a collection pipeline', async () => {
  const result = await Collect([1, 2, 3])
    .map(async item => item * 2)
    .filter(async item => item > 2)

  expect(result).toEqual([4, 6])
})

test('chunk', async () => {
  expect(
    await Collect([1, 2, 3, 4, 5, 6, 7, 8])
      .map(async item => item * 10)
      .filter(item => item > 50)
      .chunk(2)
  ).toEqual([[60, 70], [80]])
})

test('collapse', async () => {
  expect(
    await Collect([[1], [{}, 'Marcus', true], [22]])
      .map(async item => item)
      .collapse()

  ).toEqual([1, {}, 'Marcus', true, 22])
})

test('flatten', async () => {
  expect(
    await Collect([1, 2, [3, 4]])
      .map(async item => item)
      .flatten()

  ).toEqual([1, 2, 3, 4])
})

test('compact', async () => {
  expect(
    await Collect([0, null, undefined, 1, false, 2, '', 3, NaN])
      .map(async item => item)
      .compact()
  ).toEqual([1, 2, 3])
})

test('map', async () => {
  const start = Date.now()

  expect(
    await Collect([1, 2, 3])
      .map(async item => {
        await pause(10)

        return item * 10
      })
  ).toEqual([10, 20, 30])

  const elapsed = Date.now() - start
  expect(elapsed >= 30).toBe(true) // map should run in sequence

  expect(
    await Collect([1, 2, 3])
      .filter(async item => item > 0)
      .map(async item => {
        await pause(10)

        return item * 10
      })
  ).toEqual([10, 20, 30])
})

test('mapIf', async () => {
  const start = Date.now()

  expect(
    await Collect([1, 2, 3]).mapIf(2 > 1, async (item) => {
      await pause(5)

      return item * 100
    })
  ).toEqual([100, 200, 300])

  const elapsed = Date.now() - start
  expect(elapsed).toBeWithinRange(14, 50)

  expect(
    await Collect([1, 2, 3])
      .map(async item => item)
      .mapIf(1 > 7, async (item) => {
        return item * 100
      })
  ).toEqual([1, 2, 3])
})

test('flatMap', async () => {
  const start = Date.now()

  expect(
    await Collect([1, 2, 3])
      .flatMap(async item => {
        await pause(10)

        return [item, item]
      })
  ).toEqual([1, 1, 2, 2, 3, 3])

  const elapsed = Date.now() - start
  expect(elapsed >= 30).toBe(true) // map should run in sequence

  expect(
    await Collect([1, 2, 3])
      .map(async item => item)
      .flatMap(async item => {
        await pause(10)

        return [item, item]
      })
  ).toEqual([1, 1, 2, 2, 3, 3])

  expect(
    await Collect([[1], [2], [3]])
      .flatMap(async item => item)
      .filter(async item => item > 2)
  ).toEqual([3])
})

test('filter', async () => {
  const start = Date.now()

  expect(
    await Collect([1, 2, 3]).filter(async (item) => {
      await pause(10)

      return item > 1
    })
  ).toEqual([2, 3])

  const elapsed = Date.now() - start
  expect(elapsed).toBeWithinRange(29, 100)

  expect(
    await Collect([1, 2, 3])
      .map(async item => item)
      .filter(async (item) => {
        await pause(10)

        return item > 1
      })
  ).toEqual([2, 3])
})

test('filterIf', async () => {
  const start = Date.now()

  expect(
    await Collect([1, 2, 3]).filterIf(2 > 1, async (item) => {
      await pause(5)

      return item > 1
    })
  ).toEqual([2, 3])

  const elapsed = Date.now() - start
  expect(elapsed).toBeWithinRange(14, 50)

  expect(
    await Collect([1, 2, 3])
      .map(async item => item)
      .filterIf(1 > 7, async (item) => {
        return item > 1
      })
  ).toEqual([1, 2, 3])
})

test('reject', async () => {
  const start = Date.now()

  expect(
    await Collect([1, 2, 3, 4, 5]).reject(async (item) => {
      await pause(10)

      return item % 2 === 1 // remove all odds
    })
  ).toEqual([2, 4])

  const elapsed = Date.now() - start
  expect(elapsed >= 50).toBe(true)

  expect(
    await Collect([1, 2, 3, 4, 5])
      .map(async item => item)
      .reject(async (item) => {
        await pause(10)

        return item % 2 === 1 // remove all odds
      })
  ).toEqual([2, 4])
})

test('reduce', async () => {
  expect(
    await Collect([1, 2, 3]).reduce(async (carry, item) => {
      await pause(10)

      return carry + item
    }, 0)
  ).toEqual(6)

  expect(
    await Collect(['one', 'two', 'three'])
      .map(async item => item)
      .reduce(async (carry, item) => {
        return `${carry}---${item}`
      }, 'hey')
  ).toEqual('hey---one---two---three')
})

test('reduceRight', async () => {
  expect(
    await Collect([1, 2, 3, 4, 5]).reduceRight(async (carry, item) => {
      await pause(10)

      return `${carry}${item}`
    }, '')
  ).toEqual('54321')

  expect(
    await Collect([1, 2, 3, 4, 5])
      .map(async item => item)
      .reduceRight(async (carry, item) => {
        await pause(10)

        return carry.concat(item)
      }, [])
  ).toEqual([5, 4, 3, 2, 1])
})

test('find', async () => {
  const start = Date.now()

  expect(
    await Collect([1, 2, 3]).find(async item => item === 2)
  ).toEqual(2)

  const elapsed = Date.now() - start
  expect(elapsed < 100).toBe(true)

  expect(
    await Collect([1, 2, 3])
      .map(async item => item)
      .find(item => item === 10)
  ).toBeUndefined()
})

test('every', async () => {
  const start = Date.now()

  expect(
    await Collect([1, 2, 3]).every(async item => item === 2)
  ).toBe(false)

  const elapsed = Date.now() - start
  expect(elapsed < 100).toBe(true)

  expect(
    await Collect([1, 2, 3])
      .map(async item => item)
      .every(async item => item < 10)
  ).toBe(true)
})

test('max', async () => {
  expect(
    await Collect([1, 2, 3])
      .map(async item => item * 2)
      .max()
  ).toEqual(6)
})

test('diff', async () => {
  expect(
    await Collect([1, 2, 3])
      .map(async item => item * 2)
      .diff([1, 3, 5, 7])
  ).toEqual([2, 4, 6])
})

test('slice', async () => {
  const collection = Collect([1, 2, 3, 4, 5, 6]).map(async item => item)
  const chunk = collection.slice(3, 2)

  expect(await collection).toEqual([1, 2, 3, 4, 5, 6])
  expect(await chunk).toEqual([4, 5])
})

test('splice', async () => {
  const collection = Collect([1, 2, 3, 4, 5])
    .map(async item => item * 10)
    .filter(item => item > 10)

  const chunk7 = collection.splice(0, 1)
  expect(await collection).toEqual([30, 40, 50])
  expect(await chunk7).toEqual([20])

  // splices all items when passing "null" as limit
  const collection2 = Collect([1, 2, 3, 4, 5])
    .map(async item => item * 10)
    .filter(item => item > 10)

  expect(
    await collection2.splice(0, null)
  ).toEqual([20, 30, 40, 50])
})

test('some', async () => {
  const start = Date.now()

  expect(
    await Collect([1, 2, 3]).some(async item => {
      await pause(10)

      return item > 5
    })
  ).toBe(false)

  const elapsed = Date.now() - start
  expect(elapsed).toBeWithinRange(29, 40)

  expect(
    await Collect([1, 2, 3])
      .map(async item => item)
      .some(async item => item < 10)
  ).toBe(true)
})

test('any', async () => {
  const start = Date.now()

  expect(
    await Collect([1, 2, 3]).any(async item => {
      await pause(10)

      return item > 5
    })
  ).toBe(false)

  const elapsed = Date.now() - start
  expect(elapsed).toBeWithinRange(29, 40)

  expect(
    await Collect([1, 2, 3]).any(async item => item < 10)
  ).toBe(true)

  // only checks the necessary items
  const seenItems = []
  expect(
    await Collect([1, 2, 3, 4]).any(async item => {
      seenItems.push(item)

      return item > 1
    })
  ).toBe(true)
  expect(seenItems).toEqual([1, 2])
})

test('sum', async () => {
  expect(
    await Collect([1, 2, 3])
      .map(async item => item * 2)
      .intersect([4, 6])
      .sum()
  ).toEqual(10)
})

test('forEach', async () => {
  const start = Date.now()

  await Collect([1, 2, 3, 4]).forEach(async () => {
    await pause(10)
  })

  const elapsed = Date.now() - start
  expect(elapsed).toBeWithinRange(39, 50)

  const items = []

  await Collect([1, 2, 3]).forEach(item => {
    items.push(item)
  })

  expect(items).toEqual([1, 2, 3])

  let value = 0
  await Collect([1, 2, 3, 4])
    .map(async item => item)
    .forEach(async () => {
      value = 10
      await pause(10)
    })

  expect(value).toEqual(10)
})

test('intersect', async () => {
  expect(
    await Collect([1, 2, 3, 3])
      .map(async item => item * 2)
      .intersect([4, 5, 6])

  ).toEqual([4, 6])
})

test('isEmpty', async () => {
  expect(await Collect().map(async item => item).isEmpty()).toBe(true)
  expect(await Collect(null).map(async item => item).isEmpty()).toBe(true)
  expect(await Collect(undefined).map(async item => item).isEmpty()).toBe(true)

  expect(await Collect([1, 2, 3]).map(async item => item).isEmpty()).toBe(false)
})

test('isNotEmpty', async () => {
  expect(await Collect().map(async item => item).isNotEmpty()).toBe(false)
  expect(await Collect(null).map(async item => item).isNotEmpty()).toBe(false)
  expect(await Collect(undefined).map(async item => item).isNotEmpty()).toBe(false)

  expect(await Collect([1, 2, 3]).map(async item => item).isNotEmpty()).toBe(true)
})

test('join', async () => {
  expect(
    await Collect([1, 2, 3]).join('-.-')
  ).toEqual('1-.-2-.-3')

  expect(
    await Collect([1, 2, 3])
      .map(async item => item * 2)
      .join('-')
  ).toEqual('2-4-6')
})

test('take', async () => {
  const collection = Collect([1, 2, 3, 4, 5, 6])
    .map(async item => item * 10)
    .filter(item => item > 20)

  const all = collection.take(30)
  expect(await collection).toEqual([30, 40, 50, 60])
  expect(await all).toEqual([30, 40, 50, 60])

  const lastTwo = collection.take(-2)
  expect(await collection).toEqual([30, 40, 50, 60])
  expect(await lastTwo).toEqual([50, 60])
})

test('takeAndRemove', async () => {
  const pipeline = Collect([1, 2, 3, 4, 5, 6])
    .map(async item => item * 10)
    .filter(item => item > 20)

  const all = pipeline.takeAndRemove(30)
  expect(await pipeline).toEqual([])
  expect(await all).toEqual([30, 40, 50, 60])

  const collection = Collect([1, 2, 3, 4, 5, 6]).map(async item => item)
  const lastTwo = collection.takeAndRemove(-2)
  expect(await lastTwo).toEqual([5, 6])
  expect(await collection).toEqual([1, 2, 3, 4])
})

test('unique', async () => {
  const users = [
    { name: 'Marcus' },
    { name: 'Marcus' },
    { name: 'Supercharge' }
  ]

  // with callback
  expect(
    await Collect(users).unique(async item => item.name)
  ).toEqual([
    { name: 'Marcus' },
    { name: 'Supercharge' }
  ])

  // with key
  const uniqueNames = Collect(users)

  expect(
    await uniqueNames
      .map(async item => item)
      .unique('name')
  ).toEqual([
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
  ).toEqual([
    { name: 'Marcus' },
    { name: 'Supercharge' }
  ])
})

test('uniqueBy', async () => {
  const items = [
    { name: 'Marcus' },
    { name: 'Supercharge' },
    { name: 'Marcus' }
  ]

  expect(
    await Collect(items).uniqueBy(async item => {
      return item.name
    })
  ).toEqual([
    { name: 'Marcus' },
    { name: 'Supercharge' }
  ])

  expect(
    await Collect(items)
      .map(async item => item)
      .uniqueBy(async item => {
        return item.name
      })
  ).toEqual([
    { name: 'Marcus' },
    { name: 'Supercharge' }
  ])
})

test('union', async () => {
  expect(
    await Collect([1, 2, 3])
      .map(async item => item * 2)
      .union([10, 20])
  ).toEqual([2, 4, 6, 10, 20])
})

test('push', async () => {
  expect(
    await Collect([1, 2, 3])
      .map(async item => item * 2)
      .filter(item => item > 5)
      .push(10, 20, 30)

  ).toEqual([6, 10, 20, 30])
})

test('pop', async () => {
  const asyncPipeline = Collect([1, 2, 3, 4, 5])
    .map(async item => item * 10)
    .filter(item => item > 20)

  const fifty = await asyncPipeline.pop()
  expect(fifty).toEqual(50)
  expect(await asyncPipeline).toEqual([30, 40])
})

test('shift', async () => {
  const pipeline = Collect([1, 2, 3, 4, 5])
    .map(async item => item * 2)
    .filter(item => item > 5)

  const six = await pipeline.shift()
  expect(six).toEqual(6)
  expect(await pipeline).toEqual([8, 10])
})

test('concat', async () => {
  const collection = Collect([1, 2, 3])
    .map(async item => item * 2)
    .filter(item => item > 5)

  expect(
    await collection.concat(10, 20)
  ).toEqual([6, 10, 20])
})

test('sort', async () => {
  expect(
    await Collect([3, 2, 1])
      .map(async item => item * 2)
      .sort()
  ).toEqual([2, 4, 6])
})

test('unshift', async () => {
  expect(
    await Collect([1, 2, 3])
      .map(async item => item * 2)
      .filter(item => item > 5)
      .unshift(10, 20, 30)
  ).toEqual([10, 20, 30, 6])
})

test('min', async () => {
  expect(
    await Collect([10, 2, -1, 4])
      .map(async item => item * 2)
      .min()
  ).toEqual(-2)
})

test('first', async () => {
  expect(
    await Collect([{ id: 1, name: '1' }]).first(async item => {
      return item.name === 'Marcus'
    })
  ).toEqual(undefined)

  expect(
    await Collect([1, 2, 3])
      .map(async item => item)
      .first()
  ).toEqual(1)

  await expect(
    Collect([1, 2, 3])
      .map(async item => item)
      .first('non-function')
  ).rejects.toThrow()

  expect(
    await Collect([{ id: 1, name: '1' }])
      .map(async item => item)
      .first(async item => {
        return item.id === 1
      })
  ).toEqual({ id: 1, name: '1' })
})

test('has', async () => {
  expect(
    await Collect([1, 2, 3]).has(async item => item === 4)
  ).toEqual(false)

  expect(
    await Collect([1, 2, 3])
      .map(async item => item)
      .has(async item => item === 1)
  ).toBe(true)

  expect(
    await Collect([1, 2, 3])
      .map(async item => item)
      .has(5)
  ).toBe(false)

  expect(
    await Collect([1, 2, 3])
      .map(async item => item)
      .has(1)
  ).toBe(true)
})

test('includes', async () => {
  expect(
    await Collect([1, 2, 3]).includes(async item => item === 4)
  ).toEqual(false)

  expect(
    await Collect([1, 2, 3])
      .map(async item => item)
      .includes(async item => item === 1)
  ).toBe(true)

  expect(
    await Collect([1, 2, 3])
      .map(async item => item)
      .includes(5)
  ).toBe(false)

  expect(
    await Collect([1, 2, 3])
      .map(async item => item)
      .includes(1)
  ).toBe(true)
})

test('throws', async () => {
  await expect(
    Collect([1, 2, 3]).forEach(async () => {
      throw new Error()
    })
  ).rejects.toThrow()
})

test('reverse', async () => {
  expect(
    await Collect([1, 2, 3])
      .map(async item => item)
      .reverse()
  ).toEqual([3, 2, 1])
})

test('avg', async () => {
  expect(
    await Collect([1, 2, 3])
      .map(async item => item * 2)
      .avg()
  ).toEqual(4)
})

test('median', async () => {
  expect(
    await Collect([1, 2, 3])
      .map(async item => item)
      .median()
  ).toEqual(2)

  expect(
    await Collect([1, 3, 2])
      .map(async item => item * 2)
      .median()
  ).toEqual(4)

  expect(
    await Collect([1, 4, 12, 2, 3, 47])
      .map(async item => item * 2) // 2, 8, 24, 4, 6, 94
      .median() // 2, 4, 6, 8, 24, 94
  ).toEqual(7)
})

test('last', async () => {
  expect(
    await Collect([{ id: 1, name: '1' }]).last(async item => {
      return item.name === 'Marcus'
    })
  ).toBeUndefined()

  const items = [1, 2, 3]
  expect(
    await Collect(items)
      .map(async item => item * 10)
      .last()
  ).toEqual(30)
  expect(items).toEqual([1, 2, 3])

  await expect(
    Collect(items)
      .map(async item => item * 10)
      .last('name')
  ).rejects.toThrow()
})

test('tap', async () => {
  expect(
    await Collect([1, 2, 3])
      .map(async value => value * 2)
      .tap(value => value * 10)
      .filter(value => value > 4)
  ).toEqual([6])
})

test('hasDuplicates', async () => {
  expect(
    await Collect([1, 1, 2])
      .map(async value => value * 2)
      .hasDuplicates()
  ).toBe(true)
})

test('groupBy', async () => {
  const products = [
    { name: 'Macbook', price: 2500 },
    { name: 'Macbook', price: 3000 },
    { name: 'iPhone', price: 1000 }
  ]

  await expect(
    Collect(products).groupBy('name.price')
  ).rejects.toThrow()

  expect(
    await Collect(products).groupBy('nonExistentKey')
  ).toEqual({ '': products })

  expect(
    await Collect(products).groupBy('name')
  ).toEqual({
    Macbook: [
      { name: 'Macbook', price: 2500 },
      { name: 'Macbook', price: 3000 }
    ],
    iPhone: [
      { name: 'iPhone', price: 1000 }
    ]
  })
})

test('pluck', async () => {
  const users = [
    { id: 1, name: 'Marcus', email: 'marcus@test.com' },
    { id: 2, name: 'Norman', email: 'norman@test.com' },
    { id: 3, name: 'Christian', email: 'christian@test.com' }
  ]

  const collection = Collect(users).map(async item => item)

  expect(
    await collection.pluck('name')
  ).toEqual(['Marcus', 'Norman', 'Christian'])

  expect(
    await collection.pluck(['name', 'email'])
  ).toEqual([
    { name: 'Marcus', email: 'marcus@test.com' },
    { name: 'Norman', email: 'norman@test.com' },
    { name: 'Christian', email: 'christian@test.com' }
  ])

  expect(await collection).toEqual(users)
})

test('then', async () => {
  expect(
    await Collect([1, 2, 3]).map(async item => item * 2)
  ).toEqual([2, 4, 6])

  expect(
    await Collect([1, 2, 3])
      .map(async item => item * 2)
      .union([1, 3, 5])
      .filter(item => item > 0)
      .sort((a, b) => a - b)
  ).toEqual([1, 2, 3, 4, 5, 6])

  expect(
    await Collect([1, 2, 3]).every(async item => item > 5)
  ).toBe(false)

  await expect(
    Collect([1, 2, 3]).map(async () => {
      throw new Error('failed')
    })
  ).rejects.toThrow('failed')
})

test('count', async () => {
  expect(
    await Collect([1, 2, 3])
      .map(async item => item)
      .count()
  ).toEqual(3)

  expect(
    await Collect([1, 2, 3])
      .map(async item => item)
      .count(async item => {
        return item > 2
      })
  ).toEqual(1)

  expect(
    await Collect([1, 2, 3]).count(async item => {
      return item > 2
    })
  ).toEqual(1)
})

test('size', async () => {
  expect(
    await Collect([1, 2, 3])
      .map(async item => item)
      .size()
  ).toEqual(3)
})

test('toJSON', async () => {
  expect(
    await Collect([11, 22, 33, 44, 55, 66])
      .map(async item => item)
      .toJSON()
  ).toEqual('[11,22,33,44,55,66]')
})

test.run()
