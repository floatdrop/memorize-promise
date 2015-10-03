# memorize-promise [![Build Status](https://travis-ci.org/floatdrop/memorize-promise.svg?branch=master)](https://travis-ci.org/floatdrop/memorize-promise)

Save promise result and update it from time to time.


## Install

```
$ npm install --save memorize-promise
```


## Usage

```js
const got = require('got');
const memorizePromise = require('memorize-promise');

const cache = memorizePromise(() => got('google.com'));

cache.then(res => console.log(res.body)); // Content 1
cache.then(res => console.log(res.body)); // Content 1

setTimeout(function () {
	cache.then(res => console.log(res.body)); // Content 2
	cache.then(res => console.log(res.body)); // Content 2

	cache.stop(); // Stops updates
}, 5005);
```


## API

### memorizePromise(func, [options])

#### func

Type: `Function`

Factory of promises. It will be called for new promise with data every `updateInterval` milliseconds.

#### options

##### updateInterval

Type: `Number`  
Default: `5000`

Update interval in milliseconds.


## License

MIT © [Vsevolod Strukchinsky](http://github.com/floatdrop)
