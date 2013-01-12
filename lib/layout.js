'use strict';
var blocks = {}
  , inlineDirectChildren = {};

[ 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'dl', 'dt', 'dd', 'ol', 'ul', 'li','address', 'blockquote', 'center', 'del', 'div', 'hr', 'pre' ]
  .forEach(function (k) { blocks[k] = true;  });

[ 'li' ]
  .forEach(function (k) { inlineDirectChildren[k] = true;  });

var layout = module.exports = function layout(nodes, opts) {
  opts = opts || {};
  opts.listIndent = opts.listIndent || '  ';

  function processNode(node) {
    var parent = node.parents.length ? node.parents[node.parents.length - 1] : 'html'
      , prefix = '';
    
    // prefix block elements with new line
    if (node.open && blocks[node.tag] && !inlineDirectChildren[parent]) 
      prefix += '\n';
    
    // give list items indent
    if (node.open && node.tag === 'li') { 
      // add list indent for current list item and any list item it is nested in (parents)
      node.text = 
          opts.listIndent
        + node.parents
            .filter(function (x) { return x === 'li'; })
            .reduce(function (acc, x) { return acc + opts.listIndent; }, '');
    }
    
    node.text = prefix + node.text;
    return node;
  }

  return nodes.map(processNode);
};

var expected = [ 
        { text: 'Asynchronous file open. See open(2). ',
          parents: [ 'html' ],
          tag: 'p',
          open: true },
        { text: 'flags',
          parents: [ 'html', 'p' ],
          tag: 'code',
          open: true },
        { text: ' can be:',
          parents: [ 'html' ],
          tag: 'p',
          open: false },
        { text: '',
          parents: [ 'html', 'ul' ],
          tag: 'li',
          open: true },
        { text: '\'r\'',
          parents: 
          [ 'html',
            'ul',
            'li',
            'p' ],
          tag: 'code',
          open: true },
        { text: ' - Open file for reading.An exception occurs if the file does not exist.',
          parents: [ 'html', 'ul', 'li' ],
          tag: 'p',
          open: false },
        { text: '',
          parents: [ 'html', 'ul' ],
          tag: 'li',
          open: false },
        { text: '',
          parents: [ 'html', 'ul' ],
          tag: 'li',
          open: true },
        { text: '\'r+\'',
          parents: 
          [ 'html',
            'ul',
            'li',
            'p' ],
          tag: 'code',
          open: true },
        { text: ' - Open file for reading and writing.An exception occurs if the file does not exist.',
          parents: [ 'html', 'ul', 'li' ],
          tag: 'p',
          open: false },
        { text: '',
          parents: [ 'html', 'ul' ],
          tag: 'li',
          open: false } ];

console.log(
  require('./render')( layout(expected) )
);
