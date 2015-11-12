'use strict';

var async = require('async');

var Gendr = function(strategies) {
  this.strategies = strategies;
};

Gendr.prototype.guess = function(name, cb) {
  if (!name) {
    return cb(new Error('Invalid format for name'));
  }
  name = name.replace('-', ' ');
  name = name.split(' ')[0];
  name = name.toLowerCase();

  //We abuse the async argument order here to create a flow where the series stops as soon as a result is found, which per default happens only in the err-case
  async.applyEachSeries(this.strategies, name, function(gender, error) {
    cb(error, gender);
  });
};

module.exports = Gendr;
