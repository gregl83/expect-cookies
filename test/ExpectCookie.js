var express = require('express');
var cookieParser = require('cookie-parser');
var request = require('supertest');
var should = require('should');

var Cookie = require('../');

var secrets = ['one', 'a', 'two', 'b'];


describe('Cookie', function() {
  describe('.set', function() {
    it('asserts true if cookie is set and options are set', function(done) {
      var expires = new Date();

      var app = express();

      app.use(cookieParser(secrets));

      app.get('/', function(req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expires, "maxAge": 60000, secure: 1, httpOnly: true, signed: true});
        res.send();
      });

      request(app)
        .get('/')
        .set("Cookie", "control=placebo")
        .expect(function(res) {
          var assertion = Cookie.set({
            "substance": 'active',
            "options": {
              "domain": 'domain.com',
              "path": '/',
              "expires": expires.toUTCString(),
              "max-age": 60000,
              "secure": true,
              "httponly": true,
              "secret": secrets
            }
          });

          should(function() {
            assertion(res);
          }).not.throw();
        })
        .end(done);
    });

    it('asserts false if cookie is set but option was NOT set', function(done) {
      var expires = new Date();

      var app = express();

      app.use(cookieParser(secrets));

      app.get('/', function(req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expires, "maxAge": 60000, secure: 1});
        res.send();
      });

      request(app)
        .get('/')
        .set("Cookie", "control=placebo")
        .expect(function(res) {
          var assertion = Cookie.set({
            "substance": 'active',
            "options": {
              "domain": 'domain.com',
              "path": '/',
              "expires": expires.toUTCString(),
              "max-age": 60000,
              "secure": true,
              "httponly": true
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

      var app = express();

      app.use(cookieParser(secrets));

      app.get('/', function(req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expires, "maxAge": 60000, secure: 1, httpOnly: true, signed: true});
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
              "max-age": 60000,
              "secure": true,
              "httponly": true,
              "secret": secrets
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

      var app = express();

      app.use(cookieParser(secrets));

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
              "max-age": 60000,
              "secure": true,
              "httponly": true,
              "secret": secrets
            }
          });

          should(function() {
            assertion(res);
          }).throw();
        })
        .end(done);
    });
  });

  describe('.new', function() {
    it('asserts true if cookie is set and was NOT already set', function(done) {
      var expires = new Date();

      var app = express();

      app.use(cookieParser(secrets));

      app.get('/', function(req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expires, "maxAge": 60000, secure: 1, httpOnly: true, signed: true});
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
              "max-age": 60000,
              "secure": true,
              "httponly": true,
              "secret": secrets
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

      var app = express();

      app.use(cookieParser(secrets));

      app.get('/', function(req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expires, "maxAge": 60000, secure: 1, httpOnly: true, signed: true});
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
              "max-age": 60000,
              "secure": true,
              "httponly": true,
              "secret": secrets
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

      var app = express();

      app.use(cookieParser(secrets));

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
              "max-age": 60000,
              "secure": true,
              "httponly": true,
              "secret": secrets
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

      var app = express();

      app.use(cookieParser(secrets));

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
              "secret": secrets
            }
          }, {
            "substance": 'active',
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

      var app = express();

      app.use(cookieParser(secrets));

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
              "secret": secrets
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
      var app = express();

      app.use(cookieParser(secrets));

      app.get('/', function(req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', "maxAge": 120000, secure: 1, httpOnly: true, signed: true});
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
              "max-age": 120000,
              "secure": true,
              "httponly": true,
              "secret": secrets
            }
          }, {
            "options": {
              "max-age": 60000
            }
          });

          should(function() {
            assertion(res);
          }).not.throw();
        })
        .end(done);
    });

    it('asserts false if cookie max-age is less than or equal to already set cookie', function(done) {
      var app = express();

      app.use(cookieParser(secrets));

      app.get('/', function(req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', "maxAge": 60000, secure: 1, httpOnly: true, signed: true});
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
              "max-age": 60000,
              "secure": true,
              "httponly": true,
              "secret": secrets
            }
          }, {
            "options": {
              "max-age": 120000
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

      var app = express();

      app.use(cookieParser(secrets));

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
              "max-age": 120000,
              "secure": true,
              "httponly": true,
              "secret": secrets
            }
          }, {
            "options": {
              "expires": compareExpires.toUTCString(),
              "max-age": 60000
            }
          });

          should(function() {
            assertion(res);
          }).throw();
        })
        .end(done);
    });
  });

  describe('.contain', function() {
    it('asserts true if cookie contains expected options', function(done) {
      var expires = new Date();

      var app = express();

      app.use(cookieParser(secrets));

      app.get('/', function(req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expires, "maxAge": 60000, secure: 1, httpOnly: true, signed: true});
        res.send();
      });

      request(app)
        .get('/')
        .set("Cookie", "control=placebo")
        .expect(function(res) {
          var assertion = Cookie.contain({
            "substance": 'active',
            "options": {
              "domain": 'domain.com',
              "path": '/',
              "expires": expires.toUTCString(),
              "max-age": 60000,
              "secure": true,
              "httponly": true,
              "secret": secrets
            }
          });

          should(function() {
            assertion(res);
          }).not.throw();
        })
        .end(done);
    });

    it('asserts false if cookie does NOT contain expected options', function(done) {
      var expires = new Date();

      var app = express();

      app.use(cookieParser(secrets));

      app.get('/', function(req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expires, "maxAge": 60000, secure: 1, httpOnly: true, signed: true});
        res.send();
      });

      request(app)
        .get('/')
        .set("Cookie", "control=placebo")
        .expect(function(res) {
          var assertion = Cookie.contain({
            "substance": 'active',
            "options": {
              "domain": 'domain.com',
              "path": '/',
              "expires": expires.toUTCString(),
              "max-age": 90000,
              "secure": true,
              "httponly": true,
              "secret": secrets
            }
          });

          should(function() {
            assertion(res);
          }).throw();
        })
        .end(done);
    });

    it('asserts false if cookie does NOT exist', function(done) {
      var expires = new Date();

      var app = express();

      app.use(cookieParser(secrets));

      app.get('/', function(req, res) {
        res.send();
      });

      request(app)
        .get('/')
        .set("Cookie", "control=placebo")
        .expect(function(res) {
          var assertion = Cookie.contain({
            "substance": 'active',
            "options": {
              "domain": 'domain.com',
              "path": '/',
              "expires": expires.toUTCString(),
              "max-age": 60000,
              "secure": true,
              "httponly": true,
              "secret": secrets
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
    describe('.set', function() {
      it('asserts true if cookie is NOT set', function(done) {
        var app = express();

        app.use(cookieParser(secrets));

        app.get('/', function(req, res) {
          res.send();
        });

        request(app)
          .get('/')
          .set("Cookie", "control=placebo")
          .expect(function(res) {
            var assertion = Cookie.not('set', {
              "substance": 'active'
            });

            should(function() {
              assertion(res);
            }).not.throw();
          })
          .end(done);
      });
    });

    describe('.reset', function() {
      it('asserts true if cookie is NOT set but was already set', function(done) {
        var expires = new Date();

        var app = express();

        app.use(cookieParser(secrets));

        app.get('/', function(req, res) {
          res.send();
        });

        request(app)
          .get('/')
          .set("Cookie", "control=placebo;substance=active")
          .expect(function(res) {
            var assertion = Cookie.not('reset', {
              "substance": 'active',
              "options": {
                "domain": 'domain.com',
                "path": '/',
                "expires": expires.toUTCString(),
                "max-age": 60000,
                "secure": true,
                "httponly": true,
                "secret": secrets
              }
            });

            should(function() {
              assertion(res);
            }).not.throw();
          })
          .end(done);
      });
    });

    describe('.new', function() {
      it('asserts true if cookie is set and was already set', function(done) {
        var expires = new Date();

        var app = express();

        app.use(cookieParser(secrets));

        app.get('/', function(req, res) {
          res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expires, "maxAge": 60000, secure: 1, httpOnly: true, signed: true});
          res.send();
        });

        request(app)
          .get('/')
          .set("Cookie", "control=placebo;substance=active")
          .expect(function(res) {
            var assertion = Cookie.not('new', {
              "substance": 'active',
              "options": {
                "domain": 'domain.com',
                "path": '/',
                "expires": expires.toUTCString(),
                "max-age": 60000,
                "secure": true,
                "httponly": true,
                "secret": secrets
              }
            });

            should(function() {
              assertion(res);
            }).not.throw();
          })
          .end(done);
      });
    });

    describe('.renew', function() {
      it('asserts true if cookie expiration is same than already set cookie', function(done) {
        var expires = new Date();

        var app = express();

        app.use(cookieParser(secrets));

        app.get('/', function(req, res) {
          res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expires, secure: 1, httpOnly: true, signed: true});
          res.send();
        });

        request(app)
          .get('/')
          .set("Cookie", "control=placebo;substance=active")
          .expect(function(res) {
            var assertion = Cookie.not('renew', {
              "substance": 'active',
              "options": {
                "domain": 'domain.com',
                "path": '/',
                "expires": expires.toUTCString(),
                "secure": true,
                "httponly": true,
                "secret": secrets
              }
            }, {
              "substance": 'active',
              "options": {
                "expires": expires.toUTCString()
              }
            });

            should(function() {
              assertion(res);
            }).not.throw();
          })
          .end(done);
      });
    });

    describe('.contain', function() {
      it('asserts true if cookie does NOT contain option', function(done) {
        var expires = new Date();

        var app = express();

        app.use(cookieParser(secrets));

        app.get('/', function(req, res) {
          res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expires, "maxAge": 60000, secure: 1, httpOnly: true});
          res.send();
        });

        request(app)
          .get('/')
          .set("Cookie", "control=placebo")
          .expect(function(res) {
            var assertion = Cookie.not('contain', {
              "substance": 'active',
              "options": {
                "secret": secrets
              }
            });

            should(function() {
              assertion(res);
            }).not.throw();
          })
          .end(done);
      });
    });
  });
});