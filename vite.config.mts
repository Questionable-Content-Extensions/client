/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

// React, Redux & friends are loaded from a CDN as globals (see buildValues.js
// / the userscript's @require lines), so we don't want to bundle them.
const externalGlobals: Record<string, string> = {
    react: 'React',
    'react-dom': 'ReactDOM',
    // The CDN UMD build of react-dom already exposes createRoot/hydrateRoot on
    // the same global, so point the /client subpath at it too. Otherwise
    // Vite bundles node_modules/react-dom/client.js, whose own internal
    // `require('react-dom')` survives as a literal runtime `require()` call
    // that doesn't exist in the userscript sandbox.
    'react-dom/client': 'ReactDOM',
    'react-redux': 'ReactRedux',
    'redux-logger': 'reduxLogger',
    '@reduxjs/toolkit': 'RTK',
}

export default defineConfig(({ mode }) => {
    const isDevelopment = mode === 'development'

    return {
        resolve: {
            tsconfigPaths: true,
        },
        // Bundled deps (e.g. @reduxjs/toolkit's rtk-query engine) reference
        // `process.env.NODE_ENV` for dev-only warnings, assuming a bundler
        // statically replaces it. There's no `process` global in a userscript
        // sandbox, so replace it ourselves and let dead code elimination drop
        // the guarded branches, same as webpack's DefinePlugin used to.
        define: {
            'process.env.NODE_ENV': JSON.stringify(
                isDevelopment ? 'development' : 'production'
            ),
        },
        plugins: [
            react(),
            // Userscripts are a single injected <script>, so CSS has to travel
            // inside the JS rather than as a linked stylesheet.
            cssInjectedByJsPlugin(),
        ],
        build: {
            outDir: 'build',
            // In dev watch mode, `vite preview` reads from this directory
            // concurrently while it's being rebuilt on every file change. If
            // we empty it each time, the preview server's static file
            // handling loses track of files mid-request and starts 404ing
            // until it's restarted. Filenames here are fixed (no hashing),
            // so there's nothing stale to clean up between watch rebuilds
            // anyway — only the one-shot production build needs it.
            emptyOutDir: !isDevelopment,
            sourcemap: isDevelopment ? 'inline' : false,
            minify: isDevelopment ? false : 'esbuild',
            cssMinify: isDevelopment ? false : 'esbuild',
            lib: {
                entry: 'src/index.tsx',
                name: 'QcExt',
                formats: ['iife'],
                fileName: () => 'static/js/main.js',
            },
            rollupOptions: {
                external: Object.keys(externalGlobals),
                output: {
                    globals: externalGlobals,
                    // Some of our externalized deps (@reduxjs/toolkit's
                    // rtk-query submodule in particular) internally re-require
                    // themselves by bare specifier for circular access to their
                    // own exports. Rollup can't statically bind those nested
                    // CJS `require()` calls to the IIFE's external params, so
                    // it leaves a literal `require(...)` call in the output.
                    // There's no `require` in a userscript sandbox, so provide
                    // one that resolves the same externals by name.
                    intro: `if (typeof globalThis.require !== 'function') {
    globalThis.require = function (id) {
        switch (id) {
            case 'react': return globalThis.React
            case 'react-dom':
            case 'react-dom/client': return globalThis.ReactDOM
            case 'react-redux': return globalThis.ReactRedux
            case 'redux-logger': return globalThis.reduxLogger
            case '@reduxjs/toolkit': return globalThis.RTK
            default: throw new Error("Cannot find module '" + id + "'")
        }
    }
}`,
                },
            },
        },
        test: {
            environment: 'jsdom',
            globals: true,
        },
    }
})
