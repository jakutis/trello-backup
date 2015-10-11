var Promise = require('bluebird');
var got = require('got');
var fs = Promise.promisifyAll(require('fs'));
var debug = require('debug')('download');

var remaining = 0;
module.exports = function download(opts) {
  remaining += 1;
  debug('Starting download of ' + opts.url + ' to ' + opts.filename + '.');
  debug('Number of remaining downloads is ' + remaining + '.');
  return new Promise(function (resolve, reject) {
    got
      .stream(opts.url)
      .pipe(fs.createWriteStream(opts.filename))
      .on('close', function () {
        remaining -= 1;
        debug('Successfully finished downloading ' + opts.url + '.');
        debug('Number of remaining downloads is ' + remaining + '.');
        resolve();
      })
      .on('error', reject);
  });
}
