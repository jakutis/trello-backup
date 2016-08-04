# trello-backup [![Build Status](https://travis-ci.org/jakutis/trello-backup.svg?branch=master)](https://travis-ci.org/jakutis/trello-backup)

Backup your data from Trello

- [Installation](#installation)
- [CLI](#cli)

## Installation

    npm install -g trello-backup

## CLI

    trello-backup ./path/to/config.json

An example `config.json`:

    {
      "key": "get it from https://trello.com/app-key",
      "token": "go to https://developers.trello.com/sandbox, open your browser's web developer console, click Execute in sandbox UI, take token from the request url in the network tab",
      "backupDirectory": "/home/user/backup/trello",
      "boards": {
        "89ABCDEF": "board-name"
      }
    }

If the `boards` property is not defined, then all the boards are backed up.
