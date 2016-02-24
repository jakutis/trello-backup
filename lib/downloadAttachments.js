var exists = require('./exists');
var download = require('./download');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var _ = require('lodash');
var readJSONFile = require('./readJSONFile');
var debug = require('debug')('downloadAttachments');
var crypto = require('crypto');

module.exports = function downloadAttachments(boardFilename, directory) {
  var urlToExtension = {};
  return Promise
    .resolve(readJSONFile(boardFilename))
    .then(function (json) {
      debug('Number of cards: ' + json.cards.length);
      return json.cards;
    })
    .map(function (card) {
      return card.attachments;
    })
    .then(_.flatten)
    .tap(function (attachments) {
      debug('Number of attachments: ' + attachments.length);
    })
    .map(function (attachment) {
      var url = attachment.url;
      urlToExtension[url] = attachment.name.substr(attachment.name.lastIndexOf('.'));
      return url;
    })
    .then(_.unique)
    .map(function (url) {
      var hash = crypto.createHash('sha256');
      hash.update(new Buffer(url));
      return {
        url: url,
        filename: directory + '/' + hash.digest('hex') + urlToExtension[url]
      };
    })
    .filter(function (opts) {
      return exists(opts.filename).then(function (exists) {
        return !exists;
      });
    })
    .tap(function (optss) {
      debug('Number of attachments to download: ' + optss.length);
    })
    .map(download);
};
