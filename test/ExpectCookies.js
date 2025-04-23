const express = require('express');
const cookieParser = require('cookie-parser');
const request = require('supertest');
const should = require('should');
const sinon = require('sinon');

const Cookies = require('../');
const Assertion = require('../src/Assertion');

const secrets = ['one', 'a', 'two', 'b'];

describe('Cookies', function() {
  it('returns Assertion function', function(done) {
    const assertion = Assertion();
    const cookiesAssertion = Cookies();

    should(cookiesAssertion).be.eql(assertion);

    done();
  });

  it('runs single asserts', function(done) {
    let assertion = sinon.stub();

    const app = express();

    app.get('/', function(req, res) {
      res.send();
    });

    request(app)
      .get('/')
      .set('Cookie', 'control=placebo')
      .expect(Cookies(null, assertion))
      .end(function() {
        sinon.assert.calledOnce(assertion);
        done();
      });
  });

  it('runs multiple asserts', function(done) {
    let assertionA = sinon.stub();
    let assertionB = sinon.stub();

    let asserts = [
      assertionA,
      assertionB
    ];

    const app = express();

    app.get('/', function(req, res) {
      res.send();
    });

    request(app)
      .get('/')
      .set('Cookie', 'control=placebo')
      .expect(Cookies(null, asserts))
      .end(function() {
        sinon.assert.calledOnce(assertionA);
        sinon.assert.calledOnce(assertionB);
        done();
      });
  });

  describe('.set', function() {
    it('asserts true if signed cookie is set and options are set', function(done) {
      const app = express();

      app.use(cookieParser(secrets));

      app.get('/', function(req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: new Date(), secure: 1, httpOnly: true, signed: true});
        res.send();
      });

      request(app)
        .get('/')
        .set('Cookie', 'control=placebo')
        .expect(function(res) {
          const assertion = Cookies.set({
            'name': 'substance',
            'options': ['domain', 'path', 'expires', 'secure', 'httponly']
          });

          should(function() {
            assertion(res);
          }).not.throw();
        })
        .end(done);
    });

    it('asserts true if unsigned cookie is set and options are set', function(done) {
      const app = express();

      app.use(cookieParser(secrets));

      app.get('/', function(req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: new Date(), secure: 1, httpOnly: true});
        res.send();
      });

      request(app)
        .get('/')
        .set('Cookie', 'control=placebo')
        .expect(function(res) {
          const assertion = Cookies.set({
            'name': 'substance',
            'options': ['domain', 'path', 'expires', 'secure', 'httponly']
          });

          should(function() {
            assertion(res);
          }).not.throw();
        })
        .end(done);
    });

    it('asserts false if unsigned cookie is set but option was NOT set', function(done) {
      const app = express();

      app.use(cookieParser(secrets));

      app.get('/', function(req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: new Date(), secure: 1});
        res.send();
      });

      request(app)
        .get('/')
        .set('Cookie', 'control=placebo')
        .expect(function(res) {
          const assertion = Cookies.set({
            'name': 'substance',
            'options': ['domain', 'path', 'expires', 'secure', 'httponly']
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
      const app = express();

      app.use(cookieParser(secrets));

      app.get('/', function(req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: new Date(), secure: 1, httpOnly: true, signed: true});
        res.send();
      });

      request(app)
        .get('/')
        .set('Cookie', 'control=placebo;substance=active')
        .expect(function(res) {
          const assertion = Cookies.reset({
            'name': 'substance'
          });

          should(function() {
            assertion(res);
          }).not.throw();
        })
        .end(done);
    });

    it('asserts false if cookie is NOT set', function(done) {
      const app = express();

      app.use(cookieParser(secrets));

      app.get('/', function(req, res) {
        res.send();
      });

      request(app)
        .get('/')
        .set('Cookie', 'control=placebo')
        .expect(function(res) {
          const assertion = Cookies.reset({
            'name': 'substance'
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
      const app = express();

      app.use(cookieParser(secrets));

      app.get('/', function(req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: new Date(), secure: 1, httpOnly: true, signed: true});
        res.send();
      });

      request(app)
        .get('/')
        .set('Cookie', 'control=placebo')
        .expect(function(res) {
          const assertion = Cookies.new({
            'name': 'substance'
          });

          should(function() {
            assertion(res);
          }).not.throw();
        })
        .end(done);
    });

    it('asserts false if signed cookie is set but was already set', function(done) {
      const app = express();

      app.use(cookieParser(secrets));

      app.get('/', function(req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: new Date(), secure: 1, httpOnly: true, signed: true});
        res.send();
      });

      request(app)
        .get('/')
        .set('Cookie', 'control=placebo;substance=active')
        .expect(function(res) {
          const assertion = Cookies.new({
            'name': 'substance'
          });

          should(function() {
            assertion(res);
          }).throw();
        })
        .end(done);
    });

    it('asserts false if cookie is NOT set', function(done) {
      const app = express();

      app.use(cookieParser(secrets));

      app.get('/', function(req, res) {
        res.send();
      });

      request(app)
        .get('/')
        .set('Cookie', 'control=placebo')
        .expect(function(res) {
          const assertion = Cookies.new({
            'name': 'substance'
          });

          should(function() {
            assertion(res);
          }).throw();
        })
        .end(done);
    });
  });

  describe('.renew', function() {
    it('asserts true if set cookie expires is greater than expects cookie', function(done) {
      const expires = new Date();
      const expiresRenewed = new Date(expires.getTime() + 5000); // using 5000 ms for date precision safety

      const app = express();

      app.use(cookieParser(secrets));

      app.get('/', function(req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expiresRenewed, secure: 1, httpOnly: true, signed: true});
        res.send();
      });

      request(app)
        .get('/')
        .set('Cookie', 'control=placebo;substance=active')
        .expect(function(res) {
          const assertion = Cookies.renew({
            'name': 'substance',
            'options': {
              'expires': expires.toUTCString()
            }
          });

          should(function() {
            assertion(res);
          }).not.throw();
        })
        .end(done);
    });

    it('asserts false if set cookie expires is less than expects cookie', function(done) {
      const expires = new Date();
      const expiresRenewed = new Date(expires.getTime() - 5000); // using 5000 ms for date precision safety

      const app = express();

      app.use(cookieParser(secrets));

      app.get('/', function(req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expiresRenewed, secure: 1, httpOnly: true, signed: true});
        res.send();
      });

      request(app)
        .get('/')
        .set('Cookie', 'control=placebo;substance=active')
        .expect(function(res) {
          const assertion = Cookies.renew({
            'name': 'substance',
            'options': {
              'expires': expires.toUTCString()
            }
          });

          should(function() {
            assertion(res);
          }).throw();
        })
        .end(done);
    });

    it('asserts false if set cookie expires is equal to expects cookie', function(done) {
      const expires = new Date();
      const expiresRenewed = expires;

      const app = express();

      app.use(cookieParser(secrets));

      app.get('/', function(req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expiresRenewed, secure: 1, httpOnly: true, signed: true});
        res.send();
      });

      request(app)
          .get('/')
          .set('Cookie', 'control=placebo;substance=active')
          .expect(function(res) {
            const assertion = Cookies.renew({
              'name': 'substance',
              'options': {
                'expires': expires.toUTCString()
              }
            });

            should(function() {
              assertion(res);
            }).throw();
          })
          .end(done);
    });

    it('asserts true if set cookie max-age is greater than expects cookie', function(done) {
      const maxAge = 60;
      const maxAgeRenewed = (maxAge + 1) * 1000; // res.cookie expects ms

      const app = express();

      app.use(cookieParser(secrets));

      app.get('/', function(req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', 'maxAge': maxAgeRenewed, secure: 1, httpOnly: true, signed: true});
        res.send();
      });

      request(app)
        .get('/')
        .set('Cookie', 'control=placebo;substance=active')
        .expect(function(res) {
          const assertion = Cookies.renew({
            'name': 'substance',
            'options': {
              'max-age': maxAge
            }
          });

          should(function() {
            assertion(res);
          }).not.throw();
        })
        .end(done);
    });

    it('asserts false if set cookie max-age is less than expects cookie', function(done) {
      const maxAge = 120;
      const maxAgeRenewed = (maxAge - 1) * 1000; // res.cookie expects ms

      const app = express();

      app.use(cookieParser(secrets));

      app.get('/', function(req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', 'maxAge': maxAgeRenewed, secure: 1, httpOnly: true, signed: true});
        res.send();
      });

      request(app)
        .get('/')
        .set('Cookie', 'control=placebo;substance=active')
        .expect(function(res) {
          const assertion = Cookies.renew({
            'name': 'substance',
            'options': {
              'max-age': maxAge
            }
          });

          should(function() {
            assertion(res);
          }).throw();
        })
        .end(done);
    });

    it('asserts false if set cookie max-age is equal to expects cookie', function(done) {
      const maxAge = 60000;

      const app = express();

      app.use(cookieParser(secrets));

      app.get('/', function(req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', 'maxAge': maxAge, secure: 1, httpOnly: true, signed: true});
        res.send();
      });

      request(app)
          .get('/')
          .set('Cookie', 'control=placebo;substance=active')
          .expect(function(res) {
            const assertion = Cookies.renew({
              'name': 'substance',
              'options': {
                'max-age': maxAge
              }
            });

            should(function() {
              assertion(res);
            }).throw();
          })
          .end(done);
    });

    it('asserts false if cookie is NOT set', function(done) {
      const expires = new Date();

      const app = express();

      app.use(cookieParser(secrets));

      app.get('/', function(req, res) {
        res.send();
      });

      request(app)
        .get('/')
        .set('Cookie', 'control=placebo')
        .expect(function(res) {
          const assertion = Cookies.renew({
            'name': 'substance',
            'options': {
              'expires': expires.toUTCString()
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
      const expires = new Date();

      const app = express();

      app.use(cookieParser(secrets));

      app.get('/', function(req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expires, secure: 1, httpOnly: true, signed: true});
        res.send();
      });

      request(app)
        .get('/')
        .set('Cookie', 'control=placebo')
        .expect(function(res) {
          const assertion = Cookies(secrets).contain({
            'name': 'substance',
            'value': 'active',
            'options': {
              'domain': 'domain.com',
              'path': '/',
              'expires': expires.toUTCString(),
              'secure': true,
              'httponly': true
            }
          });

          should(function() {
            assertion(res);
          }).not.throw();
        })
        .end(done);
    });

    it('asserts false if cookie does NOT contain expected options', function(done) {
      const expires = new Date();

      const app = express();

      app.use(cookieParser(secrets));

      app.get('/', function(req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expires, secure: 1, httpOnly: true, signed: true});
        res.send();
      });

      request(app)
        .get('/')
        .set('Cookie', 'control=placebo')
        .expect(function(res) {
          const assertion = Cookies(secrets).contain({
            'name': 'substance',
            'value': 'active',
            'options': {
              'domain': 'domain.com',
              'path': '/',
              'expires': expires.toUTCString(),
              'max-age': 60,
              'secure': true,
              'httponly': true
            }
          });

          should(function() {
            assertion(res);
          }).throw();
        })
        .end(done);
    });

    it('handles type conversion for max-age', function(done) {
      var app = express();

      app.use(cookieParser(secrets));

      app.get('/', function (req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com', maxAge: 60000});
        res.send();
      });

      request(app)
        .get('/')
        .set('Cookie', 'control=placebo')
        .expect(function (res) {
          var assertion = Cookies(secrets).contain({
            'name': 'substance',
            'value': 'active',
            'options': {
              'domain': 'domain.com',
              'max-age': 60
            }
          });

          should(function () {
            assertion(res);
          }).not.throw();
        })
        .end(done);
    });

    it('allows any value if omitted from expects object', function(done) {
      var app = express();
      app.use(cookieParser(secrets));
      app.get('/', function (req, res) {
        res.cookie('substance', 'active', {domain: 'domain.com'});
        res.send();
      });

      request(app)
        .get('/')
        .set('Cookie', 'control=placebo')
        .expect(function (res) {
          var assertion = Cookies(secrets).contain({
            'name': 'substance',
            'options': {
              'domain': 'domain.com',
            },
          });

          should(function () {
            assertion(res);
          }).not.throw();
        })
        .end(done);
    });

    it('asserts false if cookie does NOT exist', function(done) {
      const expires = new Date();

      const app = express();

      app.use(cookieParser(secrets));

      app.get('/', function(req, res) {
        res.send();
      });

      request(app)
        .get('/')
        .set('Cookie', 'control=placebo')
        .expect(function(res) {
          const assertion = Cookies(secrets).contain({
            'name': 'substance',
            'value': 'active',
            'options': {
              'domain': 'domain.com',
              'path': '/',
              'expires': expires.toUTCString(),
              'secure': true,
              'httponly': true
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
        const app = express();

        app.use(cookieParser(secrets));

        app.get('/', function(req, res) {
          res.send();
        });

        request(app)
          .get('/')
          .set('Cookie', 'control=placebo')
          .expect(function(res) {
            const assertion = Cookies.not('set', {
              'name': 'substance'
            });

            should(function() {
              assertion(res);
            }).not.throw();
          })
          .end(done);
      });

      it('asserts true if unsigned cookie is set but option is NOT set', function(done) {
        const expires = new Date();

        const app = express();

        app.use(cookieParser(secrets));

        app.get('/', function(req, res) {
          res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expires, secure: 1});
          res.send();
        });

        request(app)
          .get('/')
          .set('Cookie', 'control=placebo')
          .expect(function(res) {
            const assertion = Cookies.not('set', {
              'substance': 'active',
              'name': 'substance',
              'options': ['httponly']
            });

            should(function() {
              assertion(res);
            }).not.throw();
          })
          .end(done);
      });

      it('asserts false if cookie is set', function(done) {
        const expires = new Date();

        const app = express();

        app.use(cookieParser(secrets));

        app.get('/', function(req, res) {
          res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expires, secure: 1});
          res.send();
        });

        request(app)
          .get('/')
          .set('Cookie', 'control=placebo')
          .expect(function(res) {
            const assertion = Cookies.not('set', {
              'name': 'substance'
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
        const app = express();

        app.use(cookieParser(secrets));

        app.get('/', function(req, res) {
          res.send();
        });

        request(app)
          .get('/')
          .set('Cookie', 'control=placebo;substance=active')
          .expect(function(res) {
            const assertion = Cookies.not('reset', {
              'name': 'substance'
            });

            should(function() {
              assertion(res);
            }).not.throw();
          })
          .end(done);
      });

      it('asserts false if unsigned cookie is set but was already set', function(done) {
        const expires = new Date();

        const app = express();

        app.use(cookieParser(secrets));

        app.get('/', function(req, res) {
          res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expires, secure: 1});
          res.send();
        });

        request(app)
          .get('/')
          .set('Cookie', 'control=placebo;substance=active')
          .expect(function(res) {
            const assertion = Cookies.not('reset', {
              'name': 'substance'
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
        const expires = new Date();

        const app = express();

        app.use(cookieParser(secrets));

        app.get('/', function(req, res) {
          res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expires, secure: 1, httpOnly: true, signed: true});
          res.send();
        });

        request(app)
          .get('/')
          .set('Cookie', 'control=placebo;substance=active')
          .expect(function(res) {
            const assertion = Cookies.not('new', {
              'name': 'substance'
            });

            should(function() {
              assertion(res);
            }).not.throw();
          })
          .end(done);
      });

      it('asserts false if cookie is set and was NOT already set', function(done) {
        const expires = new Date();

        const app = express();

        app.use(cookieParser(secrets));

        app.get('/', function(req, res) {
          res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expires, secure: 1, httpOnly: true, signed: true});
          res.send();
        });

        request(app)
          .get('/')
          .set('Cookie', 'control=placebo')
          .expect(function(res) {
            const assertion = Cookies.not('new', {
              'name': 'substance'
            });

            should(function() {
              assertion(res);
            }).throw();
          })
          .end(done);
      });
    });

    describe('.renew', function() {
      it('asserts true if set cookie expires is equal to expects cookie', function(done) {
        const expires = new Date();

        const app = express();

        app.use(cookieParser(secrets));

        app.get('/', function(req, res) {
          res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expires, secure: 1, httpOnly: true, signed: true});
          res.send();
        });

        request(app)
          .get('/')
          .set('Cookie', 'control=placebo;substance=active')
          .expect(function(res) {
            const assertion = Cookies.not('renew', {
              'name': 'substance',
              'options': {
                'expires': expires.toUTCString()
              }
            });

            should(function() {
              assertion(res);
            }).not.throw();
          })
          .end(done);
      });

      it('asserts true if set cookie expires is less than expects cookie', function(done) {
        const expires = new Date();
        const expiresRenewed = new Date(expires.getTime() - 5000); // using 5000 ms for date precision safety

        const app = express();

        app.use(cookieParser(secrets));

        app.get('/', function(req, res) {
          res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expiresRenewed, secure: 1, httpOnly: true, signed: true});
          res.send();
        });

        request(app)
          .get('/')
          .set('Cookie', 'control=placebo;substance=active')
          .expect(function(res) {
            const assertion = Cookies.not('renew', {
              'name': 'substance',
              'options': {
                'expires': expires.toUTCString()
              }
            });

            should(function() {
              assertion(res);
            }).not.throw();
          })
          .end(done);
      });

      it('asserts false if set cookie expires is greater than expects cookie', function(done) {
        const expires = new Date();
        const expiresRenewed = new Date(expires.getTime() + 5000); // using 5000 ms for date precision safety

        const app = express();

        app.use(cookieParser(secrets));

        app.get('/', function(req, res) {
          res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expiresRenewed, secure: 1, httpOnly: true, signed: true});
          res.send();
        });

        request(app)
          .get('/')
          .set('Cookie', 'control=placebo;substance=active')
          .expect(function(res) {
            const assertion = Cookies.not('renew', {
              'name': 'substance',
              'options': {
                'expires': expires.toUTCString()
              }
            });

            should(function() {
              assertion(res);
            }).throw();
          })
          .end(done);
      });

      it('asserts true if set cookie max-age is same as expects cookie', function(done) {
        const maxAge = 60;
        const maxAgeRenewed = maxAge * 1000; // res.cookie expects ms

        const app = express();

        app.use(cookieParser(secrets));

        app.get('/', function(req, res) {
          res.cookie('substance', 'active', {domain: 'domain.com', path: '/', maxAge: maxAgeRenewed, secure: 1, httpOnly: true, signed: true});
          res.send();
        });

        request(app)
          .get('/')
          .set('Cookie', 'control=placebo;substance=active')
          .expect(function(res) {
            const assertion = Cookies.not('renew', {
              'name': 'substance',
              'options': {
                'max-age': maxAge
              }
            });

            should(function() {
              assertion(res);
            }).not.throw();
          })
          .end(done);
      });

      it('asserts true if set cookie max-age is less than expects cookie', function(done) {
        const maxAge = 60;
        const maxAgeRenewed = (maxAge - 1) * 1000; // res.cookie expects ms

        const app = express();

        app.use(cookieParser(secrets));

        app.get('/', function(req, res) {
          res.cookie('substance', 'active', {domain: 'domain.com', path: '/', maxAge: maxAgeRenewed, secure: 1, httpOnly: true, signed: true});
          res.send();
        });

        request(app)
          .get('/')
          .set('Cookie', 'control=placebo;substance=active')
          .expect(function(res) {
            const assertion = Cookies.not('renew', {
              'name': 'substance',
              'options': {
                'max-age': maxAge
              }
            });

            should(function() {
              assertion(res);
            }).not.throw();
          })
          .end(done);
      });

      it('asserts false if set cookie max-age is greater than expires cookie', function(done) {
        const maxAge = 60;
        const maxAgeRenewed = (maxAge + 1) * 1000; // res.cookie expects ms

        const app = express();

        app.use(cookieParser(secrets));

        app.get('/', function(req, res) {
          res.cookie('substance', 'active', {domain: 'domain.com', path: '/', 'maxAge': maxAgeRenewed, secure: 1, httpOnly: true, signed: true});
          res.send();
        });

        request(app)
          .get('/')
          .set('Cookie', 'control=placebo;substance=active')
          .expect(function(res) {
            const assertion = Cookies.not('renew', {
              'name': 'substance',
              'options': {
                'max-age': maxAge
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
        const expires = new Date();

        const app = express();

        app.use(cookieParser(secrets));

        app.get('/', function(req, res) {
          res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expires, 'maxAge': 60000, secure: 1, httpOnly: true});
          res.send();
        });

        request(app)
          .get('/')
          .set('Cookie', 'control=placebo')
          .expect(function(res) {
            const assertion = Cookies(secrets).not('contain', {
              'name': 'substance',
              'value': 'active'
            });

            should(function() {
              assertion(res);
            }).not.throw();
          })
          .end(done);
      });

      it('asserts false if cookie contains expected options', function(done) {
        const expires = new Date();

        const app = express();

        app.use(cookieParser(secrets));

        app.get('/', function(req, res) {
          res.cookie('substance', 'active', {domain: 'domain.com', path: '/', expires: expires, secure: 1, httpOnly: true, signed: true});
          res.send();
        });

        request(app)
          .get('/')
          .set('Cookie', 'control=placebo')
          .expect(function(res) {
            const assertion = Cookies(secrets).not('contain', {
              'name': 'substance',
              'value': 'active',
              'options': {
                'domain': 'domain.com',
                'path': '/',
                'expires': expires.toUTCString(),
                'secure': true,
                'httponly': true
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