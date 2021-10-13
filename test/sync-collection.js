'use strict'

const Lab = require('@hapi/lab')
const Collect = require('../dist')
const { expect } = require('@hapi/code')

const { describe, it } = (exports.lab = Lab.script())

describe('Collection ->', () => {
  it('returns an empty array when used without data', () => {
    expect(
      Collect().all()
    ).to.equal([])
  })

  it('wraps the initial data in an array if not already array', () => {
    expect(
      Collect('Marcus').all()
    ).to.equal(['Marcus'])
  })

  it('ensures an empty array when passing an empty value', () => {
    expect(
      Collect().all()
    ).to.equal([])

    expect(
      Collect(null).all()
    ).to.equal([])
  })

  it('processes a collection pipeline', () => {
    const result = Collect([1, 2, 3])
      .map(item => item * 2)
      .filter(item => item > 2)
      .all()

    expect(result).to.equal([4, 6])
  })

  it('chunk', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8]

    expect(
      Collect(input)
        .chunk(3)
        .all()
    ).to.equal([[1, 2, 3], [4, 5, 6], [7, 8]])
    expect(input).to.equal([1, 2, 3, 4, 5, 6, 7, 8])

    expect(
      Collect(input)
        .chunk(10)
        .all()
    ).to.equal([[1, 2, 3, 4, 5, 6, 7, 8]])

    expect(
      Collect([1, 2, 3, 4, 5, 6, 7, 8])
        .map(item => item * 10)
        .filter(item => item > 50)
        .chunk(2)
        .all()
    ).to.equal([[60, 70], [80]])
  })

  it('clone', () => {
    const collection = Collect([1, 2, 3])
    const shallow = collection.clone()
    expect(collection === shallow).to.be.false()
    expect(collection[0] === shallow[0]).to.be.true()

    const objects = Collect([{ name: 'Marcus' }])
    const clone = collection.clone()
    expect(objects === clone).to.be.false()
    expect(objects[0] === clone[0]).to.be.true()
  })

  it('collapse', () => {
    expect(
      Collect([[1], [{}, 'Marcus', true], [22]])
        .collapse()
        .all()
    ).to.equal([1, {}, 'Marcus', true, 22])
  })

  it('flatten', () => {
    expect(
      Collect([1, 2, [3, 4]]).flatten().all()
    ).to.equal([1, 2, 3, 4])

    expect(
      Collect([1, [2, [3, [4]]]]).flatten().all()
    ).to.equal([1, 2, [3, [4]]])
  })

  it('compact', () => {
    expect(
      Collect([0, null, undefined, 1, false, 2, '', 3, NaN])
        .compact()
        .all()
    ).to.equal([1, 2, 3])
  })

  it('map', () => {
    expect(
      Collect([1, 2, 3]).map(item => {
        return item * 10
      }).all()
    ).to.equal([10, 20, 30])
  })

  it('flatMap', () => {
    expect(
      Collect([1, 2, 3]).flatMap(item => {
        return [item, item]
      }).all()
    ).to.equal([1, 1, 2, 2, 3, 3])
  })

  it('filter', () => {
    expect(
      Collect([1, 2, 3]).filter((item) => {
        return item > 1
      }).all()
    ).to.equal([2, 3])
  })

  it('filterIf', () => {
    expect(
      Collect([7, 8, 9]).filterIf(2 > 1, item => {
        return item > 8
      }).all()
    ).to.equal([9])

    expect(
      Collect([7, 8, 9]).filterIf(1 > 10, item => {
        return item > 8
      }).all()
    ).to.equal([7, 8, 9])
  })

  it('reject', () => {
    expect(
      Collect([1, 2, 3, 4, 5])
        .reject((item) => {
          return item % 2 === 1 // remove all odds
        })
        .all()
    ).to.equal([2, 4])
  })

  it('reduce', () => {
    expect(
      Collect([1, 2, 3]).reduce((carry, item) => {
        return carry + item
      }, 0)
    ).to.equal(6)

    expect(
      Collect(['one', 'two', 'three']).reduce((carry, item) => {
        return `${carry}---${item}`
      }, 'hey')
    ).to.equal('hey---one---two---three')
  })

  it('reduceRight', () => {
    expect(
      Collect([1, 2, 3, 4, 5]).reduceRight((carry, item) => {
        return `${carry}${item}`
      }, '')
    ).to.equal('54321')

    expect(
      Collect([1, 2, 3, 4, 5]).reduceRight((carry, item) => {
        return carry.concat(item)
      }, [])
    ).to.equal([5, 4, 3, 2, 1])
  })

  it('find', () => {
    const start = Date.now()

    expect(
      Collect([1, 2, 3]).find(item => item === 2)
    ).to.equal(2)

    const elapsed = Date.now() - start
    expect(elapsed < 100).to.be.true()

    expect(
      Collect([1, 2, 3]).find(item => item === 10)
    ).to.be.undefined()
  })

  it('every', () => {
    const start = Date.now()

    expect(
      Collect([1, 2, 3]).every(item => item === 2)
    ).to.be.false()

    const elapsed = Date.now() - start
    expect(elapsed < 100).to.be.true()

    expect(
      Collect([1, 2, 3]).every(item => item < 10)
    ).to.be.true()
  })

  it('size', () => {
    expect(
      Collect([1, 2, 3]).size()
    ).to.equal(3)

    expect(
      Collect([]).size()
    ).to.equal(0)
  })

  it('max', () => {
    expect(
      Collect([10, 20, 2, 1]).max()
    ).to.equal(20)

    expect(
      Collect([55, 5, 10]).max()
    ).to.equal(55)

    expect(
      Collect([1, 2, 3])
        .map(item => item * 2)
        .max()
    ).to.equal(6)
  })

  it('diff', () => {
    const items = [1, 2, 3]
    const collection = Collect([1, 2, 3])

    expect(
      collection.diff([2, 3, 4, 5]).all()
    ).to.equal([1])
    expect(
      collection.all()
    ).to.equal(items)

    expect(
      Collect([1, 2, 3]).diff([1, 3, 5, 7]).all()
    ).to.equal([2])

    expect(
      Collect([1, 2, 3])
        .map(item => item * 2)
        .diff([1, 3, 5, 7])
        .all()
    ).to.equal([2, 4, 6])
  })

  it('slice', () => {
    const collection1 = Collect([1, 2, 3, 4, 5, 6])
    const chunk1 = collection1.slice(3).all()
    expect(collection1.all()).to.equal([1, 2, 3, 4, 5, 6])
    expect(chunk1).to.equal([4, 5, 6])

    const collection2 = Collect([1, 2, 3, 4, 5, 6])
    const chunk2 = collection2.slice(3, 2).all()
    expect(collection2.all()).to.equal([1, 2, 3, 4, 5, 6])
    expect(chunk2).to.equal([4, 5])
  })

  it('splice', () => {
    const collection1 = Collect([1, 2, 3, 4, 5])
    const chunk1 = collection1.splice(2)
    expect(collection1.all()).to.equal([1, 2])
    expect(chunk1.all()).to.equal([3, 4, 5])

    // splice with start and limit
    const collection2 = Collect([1, 2, 3, 4, 5])
    const chunk2 = collection2.splice(2, 2)
    expect(collection2.all()).to.equal([1, 2, 5])
    expect(chunk2.all()).to.equal([3, 4])

    // inserts items
    const collection3 = Collect([1, 2, 3, 4, 5])
    const chunk3 = collection3.splice(2, 2, 8, 9)
    expect(collection3.all()).to.equal([1, 2, 8, 9, 5])
    expect(chunk3.all()).to.equal([3, 4])

    // inserts items from an array
    const collection4 = Collect([1, 2, 3, 4, 5])
    const chunk4 = collection4.splice(2, 2, [10, 11])
    expect(collection4.all()).to.equal([1, 2, 10, 11, 5])
    expect(chunk4.all()).to.equal([3, 4])

    // takes more items than available
    const collection5 = Collect([1, 2, 3, 4, 5])
    const chunk5 = collection5.splice(2, 10)
    expect(collection5.all()).to.equal([1, 2])
    expect(chunk5.all()).to.equal([3, 4, 5])

    // keeps order of collection pipeline
    const collection6 = Collect([1, 2, 3, 4, 5])
      .map(item => item * 10)
      .filter(item => item > 10)

    const chunk6 = collection6.splice(0, 1)
    expect(collection6.all()).to.equal([30, 40, 50])
    expect(chunk6.all()).to.equal([20])

    // splices all items when passing "null" as limit
    const collection7 = Collect([1, 2, 3, 4, 5])
      .map(item => item * 10)
      .filter(item => item > 10)

    expect(
      collection7
        .splice(0, null)
        .all()
    ).to.equal([20, 30, 40, 50])
  })

  it('some', () => {
    const start = Date.now()

    expect(
      Collect([1, 2, 3]).some(item => item > 5)
    ).to.be.false()

    const elapsed = Date.now() - start
    expect(elapsed < 100).to.be.true()

    expect(
      Collect([1, 2, 3]).some(item => item < 10)
    ).to.be.true()
  })

  it('any', () => {
    const start = Date.now()

    expect(
      Collect([1, 2, 3]).any(item => item > 5)
    ).to.be.false()

    const elapsed = Date.now() - start
    expect(elapsed < 100).to.be.true()

    expect(
      Collect([1, 2, 3]).any(item => item < 10)
    ).to.be.true()
  })

  it('sum', () => {
    expect(
      Collect([1, 2, 3]).sum()
    ).to.equal(6)

    expect(
      Collect([1, 2, 3])
        .map(item => item * 2)
        .intersect([4, 6])
        .sum()
    ).to.equal(10)
  })

  it('forEach', () => {
    const items = []

    Collect([1, 2, 3]).forEach(item => {
      items.push(item)
    })

    expect(items).to.equal([1, 2, 3])
  })

  it('intersect', () => {
    const items = [1, 2, 3, 3]
    const collection = Collect(items)
    const intersect = collection.intersect([2, 3, 4, 5])
    expect(intersect.all()).to.equal([2, 3])
    expect(collection.all()).to.equal(items)

    expect(
      collection
        .map(item => item * 2)
        .intersect([4, 5, 6])
        .all()
    ).to.equal([4, 6])
  })

  it('isEmpty', () => {
    expect(Collect().isEmpty()).to.be.true()
    expect(Collect(null).isEmpty()).to.be.true()
    expect(Collect(undefined).isEmpty()).to.be.true()

    expect(Collect([1, 2, 3]).isEmpty()).to.be.false()
  })

  it('isNotEmpty', () => {
    expect(Collect().isNotEmpty()).to.be.false()
    expect(Collect(null).isNotEmpty()).to.be.false()
    expect(Collect(undefined).isNotEmpty()).to.be.false()

    expect(Collect([1, 2, 3]).isNotEmpty()).to.be.true()
  })

  it('join', () => {
    expect(Collect([1, 2, 3]).join()).to.equal('1,2,3')
    expect(Collect([1, 2, 3]).join('')).to.equal('123')
    expect(Collect([1, 2, 3]).join('-')).to.equal('1-2-3')

    expect(
      Collect([1, 2, 3])
        .map(item => item * 2)
        .join('-.-')
    ).to.equal('2-.-4-.-6')
  })

  it('take', () => {
    const items = [1, 2, 3, 4, 5, 6]
    const collection = Collect(items)

    const firstTwo = collection.take(2)
    expect(collection.all()).to.equal(items)
    expect(firstTwo.all()).to.equal([1, 2])

    const lastTwo = collection.take(-2)
    expect(collection.all()).to.equal(items)
    expect(lastTwo.all()).to.equal([5, 6])

    const pipeline = Collect([1, 2, 3, 4, 5, 6])
      .map(item => item * 10)
      .filter(item => item > 20)
    const all = pipeline.take(30)
    expect(pipeline.all()).to.equal([30, 40, 50, 60])
    expect(all.all()).to.equal([30, 40, 50, 60])
  })

  it('takeAndRemove', () => {
    const collection = Collect([1, 2, 3, 4, 5, 6])
    const firstTwo = collection.takeAndRemove(2)
    expect(collection.all()).to.equal([3, 4, 5, 6])
    expect(firstTwo.all()).to.equal([1, 2])

    const collection2 = Collect([1, 2, 3, 4, 5, 6])
    const lastTwo = collection2.takeAndRemove(-2)
    expect(lastTwo.all()).to.equal([5, 6])
    expect(collection2.all()).to.equal([1, 2, 3, 4])

    const pipeline = Collect([1, 2, 3, 4, 5, 6])
      .map(item => item * 10)
      .filter(item => item > 20)
    const all = pipeline.takeAndRemove(30)
    expect(pipeline.all()).to.equal([])
    expect(all.all()).to.equal([30, 40, 50, 60])
  })

  it('toJSON', () => {
    expect(
      Collect([11, 22, 33, 44, 55, 66]).toJSON()
    ).to.be.equal('[11,22,33,44,55,66]')

    expect(
      Collect([{ test: 'value1', test2: 2 }]).toJSON()
    ).to.be.equal('[{"test":"value1","test2":2}]')
  })

  it('unique', () => {
    const items = [1, 2, 2, 1, 3, 4, 4]
    const collection = Collect(items)
    const unique = collection.unique()

    expect(unique.all()).to.equal([1, 2, 3, 4])
    expect(collection.all()).to.equal(items)

    const users = [
      { name: 'Marcus' },
      { name: 'Marcus' },
      { name: 'Supercharge' }
    ]

    // with key
    const uniqueNames = Collect(users)

    expect(uniqueNames.unique('name').all()).to.equal([
      { name: 'Marcus' },
      { name: 'Supercharge' }
    ])
    expect(uniqueNames.all()).to.equal(users)

    expect(
      Collect(users).unique(item => {
        return item.name
      }).all()
    ).to.equal([
      { name: 'Marcus' },
      { name: 'Supercharge' }
    ])
  })

  it('uniqueBy', () => {
    const items = [
      { name: 'Marcus' },
      { name: 'Supercharge' },
      { name: 'Marcus' }
    ]

    expect(
      Collect(items).uniqueBy(item => {
        return item.name
      }).all()
    ).to.equal([
      { name: 'Marcus' },
      { name: 'Supercharge' }
    ])
  })

  it('union', () => {
    const items = [1, 2, 3]
    const collection = Collect(items)
    const union = collection.union([2, 3, 4, 5])

    expect(collection.all()).to.equal(items)
    expect(union.all()).to.equal([1, 2, 3, 4, 5])

    expect(
      collection
        .map(item => item * 2)
        .union([10, 20])
        .all()).to.equal([2, 4, 6, 10, 20])
  })

  it('push', () => {
    expect(
      Collect([1, 2, 3])
        .push(4)
        .all()
    ).to.equal([1, 2, 3, 4])

    expect(
      Collect([1, 2, 3])
        .push(4, 5, 6)
        .all()
    ).to.equal([1, 2, 3, 4, 5, 6])

    expect(
      Collect([1, 2, 3])
        .map(item => item * 2)
        .filter(item => item > 5)
        .push(10, 20, 30)
        .all()
    ).to.equal([6, 10, 20, 30])
  })

  it('pop', () => {
    expect(
      Collect([1, 2, 3]).pop()
    ).to.equal(3)

    const collection = Collect([])
    const undef = collection.pop()
    expect(undef).to.equal(undefined)
    expect(collection.all()).to.equal([])

    const pipeline = Collect([1, 2, 3, 4, 5])
      .map(item => item * 2)
      .filter(item => item > 5)

    const ten = pipeline.pop()
    expect(ten).to.equal(10)
    expect(pipeline.all()).to.equal([6, 8])
  })

  it('shift', () => {
    const collection = Collect([1, 2, 3])
    const one = collection.shift()
    expect(one).to.equal(1)
    expect(collection.all()).to.equal([2, 3])

    const pipeline = Collect([1, 2, 3, 4, 5]).map(item => item * 2).filter(item => item > 5)
    const six = pipeline.shift()
    expect(six).to.equal(6)
    expect(pipeline.all()).to.equal([8, 10])
  })

  it('concat', () => {
    expect(
      Collect().concat([1, 2]).all()
    ).to.equal([1, 2])

    expect(
      Collect()
        .concat(1)
        .concat(2)
        .concat([3, 4])
        .concat(5, undefined)
        .concat([6, undefined])
        .compact()
        .all()
    ).to.equal([1, 2, 3, 4, 5, 6])

    const collection = Collect([1, 2, 3])
    expect(collection.all()).to.equal([1, 2, 3])
    expect(collection.concat([4, 5]).all()).to.equal([1, 2, 3, 4, 5])

    const collection1 = Collect([1, 2, 3])
    expect(collection1.all()).to.equal([1, 2, 3])
    expect(collection1.concat(4, 5).all()).to.equal([1, 2, 3, 4, 5])

    const pipeline = Collect([1, 2, 3])
      .map(item => item * 2)
      .filter(item => item > 5)
    const pipedConcat = pipeline.concat([10, 20])
    expect(pipeline.all()).to.equal([6])
    expect(pipedConcat.all()).to.equal([6, 10, 20])
  })

  it('sort', () => {
    const collection = Collect([3, 2, 1])
    const sorted = collection.sort()
    expect(collection.all()).to.equal([3, 2, 1])
    expect(sorted.all()).to.equal([1, 2, 3])

    expect(
      collection
        .map(item => item * 2)
        .sort()
        .all()
    ).to.equal([2, 4, 6])

    const collection1 = Collect([1, 2, 3])
    const sorted1 = collection1.sort((a, b) => b - a)
    expect(collection1.all()).to.equal([1, 2, 3])
    expect(sorted1.all()).to.equal([3, 2, 1])
  })

  it('unshift', () => {
    expect(
      Collect([1, 2, 3])
        .unshift(4, 5)
        .all()
    ).to.equal([4, 5, 1, 2, 3])

    expect(
      Collect([1, 2, 3])
        .map(item => item * 2)
        .filter(item => item > 5)
        .unshift(10, 20, 30)
        .all()
    ).to.equal([10, 20, 30, 6])
  })

  it('min', () => {
    expect(
      Collect([10, 2, 3, 4]).min()
    ).to.equal(2)

    expect(
      Collect([10, '2', 3, 4]).min()
    ).to.equal(2)

    expect(
      Collect([10, 2, -1, 4]).min()
    ).to.equal(-1)

    expect(
      Collect([10, 2, -1, 4])
        .map(item => item * 2)
        .min()
    ).to.equal(-2)
  })

  it('first', () => {
    expect(
      Collect([1, 2, 3]).first()
    ).to.equal(1)

    expect(() => {
      Collect([1, 2, 3]).first(1)
    }
    ).to.throw() // only callback functions are allowed

    expect(
      Collect([
        { id: 1, name: '1' },
        { id: 2, name: '2' },
        { id: 1, name: '3' }
      ]).first(item => {
        return item.id === 1
      })
    ).to.equal({ id: 1, name: '1' })
  })

  it('has', () => {
    expect(
      Collect([1, 2, 3]).has(3)
    ).to.equal(true)

    expect(
      Collect([1, 2, 3]).has(4)
    ).to.equal(false)

    expect(
      Collect([1, 2, 3]).has(item => item === 2)
    ).to.equal(true)

    expect(
      Collect([1, 2, 3]).has(item => item === 4)
    ).to.equal(false)
  })

  it('includes', () => {
    expect(
      Collect([1, 2, 3]).includes(3)
    ).to.equal(true)

    expect(
      Collect([1, 2, 3]).includes(4)
    ).to.equal(false)

    expect(
      Collect([1, 2, 3]).includes(item => item === 2)
    ).to.equal(true)

    expect(
      Collect([1, 2, 3]).includes(item => item === 4)
    ).to.equal(false)
  })

  it('throws', () => {
    expect(() => {
      Collect([1, 2, 3]).forEach(() => {
        throw new Error()
      })
    }).to.throw()
  })

  it('reverse', () => {
    expect(Collect([]).reverse().all()).to.equal([])
    expect(Collect([1]).reverse().all()).to.equal([1])
    expect(Collect([1, 2, 3]).reverse().all()).to.equal([3, 2, 1])
    expect(Collect([1, 2, 3, 2, 1]).reverse().all()).to.equal([1, 2, 3, 2, 1])

    const items = [1, 2, 3]
    const collection = Collect(items)
    expect(collection.all()).to.equal([1, 2, 3])
    expect(collection.reverse().all()).to.equal([3, 2, 1])
  })

  it('avg', () => {
    expect(
      Collect([1, 2, 3]).avg()
    ).to.equal(2)

    expect(
      Collect([4, 1]).avg()
    ).to.equal(2.5)

    expect(
      Collect([1, 2, 3])
        .map(item => item * 2)
        .avg()
    ).to.equal(4)
  })

  it('median', () => {
    expect(
      Collect([1, 2, 3]).median()
    ).to.equal(2)

    expect(
      Collect([1, 3, 2]).median()
    ).to.equal(2)

    expect(
      Collect([1, 2]).median()
    ).to.equal(1.5)

    expect(
      Collect([1, 4, 12, 2, 3, 47])
        .map(item => item * 2) // 2, 8, 24, 4, 6, 94
        .median() // 2, 4, 6, 8, 24, 94
    ).to.equal(7)
  })

  it('last', () => {
    expect(
      Collect([1, 2, 3]).last()
    ).to.equal(3)

    expect(() => {
      Collect([1, 2, 3]).last(1)
    }
    ).to.throw(Error) // only callback functions are allowed

    expect(
      Collect([
        { id: 1, name: '1' },
        { id: 2, name: '2' },
        { id: 1, name: '3' }
      ]).last(item => {
        return item.id === 1
      })
    ).to.equal({ id: 1, name: '3' })

    const items = [1, 2, 3]
    expect(
      Collect(items)
        .map(item => item * 10)
        .last()
    ).to.equal(30)
    expect(items).to.equal([1, 2, 3])
  })

  it('tap', () => {
    expect(
      Collect([1, 2, 3])
        .tap(value => {
          return value * 10
        })
        .all()
    ).to.equal([1, 2, 3])

    expect(
      Collect([1, 2, 3])
        .map(value => value * 2)
        .tap(value => value * 10)
        .filter(value => value > 4)
        .all()
    ).to.equal([6])
  })

  it('hasDuplicates', () => {
    expect(
      Collect([1, 1, 2]).hasDuplicates()
    ).to.be.true()

    expect(
      Collect([1, 2]).hasDuplicates()
    ).to.be.false()

    expect(
      Collect([1, 1, 2])
        .map(value => value * 2)
        .hasDuplicates()
    ).to.be.true()
  })

  it('groupBy', () => {
    const products = [
      { name: 'Macbook', price: 2500 },
      { name: 'Macbook', price: 3000 },
      { name: 'iPhone', price: 1000 }
    ]
    expect(
      Collect(products).groupBy('name')
    ).to.equal({
      Macbook: [
        { name: 'Macbook', price: 2500 },
        { name: 'Macbook', price: 3000 }
      ],
      iPhone: [
        { name: 'iPhone', price: 1000 }
      ]
    })

    expect(
      Collect([]).groupBy('name')
    ).to.equal({})

    expect(
      Collect(products).groupBy('nonExistentKey')
    ).to.equal({ '': products })

    expect(() => {
      Collect(products).groupBy('name.price')
    }).to.throw()
  })

  it('pluck', () => {
    const users = [
      { id: 1, name: 'Marcus', email: 'marcus@test.com' },
      { id: 2, name: 'Norman', email: 'norman@test.com' },
      { id: 3, name: 'Christian', email: 'christian@test.com' }
    ]

    expect(
      Collect(users).pluck('name').all()
    ).to.equal(['Marcus', 'Norman', 'Christian'])

    expect(
      Collect(users).pluck(['name', 'email']).all()
    ).to.equal([
      { name: 'Marcus', email: 'marcus@test.com' },
      { name: 'Norman', email: 'norman@test.com' },
      { name: 'Christian', email: 'christian@test.com' }
    ])
  })

  it('count', () => {
    expect(
      Collect([1, 2, 3]).count()
    ).to.equal(3)

    expect(
      Collect([1, 2, 3, 4]).count(item => {
        return item > 2
      })
    ).to.equal(2)

    expect(() => {
      Collect([1, 2, 3]).count('non-function')
    }).to.throw()
  })

  it('Symbol.iterator', () => {
    const collection = Collect([1, 2, 3])

    const iterable = collection[Symbol.iterator]()
    expect(iterable.next).to.be.a.function()

    const items = []

    for (const item of iterable) {
      items.push(item)
    }

    expect(items).to.equal([1, 2, 3])
  })

  it('Symbol.iterator is iterable', () => {
    const collection = Collect([1, 2, 3])

    const iterable = collection[Symbol.iterator]()
    expect(iterable.next).to.be.a.function()

    const items = []

    // eslint-disable-next-line no-unreachable-loop
    for (const item of iterable) {
      items.push(item)
      break
    }

    expect(items).to.equal([1])

    // Continue with same iterable:
    for (const item of iterable) {
      items.push(item)
    }

    expect(items).to.equal([1, 2, 3])
  })
})
