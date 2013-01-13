var parse = require('./lib/parse')
  , layout = require('./lib/layout')
  , style = require('./lib/style')
  , render = require('./lib/render');

var hermit = module.exports = function hermit(html, cb) {
  parse(html, { html: true }, function (err, res) {
    var layedout = layout(res)
      , styled = style(layedout)
      , rendered = render(styled); 

    // conform to (err, res) signature even though no errors are propagated at this point
    cb(null, rendered);
  });
};

// Expose helper libraries
module.exports.parse  =  parse;
module.exports.layout =  layout;
module.exports.style  =  style;
module.exports.render =  render;
