import { readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { InlineConfig, mergeConfig } from 'vite'

import type { StorybookConfig } from '@storybook/react-vite'

const publicDir = join(dirname(fileURLToPath(import.meta.url)), '../public')

// Mirror `public/` into the Storybook build, minus `index.html` — that file
// is a dev-only placeholder page (served by `vite preview`), and copying it
// here would overwrite Storybook's own generated `index.html` in the build
// output. Reading the directory (rather than hardcoding names) keeps this in
// sync automatically as files are added to/removed from `public/`.
const staticDirs = readdirSync(publicDir)
    .filter((name) => name !== 'index.html')
    .map((name) => ({ from: join(publicDir, name), to: name }))

const config: StorybookConfig = {
    stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],

    addons: [
        '@storybook/addon-links',
        'msw-storybook-addon',
        '@storybook/addon-vitest',
    ],

    framework: {
        name: '@storybook/react-vite',
        options: {},
    },

    staticDirs,

    viteFinal: (config) => {
        // Plugin entries can themselves be arrays (e.g. `@vitejs/plugin-react`
        // and `vite-plugin-css-injected-by-js` each return one), so a
        // shallow filter over `config.plugins` wouldn't see the plugins
        // nested inside those - recurse into them instead.
        const excludeCssInjectedByJs = (
            plugins: typeof config.plugins
        ): typeof config.plugins =>
            plugins
                ?.map((plugin) =>
                    Array.isArray(plugin)
                        ? excludeCssInjectedByJs(plugin)
                        : plugin
                )
                .filter(
                    (plugin) =>
                        !(
                            plugin &&
                            !Array.isArray(plugin) &&
                            !(plugin instanceof Promise) &&
                            plugin.name?.startsWith(
                                'vite-plugin-css-injected-by-js'
                            )
                        )
                )

        return mergeConfig(
            {
                ...config,
                // The root vite.config.mts adds this plugin so the userscript
                // build (a single injected <script>, which can't link a
                // separate stylesheet) ships its CSS inline. Storybook is a
                // normal web page and inherits this plugin only because it
                // merges on top of that same root config. Unlike Vite's own
                // CSS handling, this plugin concatenates collected CSS
                // without hoisting `@import`/`@charset` to the top - which
                // silently breaks any `@import` that isn't first in the
                // combined output (a CSS spec requirement), so it must be
                // excluded here.
                plugins: excludeCssInjectedByJs(config.plugins),
            } satisfies InlineConfig,
            {
                resolve: {
                    tsconfigPaths: true,
                },
                // The root vite.config.mts doesn't set `publicDir`, so it
                // falls back to Vite's default of `public`. Storybook picks
                // up that same config and, on build, copies the whole
                // publicDir into its output dir *in addition to* `staticDirs`
                // above — which used to overwrite Storybook's own generated
                // `index.html` with `public/index.html` (a dev-only
                // placeholder page). Disable it here since `staticDirs`
                // already covers what Storybook needs from `public/`.
                publicDir: false,
                plugins: [
                    // Rolldown (the Rust bundler this project's Vite uses for
                    // production builds) mis-bundles `msw/lib/core/index.mjs`:
                    // that file imports `checkGlobals` from a sibling module
                    // and calls it at the top level purely for a side effect
                    // (a runtime assertion that `URL` exists). Across
                    // Storybook's per-story chunk graph, Rolldown ends up
                    // emitting the call in one chunk while dropping the
                    // module that defines it, throwing `checkGlobals is not
                    // defined` at runtime for every story that touches MSW
                    // (dev mode isn't affected — native ESM per file, no
                    // bundling). Inlining the one-line check directly into
                    // this file removes the cross-module reference that
                    // Rolldown mishandles.
                    {
                        name: 'fix-msw-checkglobals-bundling',
                        transform(code: string, id: string) {
                            if (!id.endsWith('msw/lib/core/index.mjs')) {
                                return null
                            }
                            return code
                                .replace(
                                    "import { checkGlobals } from './utils/internal/checkGlobals.mjs';\n",
                                    ''
                                )
                                .replace(
                                    'checkGlobals();',
                                    "if (typeof URL === 'undefined') { throw new Error('[MSW] Global \"URL\" class is not defined.'); }"
                                )
                        },
                    },
                ],
            } satisfies InlineConfig
        )
    },
}

export default config
