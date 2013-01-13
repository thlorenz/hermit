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
    t.equal(fst.text, 'hello world\n', 'with text hello world (new line preserved)')
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

function check_li_p(t, res, expectedParentsOf_p) {
  var fst = res[0]
    , snd = res[1]
    , trd = res[2]
  
  t.equal(res.length, 3, 'returns three')    
  t.equal(fst.tag, 'li', 'first li')
  t.ok(fst.open, 'open')
  t.equal(fst.text, '', 'without text')

  t.equal(snd.tag, 'p', 'second tagged as p') 
  t.equal(snd.text, 'hello world', 'with text hello world')
  t.deepEqual(snd.parents, expectedParentsOf_p, 'with parents [ ' + expectedParentsOf_p + ' ]')

  t.equal(trd.tag, 'li', 'third li')
  t.notok(trd.open, 'not open')
  t.equal(trd.text, '', 'without text')

  t.end()
}
test('\n# parse <li><p>hello world</p></li>', function (t) {
  parse('<li><p>hello world</p></li>', function (err, res) {
    check_li_p(t, res, [ 'li' ])
  });  
})

test('\n# parse <li>   <p>hello world</p></li>', function (t) {
  parse('<li>   <p>hello world</p></li>', function (err, res) {
    check_li_p(t, res, [ 'li' ])
  });  
})

test('\n# parse <ul><li><p>hello world</p></li></ul>', function (t) {
  parse('<ul><li><p>hello world</p></li></ul>', function (err, res) {
    check_li_p(t, res, [ 'ul', 'li' ])
  });  
})

test('\n# parse <li>   <p>hello world</p><span>   </span></li>', function (t) {
  parse('<li>   <p>hello world</p><span>   </span></li>', function (err, res) {
    var fst = res[0]
      , snd = res[1]
      , trd = res[2]
      , fou = res[3]
      , fif = res[4]
    
    t.equal(res.length, 5, 'returns five')    

    t.equal(fst.tag, 'li', 'first li')
    t.ok(fst.open, 'open')
    t.equal(fst.text, '', 'without text')

    t.equal(snd.tag, 'p', 'second tagged as p') 
    t.equal(snd.text, 'hello world', 'with text hello world (spaces trimmed)')
    t.deepEqual(snd.parents, [ 'li' ], 'with parents [ li ]')

    t.equal(trd.tag, 'li', 'third li')
    t.notok(trd.open, 'not open')
    t.equal(trd.text, '', 'without text')

    t.equal(fou.tag, 'span', 'fourth tagged as span') 
    t.equal(fou.text, '   ', 'with text "   " (spaces)')
    t.deepEqual(fou.parents, [ 'li' ], 'with parents [ li ]')

    t.equal(fif.tag, 'li', 'third li')
    t.notok(fif.open, 'not open')
    t.equal(fif.text, '', 'without text')

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
      { text: 'Asynchronous file open. See open(2). ',
        parents: [ 'html' ],
        tag: 'p',
        open: true },
      { text: 'flags',
        parents: [ 'html', 'p' ],
        tag: 'code',
        open: true },
      { text: ' can be:\n\n',
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
      { text: ' - Open file for reading.\nAn exception occurs if the file does not exist.',
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
      { text: ' - Open file for reading and writing.\nAn exception occurs if the file does not exist.',
        parents: [ 'html', 'ul', 'li' ],
        tag: 'p',
        open: false },
      { text: '',
        parents: [ 'html', 'ul' ],
        tag: 'li',
        open: false } ]

  test('\n# parse\n' + s + '\nreturns\n' + inspect(expected), function (t) {
    parse(s, function (err, res) {
      t.notok(err, 'returns no errors') 
      t.deepEquals(res, expected, 'returns array of tags including expected text and parents')
      t.end() 
    })
  })
}()
