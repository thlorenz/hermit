var fs = require('fs')
  , path = require('path');

fs.readdirSync(__dirname)
  .filter(function (x) { return path.extname(x) === '.js'; })
  .forEach(function (x) { require('./' + x); });
