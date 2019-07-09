<div align="center">
  <br/>
  <br/>
  <p>
    async/await-ready array & collection utilities for Node.js
  </p>
  <br/>
  <p>
    <a href="#installation"><strong>Installation</strong></a> ·
    <a href="#usage"><strong>Usage</strong></a> ·
    <a href="#Docs"><strong>Docs</strong></a>
  </p>
  <br/>
  <br/>
  <p>
    <a href="https://travis-ci.com/superchargejs/collections"><img src="https://travis-ci.com/superchargejs/collections.svg?branch=master" alt="Build Status" data-canonical-src="https://travis-ci.com/superchargejs/collections.svg?branch=master" style="max-width:100%;"></a>
    <a href="https://www.npmjs.com/package/@supercharge/collections"><img src="https://img.shields.io/npm/v/@supercharge/collections.svg" alt="Latest Version"></a>
  </p>
  <p>
    <em>Follow <a href="http://twitter.com/marcuspoehls">@marcuspoehls</a> and <a href="http://twitter.com/superchargejs">@superchargejs</a> for updates!</em>
  </p>
</div>

---

## Installation

```
npm i @supercharge/collections
```


## Usage
The package exports a function accepting an array as a parameter. From there, you can chain all collection methods.

The package is async/await-ready and supports async functions for most of the methods.

```js
const Collect = require('@supercharge/collections')

await Collect([ 1, 2, 3, 4, 5 ])
  .map(item => item * 100)
  .map(async timeout => {
    await wait(timeout)
    return timeout
  })
  .filter(timeout => timeout > 200)
  .run()

// result: [ 300, 400, 500 ]
```

**Notice:** if the result of your collection pipeline is an array, you must end the call chain with the `.run()` method. The `.run()` tells the library to start processing and not wait for additional methods in the chain.

For methods that return a definitive value (not an array), you can directly await the result:

```js
await Collect([ 1, 2, 3 ])
  .map(item => item * 100)
  .reduce((carry, item) => {
    return carry + item
  }, 0)

// result: 600
```


## Docs
Find all the [details and available methods in the extensive Supercharge docs](https://superchargejs.com/docs/master/collections).


## Contributing

1.  Create a fork
2.  Create your feature branch: `git checkout -b my-feature`
3.  Commit your changes: `git commit -am 'Add some feature'`
4.  Push to the branch: `git push origin my-new-feature`
5.  Submit a pull request 🚀


## License
MIT © [Supercharge](https://superchargejs.com)

---

> [superchargejs.com](https://superchargejs.com) &nbsp;&middot;&nbsp;
> GitHub [@superchargejs](https://github.com/superchargejs/) &nbsp;&middot;&nbsp;
> Twitter [@superchargejs](https://twitter.com/superchargejs)
