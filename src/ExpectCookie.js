var Cookie = require('cookie');
var Signature = require('cookie-signature');

/**
 * Construct cookie assertion (function)
 *
 * @param {object} options cookie options
 * @param {string} options.name
 * @param {string} options.value
 * @param {string} [options.domain]
 * @param {string} [options.path]
 * @param {string} [options.expires] UTC string using date.toUTCString()
 * @param {number} [options.max-age]
 * @param {boolean} [options.secure]
 * @param {boolean} [options.httponly]
 * @param {string} [options.signed] secret to check against value
 * @param {function(req, res)[]} assertions ran within returned assertion function
 * @returns {function} assertion
 * @constructor
 */
function ExpectCookie(options, assertions) {
  if (!Array.isArray(assertions)) assertions = [];

  // todo add assertions for provided options

  // todo decide how to handle signatures (options, etc)

  function assertion(res) {
    if ('object' !== typeof res) throw new Error('invalid res argument');

    // build assertions request object
    var request = {
      headers: res.req._headers,
      cookies: {}
    };

    if (request.headers.cookie) request.cookies = Cookie.parse(request.headers.cookie);

    // build assertions response object
    var response = {
      headers: res.headers,
      cookies: {}
    };

    if (Array.isArray(response.headers['set-cookie']) && 0 < response.headers['set-cookie'].length) {
      response.headers['set-cookie'].forEach(function(val) {
        var cookie = Cookie.parse(val);

        var properties = Object.keys(cookie);
        var name = properties.shift();

        response.cookies[name] = {
          name: name,
          value: cookie[name]
        };
        properties.forEach(function(prop) {
          response.cookies[name][prop.toLowerCase()] = cookie[prop];
        });
      });
    }

    // run assertions
    var result = undefined;
    assertions.every(function(assertion) {
      return ('string' !== typeof (result = assertion(request, response)));
    });

    return result;
  }

  return assertion;
}


/**
 * Assert cookie is set for first time
 *
 * @param {object} options for cookie
 * @param {function(req, res)[]} assertions
 * @returns {function}
 */
ExpectCookie.first = function(options, assertions) {
  if (!Array.isArray(assertions)) assertions = [];

  // todo add first assertion

  return ExpectCookie(options, assertions);
};


/**
 * Assert cookie is NOT set
 *
 * @param {object} options for cookie
 * @param {function(req, res)[]} assertions
 * @returns {function}
 */
ExpectCookie.notSet = function(options, assertions) {
  if (!Array.isArray(assertions)) assertions = [];

  // todo add notSet assertion

  return ExpectCookie(options, assertions);
};


/**
 * Assert cookie has been reset
 *
 * @param {object} options for cookie
 * @param {object} compare cookie
 * @param {function(req, res)[]} assertions
 * @returns {function}
 */
ExpectCookie.reset = function(options, compare, assertions) {
  if (!Array.isArray(assertions)) assertions = [];

  // todo add reset assertion

  return ExpectCookie(options, assertions);
};


/**
 * Assert cookie expires or max-age has increased
 *
 * @param {object} options for cookie
 * @param {object} compare cookie
 * @param {function(req, res)[]} assertions
 * @returns {function}
 */
ExpectCookie.renew = function(options, compare, assertions) {
  if (!Array.isArray(assertions)) assertions = [];

  // todo add renew assertion

  return ExpectCookie(options, assertions);
};


module.exports = ExpectCookie;