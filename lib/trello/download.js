var Promise = require('bluebird');
var got = require('got');
var fs = require('../fs');
var constants = require('../constants');

function get(opts) {
  return new Promise(function (resolve, reject) {
    got
      .stream(opts.url)
      .on('error', function (err, body, response) {
        if (response.statusCode === constants.httpTooManyRequests) {
          Promise.delay(constants.rateLimitDelay)
            .then(function () {
              return get(opts);
            })
            .then(resolve, reject);
        } else {
          reject(err);
        }
      })
      .pipe(fs.createWriteStream(opts.filename))
      .on('close', function () {
        resolve();
      })
      .on('error', reject);
  });
}

var remaining = 0;
module.exports = function download(opts) {
  remaining += 1;
  console.log('Starting download of ' + opts.url + ' to ' + opts.filename + '.');
  console.log('Number of remaining downloads is ' + remaining + '.');
  return get(opts).then(function () {
    remaining -= 1;
    console.log('Successfully finished downloading ' + opts.url + '.');
    console.log('Number of remaining downloads is ' + remaining + '.');
  });
}
