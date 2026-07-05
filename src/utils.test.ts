import { describe, expect, it } from 'vitest'

import {
    buildMultipartFormData,
    bytesToBinaryString,
    parsePopStateComicData,
} from './utils'

describe('bytesToBinaryString', () => {
    it('maps each byte to the character with the same code point', () => {
        const bytes = new Uint8Array([0, 65, 127, 200, 255])
        expect(bytesToBinaryString(bytes)).toBe(
            String.fromCharCode(0, 65, 127, 200, 255)
        )
    })

    it('handles inputs larger than the internal chunk size', () => {
        const bytes = new Uint8Array(0x8000 + 10).fill(42)
        const result = bytesToBinaryString(bytes)
        expect(result.length).toBe(bytes.length)
        expect(result).toBe(String.fromCharCode(42).repeat(bytes.length))
    })
})

describe('buildMultipartFormData', () => {
    it('wraps the file bytes in a multipart body matching the returned boundary', async () => {
        const fileBytes = new Uint8Array([1, 2, 3, 254, 255])
        const file = new Blob([fileBytes], { type: 'image/png' })

        const { body, contentType } = await buildMultipartFormData(
            'image',
            file,
            'picture.png'
        )

        const boundaryMatch = /boundary=(\S+)/.exec(contentType)
        expect(boundaryMatch).not.toBeNull()
        const boundary = boundaryMatch![1]

        const text = bytesToBinaryString(body)
        expect(text).toBe(
            `--${boundary}\r\n` +
                `Content-Disposition: form-data; name="image"; filename="picture.png"\r\n` +
                `Content-Type: image/png\r\n\r\n` +
                bytesToBinaryString(fileBytes) +
                `\r\n--${boundary}--\r\n`
        )
    })

    it('falls back to application/octet-stream when the blob has no type', async () => {
        const file = new Blob([new Uint8Array([9])])

        const { body, contentType } = await buildMultipartFormData(
            'image',
            file,
            'blob.bin'
        )

        expect(bytesToBinaryString(body)).toContain(
            'Content-Type: application/octet-stream'
        )
        expect(contentType).toMatch(/^multipart\/form-data; boundary=/)
    })
})

describe('parsePopStateComicData', () => {
    it('parses a valid state with a locked item', () => {
        expect(parsePopStateComicData({ comic: 42, lockedToItem: 7 })).toEqual({
            comic: 42,
            lockedToItem: 7,
        })
    })

    it('parses a valid state with no locked item', () => {
        expect(
            parsePopStateComicData({ comic: 42, lockedToItem: null })
        ).toEqual({ comic: 42, lockedToItem: null })
    })

    it.each([undefined, null, 'string', 42, []])(
        'rejects non-object state %p',
        (state) => {
            expect(parsePopStateComicData(state)).toBeNull()
        }
    )

    it('rejects state missing a numeric comic field', () => {
        expect(
            parsePopStateComicData({ comic: '42', lockedToItem: null })
        ).toBeNull()
        expect(parsePopStateComicData({ lockedToItem: null })).toBeNull()
    })

    it('rejects state with a lockedToItem that is neither null nor a number', () => {
        expect(
            parsePopStateComicData({ comic: 42, lockedToItem: '7' })
        ).toBeNull()
    })
})
