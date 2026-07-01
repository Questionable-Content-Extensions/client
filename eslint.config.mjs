import importPlugin from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import storybook from 'eslint-plugin-storybook'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

import js from '@eslint/js'

export default defineConfig([
    globalIgnores([
        'dist/**/*',
        'build/**/*',
        'storybook-static/**/*',
        '.storybook/**/*',
        '**/*.stories.tsx',
        'public/mockServiceWorker.js',
    ]),
    js.configs.recommended,
    react.configs.flat.recommended,
    react.configs.flat['jsx-runtime'],
    reactHooks.configs['recommended-latest'],
    jsxA11y.flatConfigs.recommended,
    importPlugin.flatConfigs.recommended,
    ...storybook.configs['flat/recommended'],
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },

        settings: {
            react: {
                version: '18.2.0',
            },

            'import/resolver': {
                typescript: true,
            },
        },

        rules: {
            'no-unused-vars': 'off',
            'react/no-unescaped-entities': 'off',
        },
    },
    {
        files: ['**/*.ts?(x)'],
        extends: [
            tseslint.configs.recommended,
            importPlugin.flatConfigs.typescript,
        ],

        rules: {
            'no-undef': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],

            // tsc already validates these; the plugin has to parse every
            // imported module (including inside node_modules) to check them,
            // which is slow and chokes on some .d.ts files.
            'import/namespace': 'off',
            'import/default': 'off',
        },
    },
    {
        files: ['**/*.stories.*'],

        rules: {
            'import/no-anonymous-default-export': 'off',
        },
    },
])
