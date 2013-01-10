'use strict';

var sax = require('sax');

var parse = module.exports = function parse(s, opts, cb) {
  if (!cb) {
    cb = opts;
    opts = {};
  }
  if (!opts.hasOwnProperty('html')) opts.html = true;

  s = s.replace(/\n/g, '');
 
  var parser = sax.parser(opts.html)
    , tagStack = []
    , errors = []
    , currentItem
    , result = [];

  function updateCurrentItem (tag) {
    var parents = tagStack.slice(-5)
      .filter(function (x) {
        return x.name;
      })
      .map(function (x) {
        return x.name;
      });
    // don't include current tag in parents
    parents.pop();

    currentItem = { text: '', attrs: [], parents: parents, tag: tag.name };
    result.push(currentItem);
  }

  parser.onerror = function (err) {
    errors.push(err);
    parser.resume();
  };
  parser.onopentag = function (tag) {
    tagStack.push(tag);
    updateCurrentItem(tag);
  };
  parser.onclosetag = function (closedTag) {
    tagStack.pop();

    var tag = tagStack[tagStack.length - 1] || { name: 'root' };
    updateCurrentItem(tag);
  };
  parser.ontext = function (text) {
    if (text.length) currentItem.text += text;
  };
  parser.onattribute = function (attr) {
    currentItem.attrs.push(attr);
  };
  parser.onend = function () {
    result = result.filter(function (x) { return x.text.length; });
    cb(errors.length ? errors : null, result);
  };

  parser.write(s).close();
};

var fs = require('fs');
var s = require('./../test/fixtures/fs-open-doc');


parse(s, function (err, res) {
//  if (err) console.error(err);
  console.log(res);
});
