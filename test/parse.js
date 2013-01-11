'use strict';
/*jshint asi: true */

var test = require('tape')
  , parse = require('../lib/parse')

test('\n# parse empty string', function (t) {
  parse('', function (err, res) {
    t.equal(res.length, 0, 'returns empty')    
    t.end()
  });  
})

test('\n# parse untagged line', function (t) {
  parse('hello world', function (err, res) {
    t.equal(res.length, 0, 'returns empty')    
    t.end()
  });  
})

test('\n# parse <p>hello world\\n</p>', function (t) {
  parse('<p>hello world\n</p>', function (err, res) {
    var fst = res[0];
    t.equal(res.length, 1, 'returns one')    
    t.equal(fst.tag, 'p', 'tagged as p') 
    t.equal(fst.text, 'hello world', 'with text hello world (new line stripped)')
    t.equal(fst.parents.length, 0, 'with no parent')
    t.end()
  });  
})

test('\n# parse <img src="hello">some text to trick you  </img><p>hello world</p>', function (t) {
  parse('<img src="hello">some text to trick you </img><p>hello world</p>', function (err, res) {
    var fst = res[0];
    t.equal(fst.tag, 'p', 'first tag is p (ignores image tag)') 
    t.end()
  })
})

test('\n# parse <p>hello world\\\\n</p>', function (t) {
  parse('<p>hello world\\n</p>', function (err, res) {
    var fst = res[0];
    t.equal(res.length, 1, 'returns one')    
    t.equal(fst.tag, 'p', 'tagged as p') 
    t.equal(fst.text, 'hello world\\n', 'with text hello world\\n (escaped new line included)')
    t.equal(fst.parents.length, 0, 'with no parent')
    t.end()
  });  
})

test('\n# parse <li><p>hello world</p></li>', function (t) {
  parse('<li><p>hello world</p></li>', function (err, res) {
    var fst = res[0];
    t.equal(res.length, 1, 'returns one')    
    t.equal(fst.tag, 'p', 'tagged as p') 
    t.equal(fst.text, 'hello world', 'with text hello world')
    t.deepEqual(fst.parents, [ 'li' ], 'with parents [ li ]')
    t.end()
  });  
})

test('\n# parse <li>   <p>hello world</p></li>', function (t) {
  parse('<li>   <p>hello world</p></li>', function (err, res) {
    var fst = res[0];
    t.equal(res.length, 1, 'returns one')    
    t.equal(fst.tag, 'p', 'tagged as p') 
    t.equal(fst.text, 'hello world', 'with text hello world (spaces trimmed)')
    t.deepEqual(fst.parents, [ 'li' ], 'with parents [ li ]')
    t.end()
  });  
})

test('\n# parse <li>   <p>hello world</p><span>   </span></li>', function (t) {
  parse('<li><p>hello world</p><span>   </span></li>', function (err, res) {
    var fst = res[0];
    var snd = res[1];
    t.equal(res.length, 2, 'returns two')    

    t.equal(fst.tag, 'p', 'first tagged as p') 
    t.equal(fst.text, 'hello world', 'with text hello world (spaces trimmed)')
    t.deepEqual(fst.parents, [ 'li' ], 'with parents [ li ]')

    t.equal(snd.tag, 'span', 'second tagged as span') 
    t.equal(snd.text, '   ', 'with text "   " (spaces)')
    t.deepEqual(snd.parents, [ 'li' ], 'with parents [ li ]')

    t.end()
  });  
})

test('\n# parse <ul><li><p>hello world</p></li></ul>', function (t) {
  parse('<ul><li><p>hello world</p></li></ul>', function (err, res) {
    var fst = res[0];
    t.equal(res.length, 1, 'returns one')    
    t.equal(fst.tag, 'p', 'tagged as p') 
    t.equal(fst.text, 'hello world', 'with text hello world')
    t.deepEqual(fst.parents, [ 'ul', 'li' ], 'with parents [ ul, li ]')
    t.end()
  });  
})

+function () {
  function inspect(obj, depth) {
    return require('util').inspect(obj, false, depth || 5, true);
  }

  var s = 
    "<html>" +
    "<p>Asynchronous file open. See open(2). <code>flags</code> can be:\n\n</p>" + 
    "<ul>" + 
      "<li><p><code>'r'</code> - Open file for reading.\nAn exception occurs if the file does not exist.</p>\n</li>" +
      "<li><p><code>'r+'</code> - Open file for reading and writing.\nAn exception occurs if the file does not exist.</p>\n</li>\n" + 
    "</ul>" +
    "</html>"
    , expected = [ 
      { text: 'Asynchronous file open. See open(2). ', parents: [ 'html' ], tag: 'p' },
      { text: 'flags', parents: [ 'html', 'p' ], tag: 'code' },
      { text: ' can be:', parents: [ 'html' ], tag: 'p' },
      { text: '\'r\'', parents: [ 'html', 'ul', 'li', 'p' ], tag: 'code' },
      { text: ' - Open file for reading.An exception occurs if the file does not exist.', parents: [ 'html', 'ul', 'li' ], tag: 'p' },
      { text: '\'r+\'', parents: [ 'html', 'ul', 'li', 'p' ], tag: 'code' },
      { text: ' - Open file for reading and writing.An exception occurs if the file does not exist.',
        parents: [ 'html', 'ul', 'li' ],
        tag: 'p' } ]
  test('\n# parse\n' + s + '\nreturns\n' + inspect(expected), function (t) {
    parse(s, function (err, res) {
      t.notOk(err, 'returns no errors') 
      t.deepEquals(res, expected, 'returns array of tags including expected text and parents')
      t.end() 
    })
  })
}()
