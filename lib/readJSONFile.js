var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

module.exports = function readJSONFile(filename) {
  return Promise
    .resolve(fs.readFileAsync(filename))
    .then(JSON.parse);
};
