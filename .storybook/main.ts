import type { StorybookConfig } from '@storybook/core-common'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'

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
    framework: '@storybook/react',
    core: {
        builder: '@storybook/builder-webpack5',
    },
    webpackFinal: async (config, { configType: _configType }) => {
        if (!config.resolve) {
            config.resolve = {}
        }
        if (!config.resolve.plugins) {
            config.resolve.plugins = []
        }
        config.resolve.plugins.push(new TsconfigPathsPlugin())

        return config
    },
}

export default config
