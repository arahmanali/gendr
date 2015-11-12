'use strict';

var GendrFactory = require('./index');
var Strategies = GendrFactory.Strategies;

//Own Data is case sensitive -> cookieMonster will not work since lookup is done using name.toLowerCase()
var ownData = {
  cookieMonster: 'F',
  jarjarbinks: 'M'
};

var customStrategy = function(name, cb) {
  cb({
    source: 'fallback: ladies first',
    gender: 'F'
  })
};

/**
 * - An array of different strategies to obtain the gender for a certain first name
 * - Each Strategies has the interface function(name, cb(err, gender)), with gender being an object like {source: 'thesource', gender: 'any string, typicall M or F'}
 * - Sorted by priority, executed consecutively (async.series), first successful match is returned
 * - 5 defaul strategies with
 */
var Gendr = GendrFactory.create([
  //Uses own data, keys have to be lowercase to work properly
  Strategies.OWN_DATA.with(ownData),
  //Uses the US census data by forwarding the request to the gender-guess module (npmjs.com/package/gender-guess)
  Strategies.CENSUS.US,
  //Uses world-wide census data provided by astro.joerg@googlemail.com, see /data/README.txt
  Strategies.CENSUS.WORLD,
  //Crawls http://www.gpeters.com/names/baby-names.php?name=..'
  Strategies.WEB.BABYNAMEGUESSER,
  //Crawls 'http://www.behindthename.com/name/:name
  Strategies.WEB.BEHINDTHENAME,
  //Calls the API of genderize.io, ATTENTION: this api is restricted to 1000 calls per day
  Strategies.WEB.GENDERIZE_IO,
  //Some custom strategy, i.e. to have a fallback at the very end of the strategies
  customStrategy
]);

var sampleNames = [
  'cookieMonster',
  'jarjarbinks',
  'Terese',
  'Torbjørn',
  'Andjela',
  'Cristoffer',
  'notexisting'
];

sampleNames.forEach(function(name) {
  Gendr.guess(name, function(err, gender) {
    console.log('%s has gender: %j', name, gender);
  });
});