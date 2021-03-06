var nodeResolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');
var globals = require('rollup-plugin-node-globals');
var builtins = require('rollup-plugin-node-builtins');
var json = require('rollup-plugin-json');


// https://github.com/rollup/rollup/wiki/JavaScript-API

var rollupConfig = {
    /**
     * entry: The bundle's starting point. This file will
     * be included, along with the minimum necessary code
     * from its dependencies
     */
    entry: 'src/app/main.dev.ts',

    /**
     * sourceMap: If true, a separate sourcemap file will
     * be created.
     */
    sourceMap: true,

    /**
     * format: The format of the generated bundle
     */
    format: 'iife',

    /**
     * dest: the output filename for the bundle in the buildDir
     */
    dest: 'main.js',

    /**
     * plugins: Array of plugin objects, or a single plugin object.
     * See https://github.com/rollup/rollup/wiki/Plugins for more info.
     */
    plugins: [
        builtins(),
        commonjs(
            {
                include: [
                    'node_modules/**'
                ],
                namedExports: {
                    // left-hand side can be an absolute path, a path
                    // relative to the current directory, or the name
                    // of a module in node_modules
                    'node_modules/leancloud-realtime/dist/realtime.browser.js': ['Realtime', 'Conversation', 'TextMessage', 'IMClient'],
                    'node_modules/leancloud-storage/dist/av.js':['AV'],
                    'node_modules/chart.js/dist/Chart.bundle.js':['Chart']
                }
            }
        ),
        nodeResolve({
            main: true,
            browser: true,
        }),
        globals(),
        json()
    ]

};


if (process.env.IONIC_ENV == 'prod') {
    // production mode
    rollupConfig.entry = '{{TMP}}/app/main.prod.ts';
    rollupConfig.sourceMap = false;
}


module.exports = rollupConfig;
