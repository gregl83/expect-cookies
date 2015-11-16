var express = require('express');
var cookieParser = require('cookie-parser');
var request = require('supertest');
var should = require('should');

var Cookie = require('../');


describe('Cookie', function() {
  describe('.new', function() {
    it('asserts true if cookie is set and was NOT already set', function(done) {
      var expires = new Date();
      var secret = 'secret';

      var app = express();

      app.use(cookieParser(secret, {signed: true}));

      app.get('/', function(req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expires, "max-age": 60, secure: 1, httpOnly: true, signed: true});
        res.send();
      });

      request(app)
        .get('/')
        .set("Cookie", "control=placebo")
        .expect(function(res) {
          var assertion = Cookie.new({
            "substance": 'active',
            "options": {
              "domain": 'domain.com',
              "path": '/',
              "expires": expires.toUTCString(),
              "max-age": 60,
              "secure": true,
              "httponly": true,
              "signed": secret
            }
          });

          should(function() {
            assertion(res);
          }).not.throw();
        })
        .end(done);
    });

    it('asserts false if cookie is set but was already set', function(done) {
      var expires = new Date();
      var secret = 'secret';

      var app = express();

      app.use(cookieParser(secret, {signed: true}));

      app.get('/', function(req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expires, "max-age": 60, secure: 1, httpOnly: true, signed: true});
        res.send();
      });

      request(app)
        .get('/')
        .set("Cookie", "control=placebo;substance=active")
        .expect(function(res) {
          var assertion = Cookie.new({
            "substance": 'active',
            "options": {
              "domain": 'domain.com',
              "path": '/',
              "expires": expires.toUTCString(),
              "max-age": 60,
              "secure": true,
              "httponly": true,
              "signed": secret
            }
          });

          should(function() {
            assertion(res);
          }).throw();
        })
        .end(done);
    });

    it('asserts false if cookie is NOT set', function(done) {
      var expires = new Date();
      var secret = 'secret';

      var app = express();

      app.use(cookieParser(secret, {signed: true}));

      app.get('/', function(req, res) {
        res.send();
      });

      request(app)
        .get('/')
        .set("Cookie", "control=placebo")
        .expect(function(res) {
          var assertion = Cookie.new({
            "substance": 'active',
            "options": {
              "domain": 'domain.com',
              "path": '/',
              "expires": expires.toUTCString(),
              "max-age": 60,
              "secure": true,
              "httponly": true,
              "signed": secret
            }
          });

          should(function() {
            assertion(res);
          }).throw();
        })
        .end(done);
    });
  });

  describe('.reset', function() {
    it('asserts true if cookie is set and was already set', function(done) {
      var expires = new Date();
      var secret = 'secret';

      var app = express();

      app.use(cookieParser(secret, {signed: true}));

      app.get('/', function(req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expires, "max-age": 60, secure: 1, httpOnly: true, signed: true});
        res.send();
      });

      request(app)
        .get('/')
        .set("Cookie", "control=placebo;substance=active")
        .expect(function(res) {
          var assertion = Cookie.reset({
            "substance": 'active',
            "options": {
              "domain": 'domain.com',
              "path": '/',
              "expires": expires.toUTCString(),
              "max-age": 60,
              "secure": true,
              "httponly": true,
              "signed": secret
            }
          });

          should(function() {
            assertion(res);
          }).not.throw();
        })
        .end(done);
    });

    it('asserts false if cookie is NOT set', function(done) {
      var expires = new Date();
      var secret = 'secret';

      var app = express();

      app.use(cookieParser(secret, {signed: true}));

      app.get('/', function(req, res) {
        res.send();
      });

      request(app)
        .get('/')
        .set("Cookie", "control=placebo")
        .expect(function(res) {
          var assertion = Cookie.reset({
            "substance": 'active',
            "options": {
              "domain": 'domain.com',
              "path": '/',
              "expires": expires.toUTCString(),
              "max-age": 60,
              "secure": true,
              "httponly": true,
              "signed": secret
            }
          });

          should(function() {
            assertion(res);
          }).throw();
        })
        .end(done);
    });
  });

  describe('.renew', function() {
    it('asserts true if cookie expiration is greater than already set cookie', function(done) {
      var compareExpires = new Date();
      var expires = new Date(compareExpires + 60000);
      var secret = 'secret';

      var app = express();

      app.use(cookieParser(secret, {signed: true}));

      app.get('/', function(req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expires, secure: 1, httpOnly: true, signed: true});
        res.send();
      });

      request(app)
        .get('/')
        .set("Cookie", "control=placebo;substance=active")
        .expect(function(res) {
          var assertion = Cookie.renew({
            "substance": 'active',
            "options": {
              "domain": 'domain.com',
              "path": '/',
              "expires": expires.toUTCString(),
              "secure": true,
              "httponly": true,
              "signed": secret
            }
          }, {
            "options": {
              "expires": compareExpires.toUTCString()
            }
          });

          should(function() {
            assertion(res);
          }).not.throw();
        })
        .end(done);
    });

    it('asserts false if cookie expiration is less than or equal to already set cookie', function(done) {
      var compareExpires = new Date();
      var expires = new Date(compareExpires - 60000);
      var secret = 'secret';

      var app = express();

      app.use(cookieParser(secret, {signed: true}));

      app.get('/', function(req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expires, secure: 1, httpOnly: true, signed: true});
        res.send();
      });

      request(app)
        .get('/')
        .set("Cookie", "control=placebo;substance=active")
        .expect(function(res) {
          var assertion = Cookie.renew({
            "substance": 'active',
            "options": {
              "domain": 'domain.com',
              "path": '/',
              "expires": expires.toUTCString(),
              "secure": true,
              "httponly": true,
              "signed": secret
            }
          }, {
            "options": {
              "expires": compareExpires.toUTCString()
            }
          });

          should(function() {
            assertion(res);
          }).throw();
        })
        .end(done);
    });

    it('asserts true if cookie max-age is greater than already set cookie', function(done) {
      var secret = 'secret';

      var app = express();

      app.use(cookieParser(secret, {signed: true}));

      app.get('/', function(req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', "max-age": 120, secure: 1, httpOnly: true, signed: true});
        res.send();
      });

      request(app)
        .get('/')
        .set("Cookie", "control=placebo;substance=active")
        .expect(function(res) {
          var assertion = Cookie.renew({
            "substance": 'active',
            "options": {
              "domain": 'domain.com',
              "path": '/',
              "max-age": 120,
              "secure": true,
              "httponly": true,
              "signed": secret
            }
          }, {
            "options": {
              "max-age": 60
            }
          });

          should(function() {
            assertion(res);
          }).not.throw();
        })
        .end(done);
    });

    it('asserts false if cookie max-age is less than or equal to already set cookie', function(done) {
      var secret = 'secret';

      var app = express();

      app.use(cookieParser(secret, {signed: true}));

      app.get('/', function(req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', "max-age": 60, secure: 1, httpOnly: true, signed: true});
        res.send();
      });

      request(app)
        .get('/')
        .set("Cookie", "control=placebo;substance=active")
        .expect(function(res) {
          var assertion = Cookie.renew({
            "substance": 'active',
            "options": {
              "domain": 'domain.com',
              "path": '/',
              "max-age": 60,
              "secure": true,
              "httponly": true,
              "signed": secret
            }
          }, {
            "options": {
              "max-age": 120
            }
          });

          should(function() {
            assertion(res);
          }).throw();
        })
        .end(done);
    });

    it('asserts false if cookie is NOT set', function(done) {
      var compareExpires = new Date();
      var expires = new Date(compareExpires - 60000);
      var secret = 'secret';

      var app = express();

      app.use(cookieParser(secret, {signed: true}));

      app.get('/', function(req, res) {
        res.send();
      });

      request(app)
        .get('/')
        .set("Cookie", "control=placebo")
        .expect(function(res) {
          var assertion = Cookie.reset({
            "substance": 'active',
            "options": {
              "domain": 'domain.com',
              "path": '/',
              "expires": expires.toUTCString(),
              "max-age": 120,
              "secure": true,
              "httponly": true,
              "signed": secret
            }
          }, {
            "options": {
              "expires": compareExpires.toUTCString(),
              "max-age": 60
            }
          });

          should(function() {
            assertion(res);
          }).throw();
        })
        .end(done);
    });
  });

  describe('.not', function() {
    it('asserts true if cookie is NOT set', function(done) {
      var secret = 'secret';

      var app = express();

      app.use(cookieParser(secret, {signed: true}));

      app.get('/', function(req, res) {
        res.send();
      });

      request(app)
        .get('/')
        .set("Cookie", "control=placebo")
        .expect(function(res) {
          var assertion = Cookie.not({"substance": 'active'});

          should(function() {
            assertion(res);
          }).not.throw();
        })
        .end(done);
    });

    it('asserts false if cookie IS set', function(done) {
      var secret = 'secret';

      var app = express();

      app.use(cookieParser(secret, {signed: true}));

      app.get('/', function(req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', "max-age": 60, secure: 1, httpOnly: true, signed: true});
        res.send();
      });

      request(app)
        .get('/')
        .set("Cookie", "control=placebo")
        .expect(function(res) {
          var assertion = Cookie.not({'substance': 'active'});

          should(function() {
            assertion(res);
          }).throw();
        })
        .end(done);
    });
  });
});