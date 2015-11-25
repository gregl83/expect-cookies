var Assertion = require('./Assertion');

/**
 * Construct cookies assertion (function)
 *
 * @param {null|string|string[]} [secret]
 * @param {function(req, res)[]} [asserts] ran within returned assertion function
 * @returns {function} assertion
 * @constructor
 */
function ExpectCookies(secret, asserts) {
  return Assertion(secret, asserts);
}


// build ExpectCookies proxy methods
var assertion = Assertion();
var methods = Object.getOwnPropertyNames(assertion);

methods.forEach(function(method) {
  if ('function' === typeof assertion[method] && 'undefined' === typeof Function[method]) {
    ExpectCookies[method] = function() {
      var assertion = Assertion();
      return assertion[method].apply(assertion, arguments);
    };
  }
});


module.exports = ExpectCookies;