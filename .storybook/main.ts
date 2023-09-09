import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'

import type { StorybookConfig } from '@storybook/react-webpack5'

const config: StorybookConfig = {
    stories: [
        '../src/**/*.stories.mdx',
        '../src/**/*.stories.@(js|jsx|ts|tsx)',
    ],

    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        '@storybook/preset-create-react-app',
    ],

    framework: {
        name: '@storybook/react-webpack5',
        options: {},
    },

    core: {},

    webpackFinal: async (config, { configType: _configType }) => {
        if (!config.resolve) {
            config.resolve = {}
        }
        if (!config.resolve.plugins) {
            config.resolve.plugins = []
        }
        config.resolve.plugins.push(new TsconfigPathsPlugin())

        config.devtool = 'inline-source-map'

        return config
    },
}

export default config

// TODO: After upgrading to Storybook 7.5, interaction tests have broken.
// Figure out why and fix it.
