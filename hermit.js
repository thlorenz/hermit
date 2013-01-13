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

var html = require('fs')
  .readFileSync(require.resolve('./test/fixtures/nodedoc-repl-entire-page.html'), 'utf-8');

hermit(html, function (err, res) {
  console.log(res);
});

