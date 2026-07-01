import { createLogger } from 'redux-logger'

const consoleProxy = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(target: any, prop: any, _receiver: any) {
        if (prop in target) {
            return target[prop]
        }
        if (prop in console) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (console as any)[prop]
        }
        console.warn(`Property ${prop} does not exist on console`)
        return undefined
    },
}

const debug = console.debug.bind(console)
const logger = createLogger({
    diff: true,
    collapsed: true,
    logger: new Proxy(
        {
            log: debug,
        },
        consoleProxy
    ),
})
export default logger
