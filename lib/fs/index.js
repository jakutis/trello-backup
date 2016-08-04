var fs = require('fs');
var Promise = require('bluebird');

exports.createWriteStream = fs.createWriteStream.bind(fs);
exports.exists = require('./exists');
exports.readJSONFile = require('./readJSONFile');
exports.mkdirp = Promise.promisify(require('mkdirp'));
