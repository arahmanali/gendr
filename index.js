'use strict';

var Gendr = require('./src/gendr');

module.exports.create = function(strategies) {
  return new Gendr(strategies);
};
