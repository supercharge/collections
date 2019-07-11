<div align="center">
  <a href="https://superchargejs.com">
    <img width="471" style="max-width:100%;" src="https://superchargejs.com/images/supercharge-text.svg" />
  </a>
  <br/>
  <br/>
  <p>
    <strong>Collections</strong>
  </p>
  <p>
    <strong><code>async/await-ready</code></strong> array & collection utilities for Node.js
  </p>
  <br/>
  <p>
    <a href="#installation"><strong>Installation</strong></a> ·
    <a href="#Docs"><strong>Docs</strong></a> ·
    <a href="#usage"><strong>Usage</strong></a>
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


## Docs
Find all the [details and available methods in the extensive Supercharge docs](https://superchargejs.com/docs/collections).


## Usage
The package exports a function accepting an array as a parameter. From there, you can chain all collection methods.

The package is async/await-ready and supports async functions for most of the methods.

```js
const Collect = require('@supercharge/collections')

await Collect([ 1, 2, 3, 4, 5 ])
  .map(item => item * 100)
  .map(async timeout => {
    await new Promise(resolve => setTimeout(resolve, ms))
    return timeout
  })
  .filter(timeout => timeout > 200)
  .all()

// result: [ 300, 400, 500 ]
```

**Notice:** when chaining methods like `map` or `filter`, you'll receive a collection instance in return. You must actively end the call chain using the `.all()` method to process the collection pipeline and retrieve the final result.

Yu can directly await the result for methods returning a definite value:

```js
await Collect([ 1, 2, 3 ])
  .map(item => item * 100)
  .reduce((carry, item) => {
    return carry + item
  }, 0)

// result: 600
```


## Contributing
Do you miss a collection function? We very much appreciate your contribution! Please send in a pull request 😊

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
