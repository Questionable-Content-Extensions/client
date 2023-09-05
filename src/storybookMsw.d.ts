import { SetupWorker, rest } from 'msw'

declare global {
    var msw: { worker: SetupWorker; rest: typeof rest }
    var mswStart: Promise<unknown>
}
