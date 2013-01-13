'use strict';
var colors = require('ansicolors')
  , styles = require('ansistyles');

var style = module.exports = function style(nodes, opts) {
  opts = opts || {};
  var stylesheet = opts.stylesheet || require('./stylesheet');

  function applyStyle(s, tag, parentTag) {
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
