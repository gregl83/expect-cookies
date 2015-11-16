var Cookie = require('cookie');
var Signature = require('cookie-signature');

/**
 * Construct cookie assertion (function)
 *
 * @param {object[]} expects cookies
 * @param {string} expects.<name> and value of cookie
 * @param {object} expects.options
 * @param {string} [expects.options.domain]
 * @param {string} [expects.options.path]
 * @param {string} [expects.options.expires] UTC string using date.toUTCString()
 * @param {number} [expects.options.max-age]
 * @param {boolean} [expects.options.secure]
 * @param {boolean} [expects.options.httponly]
 * @param {string} [expects.options.signed] secret to check against value
 * @param {function(req, res)[]} [asserts] ran within returned assertion function
 * @throws {error}
 * @returns {function} assertion
 * @constructor
 */
function ExpectCookie(expects, asserts) {
  if (!Array.isArray(expects)) throw new Error('expects argument must be array');

  if (!Array.isArray(asserts)) asserts = [];

  // todo add assertions for provided options

  // todo decide how to handle signatures (options, etc)

  // todo cookie should be array for cookies

  // FIXME consider making cookie options the same as a parsed cookie!

  function assertion(res) {
    if ('object' !== typeof res) throw new Error('res argument must be object');

    // request and response object initialization
    var request = {
      headers: res.req._headers,
      cookies: {}
    };

    var response = {
      headers: res.headers,
      cookies: {}
    };

    // build assertions request object
    if (request.headers.cookie) request.cookies = Cookie.parse(request.headers.cookie);

    // build assertions response object
    if (Array.isArray(response.headers['set-cookie']) && 0 < response.headers['set-cookie'].length) {
      response.headers['set-cookie'].forEach(function(val) {
        var cookie = Cookie.parse(val);
        // fixme custom cookie parsing
        var properties = Object.keys(cookie);
        var name = properties[0];

        response.cookies[name] = {};
        properties.forEach(function(prop) {
          response.cookies[name][prop.toLowerCase()] = cookie[prop];
        });
      });
    }

    // run assertions
    var result = undefined;
    asserts.every(function(assertion) {
      return ('string' !== typeof (result = assertion(request, response)));
    });

    return result;
  }

  return assertion;
}


/**
 * Assert cookie is set and new
 *
 * @param {object[]} expects cookies
 * @param {function(req, res)[]} asserts
 * @returns {function}
 */
ExpectCookie.new = function(expects, asserts) {
  if (!Array.isArray(asserts)) asserts = [];

  // todo add new assertion

  return ExpectCookie(expects, asserts);
};


/**
 * Assert cookie is NOT set
 *
 * @param {object[]} expects cookies
 * @param {function(req, res)[]} asserts
 * @returns {function}
 */
ExpectCookie.not = function(expects, asserts) {
  if (!Array.isArray(asserts)) asserts = [];

  // todo add not assertion

  return ExpectCookie(expects, asserts);
};


/**
 * Assert cookie has been reset
 *
 * @param {object[]} expects cookies
 * @param {object[]} compares cookies
 * @param {function(req, res)[]} asserts
 * @returns {function}
 */
ExpectCookie.reset = function(expects, compares, asserts) {
  if (!Array.isArray(asserts)) asserts = [];

  // todo add reset assertion

  return ExpectCookie(expects, asserts);
};


/**
 * Assert cookie expires or max-age has increased
 *
 * @param {object[]} expects cookies
 * @param {object[]} compares cookies
 * @param {function(req, res)[]} asserts
 * @returns {function}
 */
ExpectCookie.renew = function(expects, compares, asserts) {
  if (!Array.isArray(asserts)) asserts = [];

  // todo add renew assertion

  return ExpectCookie(expects, asserts);
};


module.exports = ExpectCookie;