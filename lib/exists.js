var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

module.exports = function exists(filename) {
  return fs.statAsync(filename).return(true).catch(function () {
    return false;
  });
}
