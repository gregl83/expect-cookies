/**
 * Construct for cookie assertion
 *
 * @param {object} options
 * @param {string} options.name
 * @param {string} options.value
 * @param {string} options.domain
 * @param {string} options.path
 * @param {string} options.expires
 * @param {string} options.max-age
 * @param {string} options.secure
 * @param {string} options.httponly
 * @returns {function} assertion
 * @constructor
 */
function ExpectCookie(options) {
  // todo


  function assertion(res) {

  }

  return assertion;
}


/**
 * Assert cookie is set
 *
 * @param {object} options
 * @param {boolean} initial time cookie is set
 * @returns {function}
 */
ExpectCookie.set = function(options, initial) {
  if ('boolean' !== typeof initial) initial = true;

  // todo

  return ExpectCookie(options);
};


/**
 * Assert cookie is NOT set
 *
 * @param options {object}
 * @returns {function}
 */
ExpectCookie.notSet = function(options) {
  // todo

  return ExpectCookie(options);
};


/**
 * Assert cookie has been reset
 *
 * @param options {object}
 * @returns {function}
 */
ExpectCookie.reset = function(options) {
  // todo

  return ExpectCookie(options);
};


/**
 * Assert cookie expires or max-age has increased
 *
 * @param options {object}
 * @returns {function}
 */
ExpectCookie.renew = function(options) {
  // todo

  return ExpectCookie(options);
};


module.exports = ExpectCookie;