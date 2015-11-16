var Signature = require('cookie-signature');

/**
 * Construct cookie assertion (function)
 *
 * @param {object|object[]} expects cookies
 * @param {string} expects.<name> and value of cookie
 * @param {object} expects.options
 * @param {string} [expects.options.domain]
 * @param {string} [expects.options.path]
 * @param {string} [expects.options.expires] UTC string using date.toUTCString()
 * @param {number} [expects.options.max-age]
 * @param {boolean} [expects.options.secure]
 * @param {boolean} [expects.options.httponly]
 * @param {boolean} [expects.options.signed]
 * @param {function(req, res)[]} [asserts] ran within returned assertion function
 * @throws {error}
 * @returns {function} assertion
 * @constructor
 */
function ExpectCookie(expects, asserts) {
  if (!Array.isArray(expects)) expects = [expects];

  if (!Array.isArray(asserts)) asserts = [];

  asserts.push(function(req, res) {
    console.log(req);
    console.log(res);
    // todo write common assertions ==
  });

  function assertion(res) {
    if ('object' !== typeof res) throw new Error('res argument must be object');

    // request and response object initialization
    var request = {
      headers: res.req._headers,
      cookies: []
    };

    var response = {
      headers: res.headers,
      cookies: []
    };

    // build assertions request object
    if (request.headers.cookie) request.cookies.push(ExpectCookie.parse(request.headers.cookie));

    // build assertions response object
    if (Array.isArray(response.headers['set-cookie']) && 0 < response.headers['set-cookie'].length) {
      response.headers['set-cookie'].forEach(function(val) {
        response.cookies.push(ExpectCookie.parse(val));
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
 * Parse cookie string
 *
 * @param {string} str
 * @param {object} [options]
 * @param {function} [options.decode] uri
 * @returns {object}
 */
ExpectCookie.parse = function(str, options) {
  if ('string' !== typeof str) throw new TypeError('argument str must be a string');

  if ('object' !== typeof options) options = {};

  var decode = options.decode || decodeURIComponent;

  var parts = str.split(/; */);

  var cookie = {};

  parts.forEach(function(part, i) {
    if (1 === i) cookie.options = {};
    var cookieRef = (0 === i) ? cookie : cookie.options;

    var equalsIndex = part.indexOf('=');

    // things that don't look like key=value get true flag
    if (equalsIndex < 0) {
      cookieRef[part.trim()] = true;
      return;
    }

    var key = part.substr(0, equalsIndex).trim();
    // only assign once
    if ('undefined' !== typeof cookie[key]) return;

    var val = part.substr(++equalsIndex, part.length).trim();
    // quoted values
    if ('"' == val[0]) val = val.slice(1, -1);

    try {
      cookieRef[key] = decode(val);
    } catch (e) {
      cookieRef[key] = val;
    }
  });

  return cookie;
};


/**
 * Assert cookie is set and new
 *
 * @param {object|object[]} expects cookies
 * @param {function(req, res)[]} asserts
 * @returns {function}
 */
ExpectCookie.new = function(expects, asserts) {
  if (!Array.isArray(expects)) expects = [expects];

  if (!Array.isArray(asserts)) asserts = [];

  // todo add new assertion

  return ExpectCookie(expects, asserts);
};


/**
 * Assert cookie is NOT set
 *
 * @param {object|object[]} expects cookies
 * @param {function(req, res)[]} asserts
 * @returns {function}
 */
ExpectCookie.not = function(expects, asserts) {
  if (!Array.isArray(expects)) expects = [expects];

  if (!Array.isArray(asserts)) asserts = [];

  // todo add not assertion

  return ExpectCookie(expects, asserts);
};


/**
 * Assert cookie has been reset
 *
 * @param {object|object[]} expects cookies
 * @param {object|object[]} compares cookies
 * @param {function(req, res)[]} asserts
 * @returns {function}
 */
ExpectCookie.reset = function(expects, compares, asserts) {
  if (!Array.isArray(expects)) expects = [expects];

  if (!Array.isArray(compares)) compares = [compares];

  if (!Array.isArray(asserts)) asserts = [];

  // todo add reset assertion

  return ExpectCookie(expects, asserts);
};


/**
 * Assert cookie expires or max-age has increased
 *
 * @param {object|object[]} expects cookies
 * @param {object|object[]} compares cookies
 * @param {function(req, res)[]} asserts
 * @returns {function}
 */
ExpectCookie.renew = function(expects, compares, asserts) {
  if (!Array.isArray(expects)) expects = [expects];

  if (!Array.isArray(compares)) compares = [compares];

  if (!Array.isArray(asserts)) asserts = [];

  // todo add renew assertion

  return ExpectCookie(expects, asserts);
};


module.exports = ExpectCookie;