declare let cloneInto: <T>(
    obj: T, // object
    targetScope: object, // object
    options?: {
        cloneFunctions?: boolean
        wrapReflectors?: boolean
    }
) => T
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
declare let exportFunction: <F extends Function>(
    func: F,
    targetScope: object,
    options?: {
        defineAs?: string
        allowCallbacks?: boolean
        allowCrossOriginArguments?: boolean
    }
) => F
declare let createObjectIn: <T>(
    obj: object,
    options?: { defineAs?: string }
) => T

// https://www.openjs.com/scripts/events/keyboard_shortcuts/
interface ShortcutOptions {
    type: 'keydown' | 'keypress' | 'keyup'
    propagate: boolean
    disable_in_input: boolean
    target: Node
    keycode: number
}

interface Shortcut {
    add: (
        shortcut_combination: string,
        callback: (event: KeyboardEvent) => void,
        opt?: Partial<ShortcutOptions>
    ) => void
    remove: (shortcut_combination: string) => void
}

interface Window {
    shortcut: Shortcut
}
