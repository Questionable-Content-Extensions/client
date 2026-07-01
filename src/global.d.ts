import { SetupWorker, rest } from 'msw'

declare global {
    // Used to access MSW in Storybook
    // DO NOT ATTEMPT TO USE OUTSIDE Storybook
    var msw: { worker: SetupWorker; rest: typeof rest }
    var mswStart: Promise<unknown>

    var __QC_EXT_DEVELOPMENT_LOADED: boolean | undefined
}
