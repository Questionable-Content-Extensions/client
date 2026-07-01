import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import storybook from "eslint-plugin-storybook";
import globals from "globals";

export default defineConfig([
    globalIgnores(["dist/**/*", "build/**/*", "storybook-static/**/*", "!**/.storybook"]),
    js.configs.recommended,
    tseslint.configs.recommended,
    react.configs.flat.recommended,
    react.configs.flat["jsx-runtime"],
    reactHooks.configs["recommended-latest"],
    jsxA11y.flatConfigs.recommended,
    importPlugin.flatConfigs.recommended,
    importPlugin.flatConfigs.typescript,
    ...storybook.configs["flat/recommended"],
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },

        settings: {
            react: {
                version: "18.2.0",
            },

            "import/resolver": {
                typescript: true,
            },
        },

        rules: {
            "no-unused-vars": "off",
        },
    },
    {
        files: ["**/*.ts?(x)"],

        rules: {
            "no-undef": "off",
            "@typescript-eslint/no-unused-vars": ["warn", {
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_",
            }],
        },
    },
    {
        files: ["**/*.stories.*"],

        rules: {
            "import/no-anonymous-default-export": "off",
        },
    },
]);
