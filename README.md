[![Build Status](https://travis-ci.org/gregl83/expect-cookies.svg?branch=master)](https://travis-ci.org/gregl83/expect-cookies)
[![Coverage Status](https://coveralls.io/repos/gregl83/expect-cookies/badge.svg?branch=master&service=github)](https://coveralls.io/github/gregl83/expect-cookies?branch=master)
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
var Cookies = require('expect-cookies');

// setup super-test
var request = require('supertest')
  , express = require('express');

// setup express test service
var app = express();

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

All API functions and methods are chainable.

### Cookies([secret], [asserts])

Get cookie assertion for [super-test](https://github.com/visionmedia/supertest) `.expect()` method.

*Arguments*

- `secret` - String or array of strings. Cookie signature secrets 
- `asserts(req, res)` - Function or array of custom assertions. Failed assertions should throw. 

### Cookies.set(expects, [assert])

Assert that cookie and options are set.

*Arguments*

- `expects` - Object or array of objects.
  - `name` - String name of cookie.
  - `options` - *Optional* array of options.
- `assert` - *Optional* boolean "assert true" modifier. Defaults to `true`.

### Cookies.reset(expects, [assert])

Assert that cookie is set and was already set (in request headers).

*Arguments*

- `expects` - Object or array of objects.
  - `name` - String name of cookie.
- `assert` - *Optional* boolean "assert true" modifier. Defaults to `true`.

### Cookies.new(expects, [assert])

Assert that cookie is set and was NOT already set (NOT in request headers).

*Arguments*

- `expects` - Object or array of objects.
  - `name` - String name of cookie.
- `assert` - *Optional* boolean "assert true" modifier. Defaults to `true`.

### Cookies.renew(expects, [assert])

Assert that cookie is set with a "greater than" or "equal to" `expires` or `max-age` than was already set.

*Arguments*

- `expects` - Object or array of objects.
  - `name` - String name of cookie.
  - `options` - Object of options. `use one of two options below`
   - `expires` - String UTC expiration for original cookie (in request headers).
   - `max-age` - Integer ttl for original cookie (in request headers).
- `assert` - *Optional* boolean "assert true" modifier. Defaults to `true`.

### Cookies.contain(expects, [assert])

Assert that cookie is set and contains expected options and value. May require `Cookie(secret)` initialization.

*Arguments*

- `expects` - Object or array of objects.
  - `name` - String name of cookie.
  - `value` - *Optional* string value of cookie.
  - `options` - *Optional* object of options.
   - `domain` - *Optional* string domain.
   - `path` - *Optional* string path.
   - `expires` - *Optional* string UTC expiration.
   - `max-age` - *Optional* integer ttl.
   - `secure` - *Optional* boolean secure flag.
   - `httponly` - *Optional* boolean httpOnly flag.
- `assert` - *Optional* boolean "assert true" modifier. Defaults to `true`.

### Cookies.not(method, expects)

Call any cookies assertion method with boolean "assert true" modifier set to `false`. Syntactic sugar.

*Arguments*

- `method` - String method name. Arguments of method name apply in `expects`.
- `expects` - Object or array of objects.
  - `name` - String name of cookie.
  - `value` - *Optional* string value of cookie.
  - `options` - *Optional* object of options.

## License

MIT