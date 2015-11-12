'use strict';

var superagent = require('superagent');
var async = require('async');

var Gendr = function(strategies) {
  this.strategies = strategies;
};

Gendr.prototype.guess = function(name, cb) {
  name = name.toLowerCase();
  //We abuse the async argument order here to create a flow where the series stops as soon as a result is found, which per default happens only in the err-case
  async.applyEachSeries(this.strategies, name, function(gender, error) {
    cb(error, gender)
  })
};

module.exports = Gendr;
