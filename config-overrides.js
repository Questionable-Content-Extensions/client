const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = function override(config, env) {
    // prevent chunking for all files
    Object.assign(config.optimization, {
        runtimeChunk: false,
        splitChunks: {
            cacheGroups: {
                default: false,
            },
        },
    })

    // prevent hashes for the JS files
    Object.assign(config.output, { filename: 'static/js/[name].js' })

    // prevent hashes for the CSS files
    // search for the "MiniCssExtractPlugin" so we can remove the hashing in the filename
    for (const plugin of config.plugins) {
        if (!plugin || !plugin.constructor) {
            // do nothing if the plugin is null
            continue
        }
        if (plugin.constructor.name === 'MiniCssExtractPlugin') {
            Object.assign(plugin.options, {
                filename: 'static/css/[name].css',
            })
            delete plugin.options.chunkFilename
        }
    }

    // Inline the source map during development for nice stack traces and
    // correct logging filename:line values
    config.devtool =
        env.toLowerCase() === 'development' ? 'inline-source-map' : false

    // minimize only the .min.js files and .min.cs files in development
    // mode
    for (const plugin of config.optimization.minimizer) {
        if (!plugin || !plugin.constructor) {
            // do nothing if the plugin is null
            continue
        }
        if (
            plugin.constructor.name === 'TerserPlugin' &&
            env.toLowerCase() === 'development'
        ) {
            Object.assign(plugin.options, { include: /\.min\.js$/ })
        }
        if (
            plugin.constructor.name === 'OptimizeCssAssetsWebpackPlugin' &&
            env.toLowerCase() === 'development'
        ) {
            Object.assign(plugin.options, { assetNameRegExp: /\.min\.css$/ })
        }
    }

    // Disable hot module reloading because Greasemonkey cannot handle it
    // In Chromium-based browsers, the whole page will refresh on changes.
    // In Firefox, nothing seems to happen.
    config.plugins = config.plugins.filter(
        (x) => !x || x.constructor.name !== 'HotModuleReplacementPlugin'
    )

    // Remove the CSS extract plugin in development because we want CSS
    // injected directly in the greasemonkey script.
    // In production, we have to use it to avoid a gnarly webpack bug.
    // See ./src/global.d.ts and ./build.js for more details.
    if (env.toLowerCase() === 'development') {
        config.plugins = config.plugins.filter(
            (x) => !x || x.constructor.name !== 'MiniCssExtractPlugin'
        )
    }
    ;(config.module.rules.find((x) => !!x.oneOf).oneOf || []).forEach((x) => {
        if (
            x.test &&
            x.test.constructor === RegExp &&
            'test.css'.match(x.test)
        ) {
            try {
                x.use = x.use.filter((y) => !y.loader.includes('css-extract'))
                x.use.unshift(require.resolve('style-loader'))
            } catch (e) {
                // If we fail to replace a `css-extract` move on silently
                // This will happen if, for example, it has already been replaced
            }
        }

        // Same justification as above.
        if (env.toLowerCase() === 'development') {
            if (x.use) {
                x.use = x.use.filter(
                    (y) =>
                        !y.loader ||
                        !y.loader.includes('mini-css-extract-plugin')
                )
            }
        }
    })
    config.module.rules = [
        ...config.module.rules,
        {
            test: /\.md$/i,
            type: 'asset/source',
        },
    ]

    // Make a globalThis shim to prevent webpack code from erroring when run in dev mode
    config.output.globalObject = `(function() {
        if (typeof globalThis === 'object') return globalThis;
        Object.defineProperty(Object.prototype, '__magic__', {
            get: function() {
                return this;
            },
            configurable: true
        });
        __magic__.globalThis = __magic__; // lolwat
        delete Object.prototype.__magic__;
        return globalThis
    }())`

    // Don't bundle React and friends; we're loading them from a CDN
    config.externals = {
        ...config.externals,
        react: 'React',
        'react-dom': 'ReactDOM',
        'react-redux': 'ReactRedux',
        'redux-logger': 'reduxLogger',
        '@reduxjs/toolkit': 'RTK',
    }

    config.resolve = {
        ...config.resolve,
        plugins: [...config.resolve.plugins, new TsconfigPathsPlugin()],
    }

    // In windows, native file watching does not seem to work when using
    // Docker. Uncomment the below to enable polling-based file watching
    // instead.
    // config.watchOptions = {
    //     ...config.watchOptions,
    //     poll: true,
    //     ignored: /node_modules/,
    // }

    return config
}
