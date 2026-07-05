import { describe, expect, it } from 'vitest'

import { getExclusion } from './comicApiSlice'

describe('getExclusion', () => {
    it('excludes non-canon when only skipNonCanon is enabled', () => {
        expect(getExclusion(false, true)).toBe('non-canon')
    })

    it('excludes guest when only skipGuest is enabled', () => {
        expect(getExclusion(true, false)).toBe('guest')
    })

    it('prefers non-canon over guest when both are enabled, since guest comics are a subset of non-canon comics', () => {
        expect(getExclusion(true, true)).toBe('non-canon')
    })

    it('excludes nothing when neither is enabled', () => {
        expect(getExclusion(false, false)).toBeUndefined()
    })
})
