var Assertion = require('./Assertion');

/**
 * Construct cookie assertion (function)
 *
 * @param {function(req, res)[]} asserts ran within returned assertion function
 * @throws {error}
 * @returns {function} assertion
 * @constructor
 */
function ExpectCookie(asserts) {
  return Assertion(asserts);
}


// build ExpectCookie proxy methods
var assertion = Assertion();
var methods = Object.getOwnPropertyNames(assertion);

methods.forEach(function(method) {
  if ('function' === typeof assertion[method] && 'undefined' === typeof Function[method]) {
    ExpectCookie[method] = function() {
      return Assertion()[method].apply(arguments);
    };
  }
});


module.exports = ExpectCookie;