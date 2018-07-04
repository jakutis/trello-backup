var Promise = require('bluebird');
var fs = require('./fs');
var backup = require('./commands/backup');
var cardsInList = require('./commands/cards-in-list');

module.exports = function (configFilename, args) {
  args = args === undefined ? [] : args;

  return Promise
    .resolve(fs.readJSONFile(configFilename))
    .catch(function (err) {
      console.log('Could not read configuration file from ' + configFilename);
      throw err;
    })
    .then(function (config) {
      var command;
      if (args.length === 0) {
        command = backup;
      } else {
        if (args[0] === 'cards-in-list') {
          command = cardsInList;
        } else {
          throw new Error('Unknown command "' + args[0] + '"');
        }
        args = args.slice(1);
      }
      return command(config, args);
    });
};
