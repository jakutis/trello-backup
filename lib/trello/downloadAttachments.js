var fs = require('../fs');
var download = require('./download');
var Promise = require('bluebird');
var _ = require('lodash');
var crypto = require('crypto');

module.exports = function downloadAttachments(json, directory) {
  var urlToExtension = {};
  return Promise
    .resolve()
    .then(function () {
      console.log('Number of cards: ' + json.cards.length);
      return json.cards;
    })
    .map(function (card) {
      return card.attachments;
    })
    .then(_.flatten)
    .tap(function (attachments) {
      console.log('Number of attachments: ' + attachments.length);
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
      return fs.exists(opts.filename).then(function (exists) {
        return !exists;
      });
    })
    .tap(function (optss) {
      console.log('Number of attachments to download: ' + optss.length);
    })
    .map(download);
};
