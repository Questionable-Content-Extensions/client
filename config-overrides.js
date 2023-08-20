const path = require('path')
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
    // We'll instead refresh the whole page when the script changes.
    config.plugins = config.plugins.filter(
        (x) => !x || x.constructor.name !== 'HotModuleReplacementPlugin'
    )

    // Even in production mode, we want the CSS inlined instead of put in a different file
    // Remove the CSS extract plugin because we want CSS injected directly in
    // the greasemonkey script
    config.plugins = config.plugins.filter(
        (x) => !x || x.constructor.name !== 'MiniCssExtractPlugin'
    )
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
        if (x.use) {
            x.use = x.use.filter(
                (y) =>
                    !y.loader || !y.loader.includes('mini-css-extract-plugin')
            )
        }
    })

    // Make a global
    // This shim to prevent webpack code from erroring when run in dev mode
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

    // Don't bundle React; we're loading it from a CDN
    config.externals = {
        ...config.externals,
        react: 'React',
        'react-dom': 'ReactDOM',
    }

    config.resolve = {
        ...config.resolve,
        plugins: [...config.resolve.plugins, new TsconfigPathsPlugin()],
    }

    return config
}
