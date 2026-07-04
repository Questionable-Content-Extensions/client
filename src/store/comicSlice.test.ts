import { describe, expect, it } from 'vitest'

import comicReducer, { setCurrentComic, setLockedToItem } from './comicSlice'

describe('comicSlice', () => {
    it('clears lockedToItem when an unlocked navigation occurs while locked', () => {
        const locked = comicReducer(undefined, setLockedToItem(42))
        expect(locked.lockedToItem).toBe(42)

        const next = comicReducer(locked, setCurrentComic(5))

        expect(next.current).toBe(5)
        expect(next.lockedToItem).toBeNull()
    })

    it('keeps lockedToItem when the navigation itself is a locked one', () => {
        const locked = comicReducer(undefined, setLockedToItem(42))

        const next = comicReducer(locked, setCurrentComic(5, { locked: true }))

        expect(next.current).toBe(5)
        expect(next.lockedToItem).toBe(42)
    })

    it('is a pure reducer with no side effects', () => {
        const locked = comicReducer(undefined, setLockedToItem(42))

        expect(() => comicReducer(locked, setCurrentComic(5))).not.toThrow()
    })
})
