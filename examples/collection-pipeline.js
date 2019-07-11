'use strict'

const Collect = require('..')

/**
 * Helper function that waits for the given amount
 * of millisecond represented by `ms`.
 *
 * @param {Integer} ms
 *
 * @returns {Integer}
 */
async function wait (ms) {
  await new Promise(resolve => setTimeout(resolve, ms))

  return ms
}

async function run () {
  const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

  const result = await Collect(input)
    .map(item => item * 100)
    .map(async timeout => {
      await wait(timeout)
      return timeout
    })
    .filter(timeout => timeout > 500)
    .all()

  console.log(`Result: ${result}`)
}

run()
