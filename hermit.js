var parse = require('./lib/parse')
  , layout = require('./lib/layout')
  , style = require('./lib/style')
  , render = require('./lib/render');

var hermit = module.exports = function hermit(html, opts, cb) {
  if (!cb) {
    cb = opts;
    opts = {};
  }

  parse(html, opts, function (err, res) {
    var layedout = layout(res, opts)
      , styled = style(layedout, opts)
      , rendered = render(styled); 

    // conform to (err, res) signature even though no errors are propagated at this point
    cb(null, rendered);
  });
};

// Expose helper libraries
hermit.parse  =  parse;
hermit.layout =  layout;
hermit.style  =  style;
hermit.render =  render;
