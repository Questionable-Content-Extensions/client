import Settings from '../settings'
import { debug } from '../utils'

let currentSettings: Settings | null = null
function initialize(settings: Settings) {
    currentSettings = settings
}

function get(): Settings | null {
    return currentSettings
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
    initialize,
    get,
    notifySubscribers,
    subscribeChanged,
    unsubscribeChanged,
}
export default settingsService
