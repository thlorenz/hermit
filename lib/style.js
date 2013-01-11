'use strict';
var colors = require('ansicolors');

var style = module.exports = function style(nodes, opts) {
  opts = opts || {};
  opts.listStyle = opts.listStyle || colors.red('*');

  function processNode(node) {
    var parent = node.parents.length ? node.parents[node.parents.length - 1] : 'html'
      , prefix = '';
      
    // give list items style
    if (parent === 'li') { 
      prefix += opts.listStyle;
    }
    
    node.text = prefix + node.text;
    return node;
  }

  return nodes.map(processNode);
};
