'use strict';

const cheerio = require('cheerio');
const superagent = require('superagent');

const worldCensusFile = 'data/world-census-data.json';
const censusData = require('../' + worldCensusFile);
const gg = require('gender-guess');

const Strategies = {
  OWN_DATA: {
    with: function(data) {
      return function(name, cb) {
        if (!data || !data[name]) {
          return cb(null, new Error('Nothing Found'));
        }

        cb({
          source: 'ownData',
          gender: data[name]
        });
      };
    }
  },
  CENSUS: {
    US: function(name, cb) {
      const guessed = gg.guess(name);

      if (!guessed || !guessed.gender) {
        return cb(null, new Error('Nothing Found'));
      }

      cb({
        source: 'us-census-1930-2013',
        gender: guessed.gender
      });
    },
    WORLD: function(name, cb) {
      if (!censusData || !censusData[name]) {
        return cb(null, new Error('Nothing Found'));
      }

      cb({
        source: worldCensusFile,
        gender: censusData[name]
      });
    }
  },
  WEB: {
    GENDERIZE_IO: function(name, cb) {
      const url = 'https://api.genderize.io';

      superagent
        .get(url)
        .query({
          name: name
        })
        .end(function(err, res) {
          if (err) {
            return cb(null, err);
          }

          const body = res.body;
          if (!body.gender) {
            return cb(null, new Error('Nothing determined'));
          }

          const gender = body.gender === 'male' ? 'M' : 'F';

          cb({
            source: 'genderize.io',
            gender: gender
          });
        });
    },
    BEHINDTHENAME: function(name, cb) {
      const url = 'http://www.behindthename.com/name/' + name;

      superagent
        .get(url)
        .end(function(err, res) {
          if (err) {
            return cb(null, err);
          }

          const $ = cheerio.load(res.text);
          const masculin = $('.masc').html();
          const feminine = $('.fem').html();

          let gender = feminine ? 'F' : null;
          if (masculin) {
            gender = gender ? 'MF' : 'M';
          }

          if (!gender) {
            return cb(null, new Error('Nothing Found'));
          }

          cb({
            source: 'behindthename.com',
            gender: gender
          });
        });
    },
    BABYNAMEGUESSER: function(name, cb) {
      const url = 'http://www.gpeters.com/names/baby-names.php';

      superagent
        .get(url)
        .query({
          name: name
        })
        .end(function(err, res) {
          if (err) {
            return cb(null, err);
          }

          const rawHTML = res.text;
          const regexResults = /It's a (.*)!/g.exec(rawHTML);

          if (!regexResults) {
            return cb(null, new Error('Nothing Found'));
          }

          const gender = regexResults[1] === 'boy' ? 'M' : 'F';

          cb({
            source: 'babynameguesser',
            gender: gender
          });
        });
    }
  }
};

module.exports = Strategies;
