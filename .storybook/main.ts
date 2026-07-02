import { mergeConfig } from 'vite'

import type { StorybookConfig } from '@storybook/react-vite'

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

    staticDirs: ['../public'],

    viteFinal: (config) =>
        mergeConfig(config, {
            resolve: {
                tsconfigPaths: true,
            },
        }),
}

export default config
