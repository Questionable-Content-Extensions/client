import Settings from '~/settings'
import { debug } from '~/utils'

function get(): Settings {
    return Settings.get()
}

let settingsServiceSubscribers: (() => void)[] = []

function subscribeChanged(handler: () => void) {
    settingsServiceSubscribers.push(handler)
}

function unsubscribeChanged(handler: () => void) {
    settingsServiceSubscribers = settingsServiceSubscribers.filter(
        (s) => handler !== s
    )
}

function notifySubscribers() {
    debug('settingsService notifying subscribers about new settings')
    for (const settingsSubscriber of settingsServiceSubscribers) {
        settingsSubscriber()
    }
}

const settingsService = {
    get,
    notifySubscribers,
    subscribeChanged,
    unsubscribeChanged,
}
export default settingsService
