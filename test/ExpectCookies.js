var express = require('express');
var cookieParser = require('cookie-parser');
var request = require('supertest');
var should = require('should');
var sinon = require('sinon');

var Cookies = require('../');
var Assertion = require('../src/Assertion');

var secrets = ['one', 'a', 'two', 'b'];


describe('Cookies', function() {
  it('returns Assertion function', function(done) {
    var assertion = Assertion();
    var cookiesAssertion = Cookies();

    should(cookiesAssertion).be.eql(assertion);

    done();
  });

  it('runs single asserts', function(done) {
    var assertion = sinon.stub();

    var app = express();

    app.get('/', function(req, res) {
      res.send();
    });

    request(app)
      .get('/')
      .set("Cookie", "control=placebo")
      .expect(Cookies(assertion))
      .end(function() {
        sinon.assert.calledOnce(assertion);
        done();
      });
  });

  it('runs multiple asserts', function(done) {
    var assertionA = sinon.stub();
    var assertionB = sinon.stub();

    var asserts = [
      assertionA,
      assertionB
    ];

    var app = express();

    app.get('/', function(req, res) {
      res.send();
    });

    request(app)
      .get('/')
      .set("Cookie", "control=placebo")
      .expect(Cookies(asserts))
      .end(function() {
        sinon.assert.calledOnce(assertionA);
        sinon.assert.calledOnce(assertionB);
        done();
      });
  });

  describe('.set', function() {
    it('asserts true if signed cookie is set and options are set', function(done) {
      var expires = new Date();

      var app = express();

      app.use(cookieParser(secrets));

      app.get('/', function(req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expires, secure: 1, httpOnly: true, signed: true});
        res.send();
      });

      request(app)
        .get('/')
        .set("Cookie", "control=placebo")
        .expect(function(res) {
          var assertion = Cookies.set({
            "substance": 'active',
            "options": {
              "domain": 'domain.com',
              "path": '/',
              "expires": expires.toUTCString(),
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

    it('asserts true if unsigned cookie is set and options are set', function(done) {
      var expires = new Date();

      var app = express();

      app.use(cookieParser(secrets));

      app.get('/', function(req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expires, secure: 1, httpOnly: true});
        res.send();
      });

      request(app)
        .get('/')
        .set("Cookie", "control=placebo")
        .expect(function(res) {
          var assertion = Cookies.set({
            "substance": 'active',
            "options": {
              "domain": 'domain.com',
              "path": '/',
              "expires": expires.toUTCString(),
              "secure": true,
              "httponly": true
            }
          });

          should(function() {
            assertion(res);
          }).not.throw();
        })
        .end(done);
    });

    it('asserts false if unsigned cookie is set but option was NOT set', function(done) {
      var expires = new Date();

      var app = express();

      app.use(cookieParser(secrets));

      app.get('/', function(req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expires, secure: 1});
        res.send();
      });

      request(app)
        .get('/')
        .set("Cookie", "control=placebo")
        .expect(function(res) {
          var assertion = Cookies.set({
            "substance": 'active',
            "options": {
              "domain": 'domain.com',
              "path": '/',
              "expires": expires.toUTCString(),
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
    it('asserts true if signed cookie is set and was already set', function(done) {
      var app = express();

      app.use(cookieParser(secrets));

      app.get('/', function(req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: new Date(), secure: 1, httpOnly: true, signed: true});
        res.send();
      });

      request(app)
        .get('/')
        .set("Cookie", "control=placebo;substance=active")
        .expect(function(res) {
          var assertion = Cookies.reset({
            "substance": 'active'
          });

          should(function() {
            assertion(res);
          }).not.throw();
        })
        .end(done);
    });

    it('asserts false if cookie is NOT set', function(done) {
      var app = express();

      app.use(cookieParser(secrets));

      app.get('/', function(req, res) {
        res.send();
      });

      request(app)
        .get('/')
        .set("Cookie", "control=placebo")
        .expect(function(res) {
          var assertion = Cookies.reset({
            "substance": 'active'
          });

          should(function() {
            assertion(res);
          }).throw();
        })
        .end(done);
    });
  });

  describe('.new', function() {
    it('asserts true if signed cookie is set and was NOT already set', function(done) {
      var expires = new Date();

      var app = express();

      app.use(cookieParser(secrets));

      app.get('/', function(req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expires, secure: 1, httpOnly: true, signed: true});
        res.send();
      });

      request(app)
        .get('/')
        .set("Cookie", "control=placebo")
        .expect(function(res) {
          var assertion = Cookies.new({
            "substance": 'active'
          });

          should(function() {
            assertion(res);
          }).not.throw();
        })
        .end(done);
    });

    it('asserts false if signed cookie is set but was already set', function(done) {
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
          var assertion = Cookies.new({
            "substance": 'active'
          });

          should(function() {
            assertion(res);
          }).throw();
        })
        .end(done);
    });

    it('asserts false if cookie is NOT set', function(done) {
      var app = express();

      app.use(cookieParser(secrets));

      app.get('/', function(req, res) {
        res.send();
      });

      request(app)
        .get('/')
        .set("Cookie", "control=placebo")
        .expect(function(res) {
          var assertion = Cookies.new({
            "substance": 'active'
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
      var expires = new Date();
      var expiresRenewed = new Date(expires.getTime() + 60000);

      var app = express();

      app.use(cookieParser(secrets));

      app.get('/', function(req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expiresRenewed, secure: 1, httpOnly: true, signed: true});
        res.send();
      });

      request(app)
        .get('/')
        .set("Cookie", "control=placebo;substance=active")
        .expect(function(res) {
          var assertion = Cookies.renew({
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

    it('asserts false if cookie expiration is less than or equal to already set cookie', function(done) {
      var expires = new Date();
      var expiresRenewed = new Date(expires.getTime() - 60000);

      var app = express();

      app.use(cookieParser(secrets));

      app.get('/', function(req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expiresRenewed, secure: 1, httpOnly: true, signed: true});
        res.send();
      });

      request(app)
        .get('/')
        .set("Cookie", "control=placebo;substance=active")
        .expect(function(res) {
          var assertion = Cookies.renew({
            "substance": 'active',
            "options": {
              "expires": expires.toUTCString()
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
          var assertion = Cookies.renew({
            "substance": 'active',
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
          var assertion = Cookies.renew({
            "substance": 'active',
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
          var assertion = Cookies.renew({
            "substance": 'active',
            "options": {
              "expires": expires.toUTCString()
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
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expires, secure: 1, httpOnly: true, signed: true});
        res.send();
      });

      request(app)
        .get('/')
        .set("Cookie", "control=placebo")
        .expect(function(res) {
          var assertion = Cookies.contain({
            "substance": 'active',
            "options": {
              "domain": 'domain.com',
              "path": '/',
              "expires": expires.toUTCString(),
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
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expires, secure: 1, httpOnly: true, signed: true});
        res.send();
      });

      request(app)
        .get('/')
        .set("Cookie", "control=placebo")
        .expect(function(res) {
          var assertion = Cookies.contain({
            "substance": 'active',
            "options": {
              "domain": 'domain.com',
              "path": '/',
              "expires": expires.toUTCString(),
              "max-age": 60,
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
          var assertion = Cookies.contain({
            "substance": 'active',
            "options": {
              "domain": 'domain.com',
              "path": '/',
              "expires": expires.toUTCString(),
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
            var assertion = Cookies.not('set', {
              "substance": 'active'
            });

            should(function() {
              assertion(res);
            }).not.throw();
          })
          .end(done);
      });

      it('asserts true if unsigned cookie is set but option is NOT set', function(done) {
        var expires = new Date();

        var app = express();

        app.use(cookieParser(secrets));

        app.get('/', function(req, res) {
          res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expires, secure: 1});
          res.send();
        });

        request(app)
          .get('/')
          .set("Cookie", "control=placebo")
          .expect(function(res) {
            var assertion = Cookies.not('set', {
              "substance": 'active',
              "options": {
                "httponly": true
              }
            });

            should(function() {
              assertion(res);
            }).not.throw();
          })
          .end(done);
      });

      it('asserts false if cookie is set', function(done) {
        var expires = new Date();

        var app = express();

        app.use(cookieParser(secrets));

        app.get('/', function(req, res) {
          res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expires, secure: 1});
          res.send();
        });

        request(app)
          .get('/')
          .set("Cookie", "control=placebo")
          .expect(function(res) {
            var assertion = Cookies.not('set', {
              "substance": 'active'
            });

            should(function() {
              assertion(res);
            }).throw();
          })
          .end(done);
      });
    });

    describe('.reset', function() {
      it('asserts true if cookie is NOT set but was already set', function(done) {
        var app = express();

        app.use(cookieParser(secrets));

        app.get('/', function(req, res) {
          res.send();
        });

        request(app)
          .get('/')
          .set("Cookie", "control=placebo;substance=active")
          .expect(function(res) {
            var assertion = Cookies.not('reset', {
              "substance": 'active'
            });

            should(function() {
              assertion(res);
            }).not.throw();
          })
          .end(done);
      });

      it('asserts false if unsigned cookie is set but was already set', function(done) {
        var expires = new Date();

        var app = express();

        app.use(cookieParser(secrets));

        app.get('/', function(req, res) {
          res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expires, secure: 1});
          res.send();
        });

        request(app)
          .get('/')
          .set("Cookie", "control=placebo;substance=active")
          .expect(function(res) {
            var assertion = Cookies.not('reset', {
              "substance": 'active'
            });

            should(function() {
              assertion(res);
            }).throw();
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
          res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expires, secure: 1, httpOnly: true, signed: true});
          res.send();
        });

        request(app)
          .get('/')
          .set("Cookie", "control=placebo;substance=active")
          .expect(function(res) {
            var assertion = Cookies.not('new', {
              "substance": 'active'
            });

            should(function() {
              assertion(res);
            }).not.throw();
          })
          .end(done);
      });

      it('asserts false if cookie is set and was NOT already set', function(done) {
        var expires = new Date();

        var app = express();

        app.use(cookieParser(secrets));

        app.get('/', function(req, res) {
          res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expires, secure: 1, httpOnly: true, signed: true});
          res.send();
        });

        request(app)
          .get('/')
          .set("Cookie", "control=placebo")
          .expect(function(res) {
            var assertion = Cookies.not('new', {
              "substance": 'active'
            });

            should(function() {
              assertion(res);
            }).throw();
          })
          .end(done);
      });
    });

    describe('.renew', function() {
      it('asserts true if cookie expiration is same as already set cookie', function(done) {
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
            var assertion = Cookies.not('renew', {
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

      it('asserts true if cookie expiration is less than as already set cookie', function(done) {
        var expires = new Date();
        var expiresRenewed = new Date(expires.getTime() - 60000);

        var app = express();

        app.use(cookieParser(secrets));

        app.get('/', function(req, res) {
          res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expiresRenewed, secure: 1, httpOnly: true, signed: true});
          res.send();
        });

        request(app)
          .get('/')
          .set("Cookie", "control=placebo;substance=active")
          .expect(function(res) {
            var assertion = Cookies.not('renew', {
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

      it('asserts false if cookie expiration is greater than already set cookie', function(done) {
        var expires = new Date();
        var expiresRenewed = new Date(expires.getTime() + 60000);

        var app = express();

        app.use(cookieParser(secrets));

        app.get('/', function(req, res) {
          res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expiresRenewed, secure: 1, httpOnly: true, signed: true});
          res.send();
        });

        request(app)
          .get('/')
          .set("Cookie", "control=placebo;substance=active")
          .expect(function(res) {
            var assertion = Cookies.not('renew', {
              "substance": 'active',
              "options": {
                "expires": expires.toUTCString()
              }
            });

            should(function() {
              assertion(res);
            }).throw();
          })
          .end(done);
      });

      it('asserts true if cookie max-age is same as already set cookie', function(done) {
        var app = express();

        app.use(cookieParser(secrets));

        app.get('/', function(req, res) {
          res.cookie('substance', 'active', {domain: 'domain.com', path: '/', maxAge: 60000, secure: 1, httpOnly: true, signed: true});
          res.send();
        });

        request(app)
          .get('/')
          .set("Cookie", "control=placebo;substance=active")
          .expect(function(res) {
            var assertion = Cookies.not('renew', {
              "substance": 'active',
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

      it('asserts true if cookie max-age is less than already set cookie', function(done) {
        var app = express();

        app.use(cookieParser(secrets));

        app.get('/', function(req, res) {
          res.cookie('substance', 'active', {domain: 'domain.com', path: '/', maxAge: 30000, secure: 1, httpOnly: true, signed: true});
          res.send();
        });

        request(app)
          .get('/')
          .set("Cookie", "control=placebo;substance=active")
          .expect(function(res) {
            var assertion = Cookies.not('renew', {
              "substance": 'active',
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

      it('asserts false if cookie max-age is greater than already set cookie', function(done) {
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
            var assertion = Cookies.not('renew', {
              "substance": 'active',
              "options": {
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
            var assertion = Cookies.not('contain', {
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

      it('asserts false if cookie contains expected options', function(done) {
        var expires = new Date();

        var app = express();

        app.use(cookieParser(secrets));

        app.get('/', function(req, res) {
          res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expires, secure: 1, httpOnly: true, signed: true});
          res.send();
        });

        request(app)
          .get('/')
          .set("Cookie", "control=placebo")
          .expect(function(res) {
            var assertion = Cookies.not('contain', {
              "substance": 'active',
              "options": {
                "domain": 'domain.com',
                "path": '/',
                "expires": expires.toUTCString(),
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
  });
});