import { SetupWorker, rest } from 'msw'

declare global {
    // Used to access MSW in Storybook
    // DO NOT ATTEMPT TO USE OUTSIDE Storybook
    var msw: { worker: SetupWorker; rest: typeof rest }
    var mswStart: Promise<unknown>

    var __QC_EXT_DEVELOPMENT_LOADED: boolean | undefined

    // Set by the injected runtime code that vite-plugin-css-injected-by-js
    // prepends to the build output (see its runtime/build.js) to queue and
    // dedupe <style> injection across possibly multiple evaluations of the
    // bundle. Reset by the development trampoline before eval'ing a freshly
    // fetched copy of the bundle, so the current copy's stale, never-run
    // registration doesn't also fire.
    var __VITE_CSS_QUEUE__: ((opts: unknown) => void)[] | undefined
    var __VITE_CSS_EXECUTED__: ((opts: unknown) => void)[] | undefined
}
