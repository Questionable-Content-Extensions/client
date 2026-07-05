import { ComicId } from '@models/ComicId'
import { ItemId } from '@models/ItemId'

import Settings from './Settings'
import { HAS_GREASEMONKEY } from './constants'

const qcDebug = Function.prototype.bind.call(
    console.debug,
    console,
    '%c[QC-Ext]:',
    'color: purple; font-weight: bold'
)
/* eslint-disable @typescript-eslint/no-explicit-any */
const debug = function (...args: any[]) {
    if (HAS_GREASEMONKEY) {
        if (Settings.get().values.showDebugLogs) {
            qcDebug(...args)
        }
    } else {
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
/* eslint-enable @typescript-eslint/no-explicit-any */
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
    const template = document.createElement('template')
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
        data?: string | Uint8Array
        headers?: {
            [header: string]: string
        }
        overrideMimeType?: string
        user?: string
        password?: string
    }
): Promise<GM.Response<TContext>> {
    return new Promise((resolve, reject) => {
        const rawData = configuration?.data
        const isRawBytes = rawData instanceof Uint8Array
        const data = isRawBytes ? bytesToBinaryString(rawData) : rawData
        GM.xmlHttpRequest({
            url: url,
            method: configuration?.method ? configuration.method : 'GET',
            context: configuration?.context,
            data,
            // Without this, GM.xmlHttpRequest UTF-8-encodes `data`, mangling
            // any byte >= 0x80.
            binary: isRawBytes,
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

/**
 * `GM.xmlHttpRequest`'s `data` field only accepts a `string`, which it sends
 * as raw bytes rather than re-encoding as UTF-8 (so byte values above 127
 * survive intact). This converts raw bytes into that representation.
 */
export function bytesToBinaryString(bytes: Uint8Array): string {
    const chunkSize = 0x8000
    let binary = ''
    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize))
    }
    return binary
}

/**
 * Some userscript managers no longer auto-encode a `FormData` value passed
 * as `GM.xmlHttpRequest`'s `data` field (it gets coerced to the string
 * `"[object Object]"` instead), so multipart/form-data bodies for file
 * uploads must be built by hand.
 */
export async function buildMultipartFormData(
    fieldName: string,
    file: Blob,
    filename: string
): Promise<{ body: Uint8Array; contentType: string }> {
    const boundary = `----QCExtBoundary${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`
    const encoder = new TextEncoder()
    const header = encoder.encode(
        `--${boundary}\r\n` +
            `Content-Disposition: form-data; name="${fieldName}"; filename="${filename}"\r\n` +
            `Content-Type: ${file.type || 'application/octet-stream'}\r\n\r\n`
    )
    const footer = encoder.encode(`\r\n--${boundary}--\r\n`)
    const fileBytes = new Uint8Array(await file.arrayBuffer())

    const body = new Uint8Array(
        header.length + fileBytes.length + footer.length
    )
    body.set(header, 0)
    body.set(fileBytes, header.length)
    body.set(footer, header.length + fileBytes.length)

    return { body, contentType: `multipart/form-data; boundary=${boundary}` }
}

export function nl2br(str: string, isXhtml?: boolean) {
    const breakTag =
        isXhtml || typeof isXhtml === 'undefined' ? '<br />' : '<br>'

    return String(str).replace(
        /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,
        '$1' + breakTag + '$2'
    )
}

const DATE_OPTIONS = {
    weekday: 'long' as const,
    day: 'numeric' as const,
    month: 'long' as const,
    year: 'numeric' as const,
}
export function formatDate(date: Date, useCorrectTimeFormat: boolean) {
    const timeOptions = {
        hour: useCorrectTimeFormat
            ? ('2-digit' as const)
            : ('numeric' as const),
        hour12: !useCorrectTimeFormat,
        minute: '2-digit' as const,
    }

    const dateString = new Intl.DateTimeFormat('en-US', DATE_OPTIONS).format(
        date
    )
    const timeString = new Intl.DateTimeFormat('en-US', timeOptions).format(
        date
    )
    return `${dateString} ${timeString}`
}

// https://dev.to/namirsab/comment/2050
export function range(start: number, end: number) {
    const length = end - start + 1
    return Array.from({ length }, (_, i) => start + i)
}

export function dbg<T>(v: T, d?: string) {
    console.log(v, d)
    return v
}

export interface PopStateComicData {
    comic: ComicId
    lockedToItem: ItemId | null
}

export function parsePopStateComicData(
    state: unknown
): PopStateComicData | null {
    if (typeof state !== 'object' || state === null) {
        return null
    }

    const candidate = state as Record<string, unknown>
    if (typeof candidate.comic !== 'number') {
        return null
    }
    if (
        candidate.lockedToItem !== null &&
        typeof candidate.lockedToItem !== 'number'
    ) {
        return null
    }

    return {
        comic: candidate.comic,
        lockedToItem: candidate.lockedToItem,
    }
}

export function readFileToDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const fr = new FileReader()
        fr.onload = () => {
            resolve(fr.result as string)
        }
        fr.onerror = reject
        fr.readAsDataURL(file)
    })
}
