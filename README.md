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

## License

MIT