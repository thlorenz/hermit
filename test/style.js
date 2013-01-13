'use strict';
/*jshint asi: true */

var parse  =  require('../lib/parse')
  , layout =  require('../lib/layout')
  , render =  require('../lib/render')
  , style  =  require('../lib/style')
  , test   =  require('tape')

var styleSheet = {
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

function check(html, expected) {
  test('when parsing\n' + html + '\nand styling it, it renders as\n' + expected, function (t) {
    parse(html, function (err, res) {
      var styled = render(style(res, { styleSheet: styleSheet }))
      console.log(styled)
      t.equals(styled, expected, 'correctly styled and rendered')
      t.end()
    })
  })
}

test('headings', function (t) {
  
  var html = [
      '<html>'
    , '  <h1>H1 Hello World</h1>'
    , '  <h2>H2 Hello World</h2>'
    , '  <h3>H3 Hello World</h3>'
    , '  <h4>H4 Hello World</h4>'
    , '  <h5>H5 Hello World</h5>'
    , '</html>'
  ].join('\n')
  , expected = 
      '\u001b[34m\u001b[43mH1 Hello World\u001b[49m\u001b[39m'
    + '\u001b[34m\u001b[42mH2 Hello World\u001b[49m\u001b[39m'
    + '\u001b[34m\u001b[4mH3 Hello World\u001b[24m\u001b[39m'
    + '\u001b[4mH4 Hello World\u001b[24m'
    + '\u001b[90m\u001b[4mH5 Hello World\u001b[24m\u001b[39m'

  check(html, expected)
  t.end()
})

test('code inside <p>', function (t) {
  var html = '<p>Here is some code: <code>var a = 3;</code></p>'
    , expected = 'Here is some code: \u001b[30m\u001b[47mvar a = 3;\u001b[49m\u001b[39m'
  check(html, expected)
  t.end()
});

test('code inside <li><p>', function (t) {
  var html = '<li><p>Here is some code: <code>var a = 3;</code> that you should read</p></li>'
    , expected = 
        '\u001b[90mHere is some code: \u001b[39m'
      + '\u001b[30m\u001b[47mvar a = 3;\u001b[49m\u001b[39m'
      + '\u001b[90m that you should read\u001b[39m'
  check(html, expected)
  t.end()
});
