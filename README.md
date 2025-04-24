[![Build](https://github.com/gregl83/expect-cookies/actions/workflows/build.yml/badge.svg)](https://github.com/gregl83/expect-cookies/actions/workflows/build.yml)
[![Coverage Status](https://codecov.io/gh/gregl83/expect-cookies/graph/badge.svg?token=S9vGTwnOw6)](https://codecov.io/gh/gregl83/expect-cookies)
[![npmjs.com](https://img.shields.io/npm/v/expect-cookies.svg)](https://www.npmjs.com/package/expect-cookies)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/gregl83/expect-cookies/blob/master/LICENSE)
# expect-cookies

SuperTest Cookie Assertions

HTTP cookie assertions via [super-test](https://github.com/visionmedia/supertest).

Writing HTTP cookie tests can result in redundant and verbose test code.

This module was written to make testing cookies easier and reduce redundancies.

## Requirements

- NodeJS v0.12.x or higher
- NPM
- SuperTest for HTTP testing

See `./package.json`

## Installation

Source available on [GitHub](https://github.com/gregl83/expect-cookies) or install module via NPM:

    $ npm install expect-cookies

## Usage

Usage instructions assume general knowledge of [super-test](https://github.com/visionmedia/supertest).

Here is an example of using the `set` and `not` cookie assertions:

```js
// get ExpectCookies module
const Cookies = require('expect-cookies');

// setup super-test
const request = require('supertest');
const express = require('express');

// setup express test service
const app = express();

app.get('/users', function(req, res){
  res.cookie('alpha', 'one', {domain: 'domain.com', path: '/', httpOnly: true});
  res.send(200, { name: 'tobi' });
});

// test request to service
request(app)
  .get('/users')
  .expect('Content-Type', /json/)
  .expect('Content-Length', '20')
  .expect(200)
  // assert 'alpha' cookie is set with domain, path, and httpOnly options
  .expect(Cookies.set({'name': 'alpha', 'options': ['domain', 'path', 'httponly']}))
  // assert 'bravo' cookie is NOT set
  .expect(Cookies.not('set', {'name': 'bravo'})
  .end(function(err, res){
    if (err) throw err;
  });
```

It is also possible to chain assertions:

```js
Cookies.set({/* ... */}).not('set', {/* ... */})
```

## API

Functions and methods are chainable.

### Cookies([secret], [asserts])

Get assertion function for [super-test](https://github.com/visionmedia/supertest) `.expect()` method.

*Arguments*

- `secret` - String or array of strings. Cookie signature secrets.
- `asserts(req, res)` - Function or array of functions. Failed custom assertions should throw. 

### .set(expects, [assert])

Assert that cookie and options are set.

*Arguments*

- `expects` - Object or array of objects.
  - `name` - String name of cookie.
  - `options` - *Optional* array of options.
- `assert` - *Optional* boolean "assert true" modifier. Default: `true`.

### .reset(expects, [assert])

Assert that cookie is set and was already set (in request headers).

*Arguments*

- `expects` - Object or array of objects.
  - `name` - String name of cookie.
- `assert` - *Optional* boolean "assert true" modifier. Default: `true`.

### .new(expects, [assert])

Assert that cookie is set and was NOT already set (NOT in request headers).

*Arguments*

- `expects` - Object or array of objects.
  - `name` - String name of cookie.
- `assert` - *Optional* boolean "assert true" modifier. Default: `true`.

### .renew(expects, [assert])

Assert that cookie is set with a strictly greater `expires` or `max-age` than the given value.

*Arguments*

- `expects` - Object or array of objects.
  - `name` - String name of cookie.
  - `options` - Object of options. `use one of two options below`
   - `options`.`expires` - String UTC expiration for original cookie (in request headers).
   - `options`.`max-age` - Integer ttl in seconds for original cookie (in request headers).
- `assert` - *Optional* boolean "assert true" modifier. Default: `true`.

### .contain(expects, [assert])

Assert that cookie is set with value and contains options.

Requires `Cookies(secret)` initialization if cookie is signed.

*Arguments*

- `expects` - Object or array of objects.
  - `name` - String name of cookie.
  - `value` - *Optional* string unsigned value of cookie.
  - `options` - *Optional* object of options.
   - `options`.`domain` - *Optional* string domain.
   - `options`.`path` - *Optional* string path.
   - `options`.`expires` - *Optional* string UTC expiration.
   - `options`.`max-age` - *Optional* integer ttl, in seconds.
   - `options`.`secure` - *Optional* boolean secure flag.
   - `options`.`httponly` - *Optional* boolean httpOnly flag.
- `assert` - *Optional* boolean "assert true" modifier. Default: `true`.

### .not(method, expects)

Call any cookies assertion method with "assert true" modifier set to `false`.

Syntactic sugar.

*Arguments*

- `method` - String method name. Arguments of method name apply in `expects`.
- `expects` - Object or array of objects.
  - `name` - String name of cookie.
  - `value` - *Optional* string unsigned value of cookie.
  - `options` - *Optional* object of options.

That's it!

## License

[MIT](LICENSE)