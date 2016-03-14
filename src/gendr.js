'use strict';

const async = require('async');

class Gendr {
  constructor(strategies) {
    this.strategies = strategies;
  }

  guess(name, cb) {
    if (!name) {
      return cb(new Error('Invalid format for name'));
    }
    const formattedName = name.replace('-', ' ').split(' ')[0].toLowerCase();

    // We abuse the async argument order here to create a flow where the series stops as soon as a result is found, which per default happens only in the err-case
    async.applyEachSeries(this.strategies, formattedName, function(gender, error) {
      cb(error, gender);
    });
  }
}

module.exports = Gendr;
