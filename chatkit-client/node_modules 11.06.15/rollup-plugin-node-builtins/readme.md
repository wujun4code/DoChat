rollup-plugin-node-builtins
===

```
npm install --save-dev rollup-plugin-node-builtins
```

Allows the node builtins to be `require`d/`import`ed. Doing so gives the proper shims to support modules that were designed for Browserify, some modules require [rollup-plugin-node-globals](https://github.com/calvinmetcalf/rollup-plugin-node-globals).

The following modules include ES6 specific version which allow you to do named imports in addition to the default import and should work fine if you only use this plugin.

- process*
- events
- stream*
- util
- path
- buffer*
- querystring
- url
- string_decoder*
- punycode
- http*†
- https*†
- os*
- assert*
- constants
- timers*
- console*‡
- vm*§
- zlib*
- tty
- domain

\* requires [node-globals plugin](https://github.com/calvinmetcalf/rollup-plugin-node-globals)

† the http and https modules are actually the same and don't differentiate based on protocol

‡ default export only, because it's console, seriously just use the global

§ vm does not have all corner cases and has less of them in a web worker

The following modules are not shimed and and we just provide the commonjs one from browserify  and you will likely need to use  [rollup-plugin-commonjs](https://github.com/rollup/rollup-plugin-commonjs), [rollup-plugin-node-resolve](https://github.com/rollup/rollup-plugin-node-resolve), and [rollup-plugin-json](https://github.com/rollup/rollup-plugin-json) in order for them to work, some like crypto, are complex enough that they don't work very well with rollup at all, others may work.

- crypto

Not all included modules rollup equally, streams (and by extension anything that requires it like http) are a mess of circular references that are pretty much impossible to tree-shake out, similarly url methods are actually a shortcut to a url object so those methods don't tree shake out very well, punycode, path, querystring, events, util, and process tree shake very well especially if you do named imports.

config for using this with something simple like events or querystring

```js
import builtins from 'rollup-plugin-node-builtins';
rollup({
  entry: 'main.js',
  plugins: [
    builtins()
  ]
})
```

and now if main contains this, it should just work

```js
import EventEmitter from 'events';
import {inherits} from 'util';

// etc
```

Config for something more complicated like http

```js
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
rollup({
  entry: 'main.js',
  plugins: [
    globals(),
    builtins()
  ]
})
```

If you need more compex things like a module not listed above then you need to do the following: `node_modules/rollup-plugin-node-globals/**`, `node_modules/buffer-es6/**`, , `node_modules/process-es6/**` and `node_modules/rollup-plugin-node-builtins/src/es6/**` to the `commonjs` `excludes` if you use that plugin and make sure you set `browser` to be true in `nodeResolve`.  Also it should come before `nodeResolve` and `globals` should come after `commonjs`. For example:


Config for using this with some of the non ported to es6 modules

```js
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';
import json from 'rollup-plugin-json';
rollup({
  entry: 'main.js',
  plugins: [
    builtins(),
    nodeResolve({ jsnext: true, main: true, browser: true }),
    commonjs({
      ignoreGlobal: true
    }),
    globals(),
    json()
  ]
})
```

License
===

MIT except ES6 ports of browserify modules which are whatever the original library was.
