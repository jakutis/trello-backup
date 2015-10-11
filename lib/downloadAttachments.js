var exists = require('./exists');
var download = require('./download');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var _ = require('lodash');
var readJSONFile = require('./readJSONFile');
var debug = require('debug')('downloadAttachments');

module.exports = function downloadAttachments(boardFilename, directory) {
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
      return attachment.url;
    })
    .then(_.unique)
    .map(function (url) {
      var i = url.lastIndexOf('.');
      return {
        url: url,
        filename: directory + '/' + (new Buffer(url).toString('base64')) + url.substr(i)
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
