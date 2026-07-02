import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    plugins: [react()],
    resolve: {
        tsconfigPaths: true,
    },
    test: {
        projects: [
            {
                extends: true,
                test: {
                    name: 'unit',
                    globals: true,
                    environment: 'jsdom',
                    setupFiles: ['./src/setupTests.ts'],
                },
            },
            {
                extends: true,
                plugins: [
                    storybookTest({
                        configDir: path.join(dirname, '.storybook'),
                    }),
                ],
                test: {
                    name: 'storybook',
                    browser: {
                        enabled: true,
                        provider: playwright({}),
                        headless: true,
                        instances: [{ browser: 'chromium' }],
                    },
                    // Stories share one preview page, one MSW Service Worker,
                    // and the singleton Redux `store` (see src/store/store.ts),
                    // which our decorators and per-story `resetApiState()`
                    // calls assume only one story is "active" at a time.
                    // Running test files concurrently lets a request or
                    // dispatch from one story land after a later story has
                    // already swapped that shared state out from under it.
                    fileParallelism: false,
                    maxConcurrency: 1,
                },
            },
        ],
    },
})
