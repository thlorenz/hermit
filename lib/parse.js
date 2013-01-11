'use strict';

var sax = require('sax')
  , ignoreTags = {};
  [ 'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr', 'script', 'style', 'src' ]
    .forEach(function (k) {
      ignoreTags[k] = true;  
    });
  
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
    var parents = tagStack.slice(-15)
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

  function sieve(x) {
    if (ignoreTags[x.tag]) return false;
    return x.tag === 'p' || x.tag === 'span' 
      ? x.text.length
      : x.text.trim().length;
  }
  parser.onend = function () {
    result = result.filter(sieve);
    cb(errors.length ? errors : null, result);
  };

  parser.write(s).close();
};
