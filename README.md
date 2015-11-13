## Gendr

A lightweight module to determine the gender of a person using various strategies and sources

### Usage

See sample.js

```
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
 * - 5 default strategies, 2 using local data, 3 crawling the web
 */
var Gendr = GendrFactory.create([
  Strategies.OWN_DATA.with(ownData),//Uses own data, keys have to be lowercase to work properly
  Strategies.CENSUS.US,             //Uses the US census data by forwarding the request to the gender-guess module (npmjs.com/package/gender-guess)
  Strategies.CENSUS.WORLD,          //Uses world-wide census data provided by astro.joerg@googlemail.com, see /data/README.txt
  Strategies.WEB.BABYNAMEGUESSER,   //Crawls http://www.gpeters.com/names/baby-names.php?name=..'
  Strategies.WEB.BEHINDTHENAME,     //Crawls 'http://www.behindthename.com/name/:name
  Strategies.WEB.GENDERIZE_IO,      //Calls the API of genderize.io, ATTENTION: this api is restricted to 1000 calls per day
  customStrategy                    //Some custom strategy, i.e. to have a fallback at the very end of the strategies
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
```

This leads to the following output:

```
jarjarbinks has gender: {"source":"ownData","gender":"M"}
Terese has gender: {"source":"us-census-1930-2013","gender":"F"}
Torbjørn has gender: {"source":"data/world-census-data.json","gender":"M"}
Andjela has gender: {"source":"babynameguesser","gender":"M"}
Cristoffer has gender: {"source":"genderize.io","gender":"M"}
notexisting has gender: {"source":"fallback: ladies first","gender":"F"}
cookieMonster has gender: {"source":"fallback: ladies first","gender":"F"}
```
