var Signature = require('cookie-signature');

/**
 * Build Assertion function
 *
 * {object|object[]} expects cookies
 * {string} expects.<name> and value of cookie
 * {object} expects.options
 * {string} [expects.options.domain]
 * {string} [expects.options.path]
 * {string} [expects.options.expires] UTC string using date.toUTCString()
 * {number} [expects.options.max-age]
 * {boolean} [expects.options.secure]
 * {boolean} [expects.options.httponly]
 * {boolean} [expects.options.signed]
 *
 * @param {function[]} [asserts]
 * @returns {Assertion}
 */
module.exports = function(asserts) {
  var assertions = (Array.isArray(asserts)) ? asserts : [];

  function Assertion(res) {
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
    if (request.headers.cookie) request.cookies.push(Assertion.parse(request.headers.cookie));

    // build assertions response object
    if (Array.isArray(response.headers['set-cookie']) && 0 < response.headers['set-cookie'].length) {
      response.headers['set-cookie'].forEach(function(val) {
        response.cookies.push(Assertion.parse(val));
      });
    }

    // run assertions
    var result = undefined;
    assertions.every(function(assertion) {
      return ('string' !== typeof (result = assertion(request, response)));
    });

    return result;
  }

  /**
   * Find cookie in stack/array
   *
   * @param {string} name
   * @param {array} stack
   * @returns {object|undefined} cookie
   */
  Assertion.find = function(name, stack) {
    var cookie;

    stack.every(function(val) {
      if (name !== Object.keys(val)[0]) return;
      cookie = val;
      return false;
    });

    return cookie;
  };


  /**
   * Parse cookie string
   *
   * @param {string} str
   * @param {object} [options]
   * @param {function} [options.decode] uri
   * @returns {object}
   */
  Assertion.parse = function(str, options) {
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
        cookieRef[part.trim().toLowerCase()] = true;
        return;
      }

      var key = part.substr(0, equalsIndex).trim().toLowerCase();
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

    if ('undefined' === typeof cookie.options) cookie.options = {};

    return cookie;
  };


  /**
   * Assert cookie and options are set
   *
   * @param {object|object[]} expects cookies
   * @returns {function} Assertion
   */
  Assertion.set = function(expects) {
    if (!Array.isArray(expects)) expects = [expects];

    // assert expectations match cookies
    assertions.push(function(req, res) {
      expects.forEach(function(expect) {
        var name = Object.keys(expect)[0];
        var keys = Object.keys(expect.options);

        // get expectation cookie
        var cookie = Assertion.find(name, res);

        if (!cookie) throw new Error('failed expectation: ' + name + ' cookie was NOT set');

        // check cookie values are equal
        if (keys['signed']) should(expect[name]).be.eql(Assertion.find(name, res)[name]);
        else should(expect[name]).be.eql(cookie[name]);

        if ('undefined' !== keys['signed']) delete keys['signed'];

        keys.forEach(function(key) {
          should(expect.options[key]).be.eql();
        });
      });

      console.log(expects);
      console.log(res.cookies);
    });

    return Assertion;
  };


  /**
   * Assert cookie or options are NOT set
   *
   * @param {object|object[]} expects cookies
   * @returns {function} Assertion
   */
  Assertion.not = function(expects) {
    if (!Array.isArray(expects)) expects = [expects];

    // todo add not assertion

    return Assertion;
  };


  /**
   * Assert cookie is set and new
   *
   * @param {object|object[]} expects cookies
   * @returns {function} Assertion
   */
  Assertion.new = function(expects) {
    if (!Array.isArray(expects)) expects = [expects];

    // todo add new assertion

    return Assertion;
  };


  /**
   * Assert cookie has been reset
   *
   * @param {object|object[]} expects cookies
   * @param {object|object[]} compares cookies
   * @returns {function} Assertion
   */
  Assertion.reset = function(expects, compares) {
    if (!Array.isArray(expects)) expects = [expects];

    if (!Array.isArray(compares)) compares = [compares];

    // todo add reset assertion

    return Assertion;
  };


  /**
   * Assert cookie expires or max-age has increased
   *
   * @param {object|object[]} expects cookies
   * @param {object|object[]} compares cookies
   * @returns {function} Assertion
   */
  Assertion.renew = function(expects, compares) {
    if (!Array.isArray(expects)) expects = [expects];

    if (!Array.isArray(compares)) compares = [compares];

    // todo add renew assertion

    return Assertion;
  };


  return Assertion;
};