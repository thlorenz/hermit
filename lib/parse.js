'use strict';

var sax = require('sax')
  , ignoreTags = {}
  , layoutTags = {};

[ 'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr', 'script', 'style', 'src' ]
  .forEach(function (k) { ignoreTags[k] = true; });

[ 'li' ]
  .forEach(function (k) { layoutTags[k] = true; });


var parse = module.exports = function parse(s, opts, cb) {
  if (!cb) {
    cb = opts;
    opts = {};
  }
  if (!opts.hasOwnProperty('html')) opts.html = true;

  var parser = sax.parser(opts.html, { trim: false })
    , tagStack = []
    , errors = []
    , currentItem
    , result = [];

  function updateCurrentItem (tag, change) {
    var parents = tagStack.slice(-15)
      .filter(function (x) {
        return x.name;
      })
      .map(function (x) {
        return x.name;
      });
    // don't include current tag in parents
    parents.pop();

    currentItem = {
        text    :  ''
      , parents :  parents
      , tag     :  tag.name
      , open    :  change.open || false
      , close   :  change.close || false
    };

    result.push(currentItem);
  }

  parser.onerror = function (err) {
    errors.push(err);

    parser.error = null;
    parser.resume();
  };

  parser.onopentag = function (tag) {
    tagStack.push(tag);
    updateCurrentItem(tag, { open: true });
  };

  parser.onclosetag = function (closedTag) {
    tagStack.pop();

    var tag = tagStack[tagStack.length - 1] || { name: 'root' };
    updateCurrentItem(tag, { close: true });
  };

  parser.ontext = function (text) {
    // fix for text being discarded if it is a li tag
    // text is trimmed to get rid of "useless" line breaks and spaces
    if(currentItem && currentItem.tag === 'li' && text.trim()) {
      currentItem.text += text
    }
    if (text.length && currentItem && !layoutTags[currentItem.tag]) currentItem.text += text;
  };

  function sieve(x) {
    if (layoutTags[x.tag]) return true;
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
