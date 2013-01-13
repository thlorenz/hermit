'use strict';
var blocks = {}
  , inlineDirectChildren = {};

[ 'p',  'dl', 'dt', 'dd', 'ol', 'ul', 'li', 'address', 'blockquote', 'center', 'del', 'div', 'hr', 'pre' ]
  .forEach(function (k) { blocks[k] = { prefix: '\n', suffix: '\n' }; });

[ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
  .forEach(function (k) { blocks[k] = { prefix: '\n\n', suffix: '\n\n' };  });

[ 'li' ]
  .forEach(function (k) { inlineDirectChildren[k] = true;  });

var layout = module.exports = function layout(nodes, opts) {
  opts = opts || {};
  opts.listIndent = opts.listIndent || '  ';

  function processNode(node) {
    var parent = node.parents.length ? node.parents[node.parents.length - 1] : 'html'
      , block = blocks[node.tag]
      , prefix = ''
      , suffix = ''
      ; 
    
    // prefix opened block elements with new line and add one after they close
    if (block && !inlineDirectChildren[parent]) {
      if (node.open) prefix += block.prefix;
      if (node.close) suffix += block.suffix;
    }
    
    // give list items indent
    if (node.open && node.tag === 'li') { 
      // add list indent for current list item and any list item it is nested in (parents)
      node.text = 
          opts.listIndent
        + node.parents
            .filter(function (x) { return x === 'li'; })
            .reduce(function (acc, x) { return acc + opts.listIndent; }, '');
    }
    
    node.text = prefix + node.text + suffix;
    return node;
  }

  return nodes.map(processNode);
};
