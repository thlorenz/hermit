'use strict';
var colors = require('ansicolors')
  , styles = require('ansistyles');

var defaulStyleSheet = {
    h1 : 'bgYellow  blue'
  , h2 : 'bgGreen blue'
  , h3 : 'underline blue'
  , h4 : 'underline'
  , h5 : 'underline brightBlack'
  , code: 'bgWhite black'
  , parent : {
      li: 'brightBlack'
    }
};

var style = module.exports = function style(nodes, opts) {
  opts = opts || {};
  var styleSheet = opts.styleSheet || defaulStyleSheet;

  function applyStyle(s, tag, parentTag) {
    var stylers = styleSheet[tag] || styleSheet.parent[parentTag];
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

var parse = require('./parse');
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
});
