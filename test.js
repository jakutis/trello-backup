var Promise = require('bluebird');
var assert = require('assert');
var sinon = require('sinon');
var _ = require('lodash');

var trelloBackup = require('./lib');
var fs = require('./lib/fs');
var trello = require('./lib/trello');

var tests = [
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
