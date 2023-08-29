import Settings from './settings'

const qcDebug = Function.prototype.bind.call(
    console.debug,
    console,
    '%c[QC-Ext]:',
    'color: purple; font-weight: bold'
)
let debug = function (...args: any[]) {
    if (Settings.get().values.showDebugLogs) {
        qcDebug(...args)
    }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
let log = function (...args: any[]) {
    forgotSetup()
}

let info = function (...args: any[]) {
    forgotSetup()
}

let warn = function (...args: any[]) {
    forgotSetup()
}

let error = function (...args: any[]) {
    forgotSetup()
}

let qcBug = function (...args: any[]) {
    forgotSetup()
}
/* eslint-enable @typescript-eslint/no-unused-vars */

function forgotSetup() {
    console.error('Console function used before call to setup()')
}

function setup() {
    log = Function.prototype.bind.call(
        console.log,
        console,
        '%c[QC-Ext]:',
        'color: purple; font-weight: bold'
    )

    info = Function.prototype.bind.call(
        console.info,
        console,
        '%c[QC-Ext]:',
        'color: purple; font-weight: bold'
    )

    warn = Function.prototype.bind.call(
        console.warn,
        console,
        '%c[QC-Ext]:',
        'color: purple; font-weight: bold'
    )

    error = Function.prototype.bind.call(
        console.error,
        console,
        '%c[QC-Ext]:',
        'color: purple; font-weight: bold'
    )

    qcBug = Function.prototype.bind.call(
        console.error,
        console,
        '%c[QC-Ext]:',
        'color: purple; font-weight: bold',
        'This is a bug related to our inability to interact as expected with the Questionable ' +
            'Content website. Did Jeph suddenly update his website design? Please visit ' +
            'https://github.com/Questionable-Content-Extensions/client/issues and ' +
            'create an issue describing the following error details as well as the stack trace ' +
            'preceeding this error message.'
    )
}

export { log, debug, info, warn, error, qcBug, setup }

/**
 * Awaits for an element with the specified `selector` to be found
 * and then returns the selected dom node.
 * This is used to delay rendering a widget until its parent appears.
 *
 * @export
 * @param {string} selector
 * @returns {DOMNode}
 */
export async function awaitElement<E extends Element = Element>(
    selectors: string
): Promise<E | null> {
    const MAX_TRIES = 60
    let tries = 0
    return new Promise((resolve, reject) => {
        function probe() {
            tries++
            return document.querySelector<E>(selectors)
        }

        function delayedProbe() {
            if (tries >= MAX_TRIES) {
                error("Can't find element with selector", selectors)
                reject()
                return
            }
            const elm = probe()
            if (elm) {
                resolve(elm)
                return
            }

            window.setTimeout(delayedProbe, 250)
        }

        delayedProbe()
    })
}

/**
 * Wraps `element` in `wrapper`.
 *
 * @param {HTMLElement} element The element to wrap
 * @param {HTMLElement?} wrapper The element to use as the wrapper. If none is provided, a `div` is created and used
 * @returns {HTMLElement} The wrapped element
 */
export function wrapElement(element: HTMLElement, wrapper: HTMLElement | null) {
    wrapper = wrapper || document.createElement('div')
    const parentNode = element.parentNode
    if (!parentNode) {
        console.error('wrapElement')
        return
    }
    element.parentNode.insertBefore(element, wrapper)
    return wrapper.appendChild(element)
}

/**
 * @param {String} html HTML representing a single element
 * @return {HTMLElement} The element created from the given HTML
 */
export function htmlToElement(html: string): HTMLElement {
    var template = document.createElement('template')
    html = html.trim()
    template.innerHTML = html
    return template.content.firstChild as HTMLElement
}

export async function fetch<TContext = undefined>(
    url: string,
    configuration?: {
        context?: TContext
        method?:
            | 'GET'
            | 'POST'
            | 'PUT'
            | 'DELETE'
            | 'PATCH'
            | 'HEAD'
            | 'TRACE'
            | 'OPTIONS'
            | 'CONNECT'
        data?: string
        headers?: {
            [header: string]: string
        }
        overrideMimeType?: string
        user?: string
        password?: string
    }
): Promise<GM.Response<TContext>> {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            url: url,
            method: configuration?.method ? configuration.method : 'GET',
            context: configuration?.context,
            data: configuration?.data,
            headers: configuration?.headers,
            overrideMimeType: configuration?.overrideMimeType,
            user: configuration?.user,
            password: configuration?.password,
            onload: (response) => {
                resolve(response)
            },
            onerror: (response) => {
                reject(response)
            },
        })
    })
}

export function nl2br(str: string, isXhtml?: boolean) {
    const breakTag =
        isXhtml || typeof isXhtml === 'undefined' ? '<br />' : '<br>'

    return String(str).replace(
        /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,
        '$1' + breakTag + '$2'
    )
}
