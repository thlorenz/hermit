'use strict';

var sax = require('sax');

var parse = module.exports = function parse(s, opts, cb) {
  if (!cb) {
    cb = opts;
    opts = {};
  }
  if (!opts.hasOwnProperty('html')) opts.html = true;

  s = s.replace(/([^\\])\n/g, '$1');
 
  var parser = sax.parser(opts.html, { trim: false })
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

    currentItem = { text: '', parents: parents, tag: tag.name };
    result.push(currentItem);
  }

  parser.onerror = function (err) {
    errors.push(err);

    parser.error = null;
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
    if (text.length && currentItem) currentItem.text += text;
  };

  function nonWhiteSpaceOrTextTag(x) {
    return x.tag === 'p' || x.tag === 'span' 
      ? x.text.length
      : x.text.trim().length;
  }
  parser.onend = function () {
    result = result.filter(nonWhiteSpaceOrTextTag);
    cb(errors.length ? errors : null, result);
  };

  parser.write(s).close();
};
