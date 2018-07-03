var Promise = require('bluebird');
var assert = require('assert');
var sinon = require('sinon');
var _ = require('lodash');

var trelloBackup = require('./lib');
var fs = require('./lib/fs');
var trello = require('./lib/trello');

var stub = function(obj, meth, fn) {
  return sinon.stub(obj, meth).callsFake(fn);
};

var tests = [
  function boardNameWithASlash() {
    stub(fs, 'readJSONFile', _.constant({ backupDirectory: 'backups' }));
    stub(trello, 'getBoards', _.constant(Promise.resolve({ boardId: 'board/name' })));
    stub(trello, 'downloadBoard', _.noop);
    stub(trello, 'downloadAttachments', _.noop);
    stub(console, 'log', _.noop);
    function restore() {
      fs.readJSONFile.restore();
      trello.getBoards.restore();
      trello.downloadBoard.restore();
      trello.downloadAttachments.restore();
      console.log.restore();
    }

    return trelloBackup('config')
      .then(function () {
        assert.equal(
          trello.downloadBoard.getCall(0).args[0].filename,
          'backups/boards/boardId - board_name.json'
        );
      })
      .finally(restore);
  }
];

Promise
  .each(tests, function (test) {
    console.log(test.name);
    return test();
  })
  .then(function () {
    console.log('Success');
  })
  .catch(function (err) {
    console.log(err.stack);
  });
