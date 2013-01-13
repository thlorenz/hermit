# hermit [![build status](https://secure.travis-ci.org/thlorenz/hermit.png)](http://next.travis-ci.org/thlorenz/hermit)

Prints html in the terminal using colors and simple layout to reflect the document structure.

## Installation

    npm install hermit

## Usage

### As Library

```js
var hermit = require('hermit');
  , html = '<div><h3>Hello from Hermit</h3><p>A little paragraph for you</p></div>';

hermit(html, function (err, res) {
  console.log(res); 
});
```

**Output:**

```
Hello from Hermit           (in green)
-----------------
A little paragraph for you
```

#### Custom Options 

In order to affect the way that the printed html is layed out and styled, you can pass in custom properties.

These include a stylesheet with the properties outined in the [default hermit
stylesheet](https://github.com/thlorenz/hermit/blob/master/lib/stylesheet.js).

```js
var hermit = require('hermit');
  , html = '<div><h3>Hello from Hermit</h3><p>A little paragraph for you</p></div>';
  , myStylesheet = require('./path/to/my/stylesheet.js');

hermit(html, { listIndent: '    ', stylesheet: myStylesheet }, function (err, res) {
  console.log(res); 
});
```

For more information a detailed example read this [hermit test](https://github.com/thlorenz/hermit/blob/master/test/hermit.js#L11-L51)
