'use strict';
var colors = require('ansicolors')
  , styles = require('ansistyles');

var defaulStyleSheet = {
    h1 : 'bgYellow  blue'
  , h2 : 'bgGreen blue'
  , h3 : 'underline blue'
  , h4 : 'underline'
  , h5 : 'underline'
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
    '<html>'
  , '  <h1>H1 Hello World</h1>'
  , '  <h2>H2 Hello World</h2>'
  , '  <h3>H3 Hello World</h3>'
  , '  <h4>H4 Hello World</h4>'
  , '  <h5>H5 Hello World</h5>'
  , '</html>'
].join('\n');

function inspect(obj, depth) {
  console.log(require('util').inspect(obj, false, depth || 5, true));
}

var parsed = parse(html, function (err, res) {
  console.log(render(style(res)));
  inspect(render(style(res)));
});

var expected = 
    '\u001b[34m\u001b[43m\u001b[34m\u001b[43mH1 Hello World\u001b[49m\u001b[39m\u001b[49m\u001b[39m'
  + '\u001b[34m\u001b[42m\u001b[34m\u001b[42mH2 Hello World\u001b[49m\u001b[39m\u001b[49m\u001b[39m'
  + '\u001b[34m\u001b[4m\u001b[34m\u001b[4mH3 Hello World\u001b[24m\u001b[39m\u001b[24m\u001b[39m'
  + '\u001b[4m\u001b[4mH4 Hello World\u001b[24m\u001b[24m'
  + '\u001b[4m\u001b[4mH5 Hello World\u001b[24m\u001b[24m';
