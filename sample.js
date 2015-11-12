var GendrFactory = require('./index');
var Strategies = require('./src/strategies');

var ownData = {
  alice: 'F',
  bob: 'M'
};

var Gendr = GendrFactory.create([
  Strategies.OWN_DATA.with(ownData),
  Strategies.CENSUS.US,
  Strategies.CENSUS.WORLD,
  Strategies.WEB.GENDERIZE_IO,
  Strategies.WEB.BEHINDTHENAME,
]);

var name = 'Alex';
Gendr.guess(name, function(err, gender) {
  console.log('%s has gender: %j', name, gender);
});

var name2 = 'Djavad';
Gendr.guess(name2, function(err, gender) {
  console.log('%s has gender: %j', name2, gender);
});

var name3 = 'Senta';
Gendr.guess(name3, function(err, gender) {
  console.log('%s has gender: %j', name3, gender);
});