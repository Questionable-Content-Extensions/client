import { readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mergeConfig } from 'vite'

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

    viteFinal: (config) =>
        mergeConfig(config, {
            resolve: {
                tsconfigPaths: true,
            },
            // The root vite.config.mts doesn't set `publicDir`, so it falls
            // back to Vite's default of `public`. Storybook picks up that
            // same config and, on build, copies the whole publicDir into its
            // output dir *in addition to* `staticDirs` above — which used to
            // overwrite Storybook's own generated `index.html` with
            // `public/index.html` (a dev-only placeholder page). Disable it
            // here since `staticDirs` already covers what Storybook needs
            // from `public/`.
            publicDir: false,
        }),
}

export default config
