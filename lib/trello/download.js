var Promise = require('bluebird');
var got = require('got');
var fs = require('../fs');

var remaining = 0;
module.exports = function download(opts) {
  remaining += 1;
  console.log('Starting download of ' + opts.url + ' to ' + opts.filename + '.');
  console.log('Number of remaining downloads is ' + remaining + '.');
  return new Promise(function (resolve, reject) {
    got
      .stream(opts.url)
      .pipe(fs.createWriteStream(opts.filename))
      .on('close', function () {
        remaining -= 1;
        console.log('Successfully finished downloading ' + opts.url + '.');
        console.log('Number of remaining downloads is ' + remaining + '.');
        resolve();
      })
      .on('error', reject);
  });
}
