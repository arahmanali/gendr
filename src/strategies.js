'use strict';

var lodash = require('lodash');
var cheerio = require('cheerio');
var superagent = require('superagent');

var worldCensusFile = 'data/world-census-data.json';
var censusData = require('../' + worldCensusFile);
var gg = require('gender-guess');

var each = lodash.each;
var isString = lodash.isString;

var Strategies = {
  OWN_DATA: {
    with: function(data) {
      return function(name, cb) {
        if (!data || !data[name]) {
          return cb(null, new Error('Nothing Found'))
        }

        cb({
          source: 'ownData',
          gender: data[name]
        });
      }
    }
  },
  CENSUS: {
    US: function(name, cb) {
      var guessed = gg.guess(name);

      if (!guessed.gender) {
        return cb(null, new Error('Nothing Found'))
      }

      cb({
        source: 'us-census-1930-2013',
        gender: guessed.gender
      });
    },
    WORLD: function(name, cb) {
      if (!censusData || !censusData[name]) {
        return cb(null, new Error('Nothing Found'))
      }

      cb({
        source: worldCensusFile,
        gender: censusData[name]
      });
    }
  },
  WEB: {
    GENDERIZE_IO: function(name, cb) {
      var url = 'https://api.genderize.io';

      superagent
        .get(url)
        .query({
          name: name
        })
        .end(function(err, res) {
          if (err) {
            return cb(null, err);
          }

          var body = res.body;
          if (!body.gender) {
            return cb(null, new Error('Noth determined'))
          }

          var gender = body.gender === 'male' ? 'M' : 'F';

          cb({
            source: 'genderize.io',
            gender: gender
          });
        });
    },
    BEHINDTHENAME: function(name, cb) {
      var url = 'http://www.behindthename.com/name/' + name;

      superagent
        .get(url)
        .end(function(err, res) {
          if (err) {
            return cb(null, err);
          }

          var $ = cheerio.load(res.text);
          var masculin = $('.masc').html();
          var feminine = $('.fem').html();

          var gender = feminine ? 'F' : null;
          if (masculin) {
            gender = gender ? 'MF' : 'M';
          }

          if (!gender) {
            return cb(null, new Error('Nothing Found'))
          }

          cb({
            source: 'behindthename.com',
            gender: gender
          });
        });
    }
  }
};

module.exports = Strategies;
