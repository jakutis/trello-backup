var got = require('got');
var querystring = require('querystring');

module.exports = function (config) {
  return Promise.resolve()
    .then(function () {
      return got('https://api.trello.com/1/tokens/' + config.token + '?' + querystring.stringify({
        key: config.key
      }));
    })
    .then(function (res) {
      res = JSON.parse(res.body);
      return got('https://api.trello.com/1/members/' + res.idMember + '/boards?' + querystring.stringify({
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
