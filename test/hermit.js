'use strict';
/*jshint asi: true */

var test = require('tape')
  , hermit = require('..')

function inspect(obj, depth) {
  return require('util').inspect(obj, false, depth || 5, true);
}

+function integration() {
  var html = [
      '<h2>outside</h2>'
    , '<ul>'  
    , ' <li>' 
    , '   <p>- One Level List</p>'  
    , '     <ul>'  
    , '       <li>' 
    , '         <p>- Two Levels List</p>' 
    , '       </li>'  
    , '     </ul>'  
    , ' </li>'  
    , '</ul>'
    ].join('\n')

  , stylesheet = {
      h1 : 'bgYellow  blue'
    , h2 : 'bgGreen red'
    , h3 : 'underline blue'
    , h4 : 'underline'
    , h5 : 'underline brightBlack'
    , code: 'bgWhite black'
    , parent : {
        li: 'brightBlack'
      }
    }
  , expected = 
        '\u001b[31m\u001b[42m\n\noutside\u001b[49m\u001b[39m\n'
      + '##\u001b[90m- One Level List\u001b[39m\n\n'
      + '####\u001b[90m- Two Levels List\u001b[39m\n\n';

  test( 'given stylesheet\n' + inspect(stylesheet) 
      + '\nconverting\n' + html 
      + '\n\nreturns:\n' + expected
    , function (t) {
        hermit(html, { listIndent: '##', stylesheet: stylesheet }, function (err, res) {
          t.equals(res, expected, 'parses, lays out, styles and renders correctly')
          t.end()
        })
      })
}();

test('exports', function (t) {
  t.equals(hermit.parse.toString(), require('../lib/parse').toString(), 'exports parse')  
  t.equals(hermit.layout.toString(), require('../lib/layout').toString(), 'exports layout')  
  t.equals(hermit.style.toString(), require('../lib/style').toString(), 'exports style')  
  t.equals(hermit.render.toString(), require('../lib/render').toString(), 'exports render')  
  t.end()
})
