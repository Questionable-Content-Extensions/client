import { SetupWorker, rest } from 'msw'

declare global {
    // Used to access MSW in Storybook
    // DO NOT ATTEMPT TO USE OUTSIDE Storybook
    var msw: { worker: SetupWorker; rest: typeof rest }
    var mswStart: Promise<unknown>
    // Hack used to work around an annoying webpack bug involving CSS modules
    // in production. Long story short: We allow `MiniCssExtractPlugin` to pull
    // the CSS out and then we just stuff it right back into the JS and load it
    // ourselves.
    var qcExtBuiltCss: string | undefined
}
