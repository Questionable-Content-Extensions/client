import { describe, expect, it } from 'vitest'

import { buildQueryString } from './buildQueryString'

describe('buildQueryString', () => {
    it('returns an empty string for undefined query', () => {
        expect(buildQueryString(undefined)).toBe('')
    })

    it('returns an empty string for an empty query', () => {
        expect(buildQueryString({})).toBe('')
    })

    it('serializes scalar values', () => {
        expect(buildQueryString({ foo: 'bar', count: 5 })).toBe(
            'foo=bar&count=5'
        )
    })

    it('repeats the key for each array element', () => {
        expect(buildQueryString({ 'item-id': [1, 2, 3] })).toBe(
            'item-id=1&item-id=2&item-id=3'
        )
    })

    it('omits undefined values', () => {
        expect(buildQueryString({ foo: undefined, bar: 'baz' })).toBe('bar=baz')
    })
})
