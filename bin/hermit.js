#!/usr/bin/env node
var hermit = require('..')
  , fs = require('fs')
  , args = process.argv
  ;

function usage() {
  var msg = [ 
      ''
    , 'Usage: hermit <filename.html>'
    , ''
    , 'Unix Pipe Example: curl http://nodejs.org/api/assert.html | hermit'
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
if (args.length === 3) {
  try {
    return hermitFile();
  } catch(e) {
    console.error(e);
    return usage();
  }
}

if (args.length > 3) return usage();


// Unix pipe
var stdin = process.stdin
  , stdout = process.stdout
  , data = '';

stdin.setEncoding('utf-8');
stdin.resume();
stdin
  .on('data', function (chunk) {
    data += chunk;
  })
  .on('end', function () {
    hermit(data, function (err, res) {
      console.log(res);  
    });
  });
