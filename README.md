<div align="center">
  <a href="https://superchargejs.com">
    <img width="471" style="max-width:100%;" src="https://superchargejs.com/images/supercharge-text.svg" />
  </a>
  <br/>
  <br/>
  <p>
    <h3>Collections</h3>
  </p>
  <p>
    <strong><code>async/await-ready</code></strong> array methods for Node.js
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
    <a href="https://www.npmjs.com/package/@supercharge/collections"><img src="https://img.shields.io/npm/v/@supercharge/collections.svg" alt="Latest Version"></a>
    <a href="https://www.npmjs.com/package/@supercharge/collections"><img src="https://img.shields.io/npm/dm/@supercharge/collections.svg" alt="Monthly downloads"></a>
  </p>
  <p>
    <em>Follow <a href="http://twitter.com/marcuspoehls">@marcuspoehls</a> and <a href="http://twitter.com/superchargejs">@superchargejs</a> for updates!</em>
  </p>
</div>

---

## Notice
This package is ESM-only.


## Introduction
The `@supercharge/collections` package provides a convenient, fully-async wrapper to work with arrays.


## Installation

```
npm i @supercharge/collections
```


## Docs
Find all the [details and available methods in the extensive Supercharge docs](https://superchargejs.com/docs/collections).


## Usage
The package exports a function accepting an array as a parameter. From there, you can chain all collection methods.


### SyncCollections by default
### Collections are Asynchronous
Collections are asynchronous by default. You can use `async` callback functions in all methods and need to `await` the result.

In contrast to JavaScript’s array methods, collections have a lot more methods available making your code a lot simpler. Here are basic examples using a collection:

```js
import User from '../models/user'
import Collect from '@supercharge/collections'

const users = await User.findAll()

const notSubscribedUsers = await Collect(users).filter(user => {
  return user.notSubscribedToNewsletter
})

// notSubscribedUsers = [ <list of not-yet-subscribed users> ]

// you can also chain further methods to the collection
const users = await User.findAll()

const subscribedUsers = await Collect(users)
  .filter(user => {
    return user.notSubscribedToNewsletter
  })
  .map(async user => { // <-- providing an async callback creates an async collection that you need to `await`
    await user.subscribeToNewsletter()

    return user
  })

// subscribedUsers = [ <list of newly-subscribed users> ]
```

Here’s another example outlining how to determine whether the array “has” an item:

```js
// “has” in JS Arrays
const hasNotSubscribedUsers = !![].concat(users).find(user => {
  return user.notSubscribedToNewsletter
})

// “has” in Collections
const hasNotSubscribedUsers = Collect(users).has(async user => {
  return await User.isSubcribedToNewsletter(user)
})
```

All available methods are outlined in the [docs](https://superchargejs.com/docs/collections).


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
> GitHub [@supercharge](https://github.com/supercharge) &nbsp;&middot;&nbsp;
> Twitter [@superchargejs](https://twitter.com/superchargejs)
