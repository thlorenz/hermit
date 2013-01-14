#!/usr/bin/env node
var hermit = require('..')
  , fs = require('fs')
  , args = process.argv
  ;

function usage() {
  var msg = [ 
      'Usage: hermit <filename.html>'
    , ''
    , 'Unix Pipe Example: https://github.com/thlorenz/hermit/blob/master/README.md | hermit'
    , ''
  ].join('\n');
  console.log(msg);
}

function hermitFile() {
  var html = fs.readFileSync(args[2], 'utf-8');
  hermit(html, function (err, res) {
    console.log(res);  
  });
}

// e.g. 'hermit index.html'
if (args.length === 3) return hermitFile();

