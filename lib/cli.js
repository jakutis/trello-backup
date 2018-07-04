#!/usr/bin/env node

var Promise = require('bluebird');
var trelloBackup = require(__dirname);
var configFilename = process.argv[2];

if (!configFilename) {
  console.log('Failed: first argument must be a path to the configuration file.');
  process.exit(1);
}

Promise
  .resolve(trelloBackup(configFilename, process.argv.slice(3)))
  .catch(function (err) {
    console.log('Failed:', err.stack);
    process.exit(1);
  });
