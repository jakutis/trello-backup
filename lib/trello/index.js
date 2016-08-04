var querystring = require('querystring');
var download = require('./download');

exports.getBoards = require('./getBoards');
exports.downloadAttachments = require('./downloadAttachments');
exports.downloadBoard = function (parameters) {
  var qs = querystring.stringify(parameters.queryParameters);
  return download({
    url: 'https://api.trello.com/1/boards/' + parameters.id + '?' + qs,
    filename: parameters.filename
  });
};
