var Promise = require('bluebird');
var downloadAttachments = require('./downloadAttachments');
var download = require('./download');
var readJSONFile = require('./readJSONFile');
var querystring = require('querystring');
var mkdirp = Promise.promisify(require('mkdirp'));
var getBoards = require('./getBoards');
var _ = require('lodash');

var queryParameters = {
  actions: 'all',
  actions_entities: 'true',
  actions_display: 'true',
  actions_format: 'list',
  actions_limit: '1000',
  action_fields: 'all',
  action_member: 'true',
  action_member_fields: 'all',
  action_memberCreator: 'true',
  action_memberCreator_fields: 'all',
  cards: 'all',
  card_fields: 'all',
  card_attachments: 'true',
  card_attachment_fields: 'all',
  card_checklists: 'all',
  card_stickers: 'true',
  boardStars: 'mine',
  labels: 'all',
  label_fields: 'all',
  labels_limit: '1000',
  lists: 'all',
  list_fields: 'all',
  memberships: 'all',
  memberships_member: 'true',
  memberships_member_fields: 'all',
  members: 'all',
  member_fields: 'all',
  membersInvited: 'all',
  membersInvited_fields: 'all',
  checklists: 'all',
  checklist_fields: 'all',
  organization: 'true',
  organization_fields: 'all',
  organization_memberships: 'all',
  myPrefs: 'true',
  fields: 'all'
};

module.exports = function (configFilename) {
  var config;
  return Promise
    .resolve(readJSONFile(configFilename))
    .catch(function (err) {
      console.log('Could not read configuration file from ' + configFilename);
      throw err;
    })
    .then(function (_config) {
      config = _config;
      if (config.boards === undefined) {
        return getBoards(_.pick(config, 'key', 'token')).then(function (boards) {
          config.boards = boards;
        });
      }
    })
    .then(function () {
      return Object.keys(config.boards).map(function (id) {
        var name = config.boards[id];
        return {
          id: id,
          name: name,
          json: config.backupDirectory + '/boards/' + id + ' - ' + name + '.json'
        };
      });
    })
    .map(function (board) {
      var qs = querystring.stringify(Object.assign({
        key: config.key,
        token: config.token
      }, queryParameters));
      return Promise
        .resolve(mkdirp(config.backupDirectory + '/boards'))
        .then(function () {
          return download({
            url: 'https://api.trello.com/1/boards/' + board.id + '?' + qs,
            filename: board.json
          });
        }).then(function () {
          return mkdirp(config.backupDirectory + '/attachments');
        }).then(function () {
          return downloadAttachments(board.json, config.backupDirectory + '/attachments')
        }).then(function () {
          console.log('Downloaded ' + board.name + '.');
        });
    });
};
