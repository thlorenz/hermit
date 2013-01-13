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

