var got = require('got');
var querystring = require('querystring');
var Promise = require('bluebird');
var constants = require('../constants');

function get(url) {
  return got(url).catch(function (err) {
    if (err.statusCode === constants.httpTooManyRequests) {
      return Promise.delay(constants.rateLimitDelay)
        .then(function () {
          return get(url);
        });
    }
    throw new Error('HTTP response status code ' + err.statusCode + ' for GET ' + url);
  });
}

module.exports = function (config) {
  return Promise.resolve()
    .then(function () {
      return get('https://api.trello.com/1/tokens/' + config.token + '?' + querystring.stringify({
        key: config.key
      }));
    })
    .then(function (res) {
      res = JSON.parse(res.body);
      return get('https://api.trello.com/1/members/' + res.idMember + '/boards?' + querystring.stringify({
        key: config.key,
        token: config.token
      }));
    })
    .then(function (res) {
      res = JSON.parse(res.body);
      var boards = {};
      res.forEach(function (board) {
        boards[board.shortLink] = board.name;
      });
      return boards;
    });
};
