'use strict';
var colors = require('ansicolors')
  , styles = require('ansistyles')
  , cardinal = require('cardinal')
  , potentialHighlights = [ 'code' ]
  , highlight = {};

potentialHighlights.forEach(function (k) {
  highlight[k] = true;  
});

var style = module.exports = function style(nodes, opts) {
  opts = opts || {};
  var stylesheet = opts.stylesheet || require('./stylesheet');

  function tryHighlight(s) {
    try {
      return cardinal.highlight(s, { linenos: false });
    } catch (e) {
      return null;
    }
  }

  function applyStyle(s, tag, parentTag) {
    var highlighted;

    if (highlight[tag]) {
      highlighted = tryHighlight(s);
      if (highlighted) return highlighted;
    }

    var stylers = stylesheet[tag] || stylesheet.parent[parentTag];
    if (!stylers) return s;

    stylers
      .split(' ')
      .forEach(function (styler) {
        var fn = colors[styler] || styles[styler];
        fn && (s = fn(s));
      });
    return s;
  }

  function processNode(node) {
    var parent = node.parents.length ? node.parents[node.parents.length - 1] : 'html';
      
    node.text = applyStyle(node.text, node.tag, parent); 
    return node;
  }

  return nodes.map(processNode);
};

/*var parse = require('./parse');
var render = require('./render');
var layout = require('./layout');

var html = [
].join('\n');

function inspect(obj, depth) {
  console.log(require('util').inspect(obj, false, depth || 5, true));
}

var parsed = parse(html, function (err, res) {
  console.log(render(style(res)));
  inspect(render(style(res)));
});*/
