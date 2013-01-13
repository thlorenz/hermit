var parse = require('./lib/parse')
  , layout = require('./lib/layout')
  , style = require('./lib/style')
  , render = require('./lib/render');

var hermit = module.exports = function hermit(html, cb) {
  parse(html, { html: true }, function (err, res) {
    var layedout = layout(res)
      , styled = style(layedout)
      , rendered = render(styled); 

    cb(null, rendered);
  });
};

var fsopenHtml = 
  "<html>" +
  "<p>Asynchronous file open. See open(2). <code>flags</code> can be:\n\n</p>" + 
  "<ul>" + 
    "<li><p><code>'r'</code> - Open file for reading.\nAn exception occurs if the file does not exist.</p>\n</li>" +
    "<li><p><code>'r+'</code> - Open file for reading and writing.\nAn exception occurs if the file does not exist.</p>\n</li>\n" + 
  "</ul>" +
  "</html>"

var html = require('fs')
  .readFileSync(require.resolve('./test/fixtures/nodedoc-repl-entire-page.html'), 'utf-8');

hermit(html, function (err, res) {
  console.log(res);
});

