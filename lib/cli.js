#!/usr/bin/env node

var Promise = require('bluebird');
var trelloBackup = require('.');

Promise
  .resolve(trelloBackup(process.argv[2]))
  .then(function () {
    console.log('Done.');
  })
  .catch(function (err) {
    console.log('Failed:', err.stack);
    process.exit(1);
  });
