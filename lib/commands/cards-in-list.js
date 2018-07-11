var fs = require('fs');
var util = require('util');
var path = require('path');
var readDir = function (path) {
  return new Promise(function (resolve, reject) {
    fs.readdir(path, function (err, items) {
      if (err) {
        reject(err);
      } else {
        resolve(items);
      }
    });
  });
};
var readFile = function (path) {
  return new Promise(function (resolve, reject) {
    fs.readFile(path, function (err, buffer) {
      if (err) {
        reject(err);
      } else {
        resolve(buffer);
      }
    });
  });
};

var readBoards = function (directory) {
  return readDir(directory)
    .then(boards => boards.map(board => path.join(directory, board)))
    .then(boards => Promise.all(boards.map(board => readFile(board).then(board => JSON.parse(board)))));
};

var getCards = function (board, listId) {
  return board.cards
    .filter(card => !card.closed && card.idList === listId)
    .sort((a, b) => a.pos - b.pos);
};

var formatCard = function ({card, i}) {
  var link = 'https://trello.com/c/' + card.shortLink;
  return (i + 1) + '. [' + card.name + '](' + link + ')';
};

module.exports = function (config, args) {
  var directory = path.join(config.backupDirectory, 'boards');
  var listName = args[0];

  console.log('# Cards in "' + listName + '" list in all boards');
  return readBoards(directory)
    .then(boards => boards
      .map(board => ({
        board,
        list: board.lists.filter(list => list.name === listName)[0]
      }))
      .filter(board => board.list !== undefined)
      .map(board => Object.assign(board, {
        cards: getCards(board.board, board.list.id)
      }))
      .filter(board => board.cards.length > 0)
      .forEach(board => {
        console.log();
        console.log('## ' + board.board.name);
        console.log();
        board.cards.forEach((card, i) => console.log(formatCard({card, i})));
      })
    );
};
