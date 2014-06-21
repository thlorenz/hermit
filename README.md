# hermit [![build status](https://secure.travis-ci.org/thlorenz/hermit.png)](http://next.travis-ci.org/thlorenz/hermit)

Prints html in the terminal using colors and simple layout to reflect the document structure.

## Objective

Provide a simple tool to render html in the terminal in a readable format. It is not supposed to replace your browser.
The main indended use is to render html snippets,  e.g., the ones contained in the descriptions of the [json version of
the nodejs documentation](http://nodejs.org/api/assert.json).

If you want a terminal browser, try [lynx](http://lynx.browser.org/) instead.

## Installation

    npm install hermit

## Usage

### From the Command Line

To use hermit from the command line, you should install it globally:

    npm -g install hermit

#### Rendering a File

    hermit filename.html

#### Piping an Html String

You can pipe the output of any program that produces an html string into hermit.

**Example:**

    curl http://nodejs.org/api/assert.html | hermit

### From Your Code 

```js
var hermit = require('hermit')
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

hermit(html, { listIndent: '    ', listStyle: '* ', stylesheet: myStylesheet }, function (err, res) {
  console.log(res); 
});
```

For more information a detailed example read this [hermit test](https://github.com/thlorenz/hermit/blob/master/test/hermit.js#L11-L51)
