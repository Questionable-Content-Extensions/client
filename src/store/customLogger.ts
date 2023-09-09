import { createLogger } from 'redux-logger'

const consoleProxy = {
    get(target: any, prop: any, _receiver: any) {
        if (prop in target) {
            return target[prop]
        }
        if (prop in console) {
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
