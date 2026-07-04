import { describe, expect, it } from 'vitest'

import computeStorylineNavigation from './computeStorylineNavigation'

describe('computeStorylineNavigation', () => {
    it('returns all nulls when there are no featured segments', () => {
        expect(
            computeStorylineNavigation(
                [{ fromComicId: 0, toComicId: 10, featured: false }],
                5
            )
        ).toEqual({ first: null, previous: null, next: null, last: null })
    })

    it('computes first/previous/next/last around the current comic within a single run', () => {
        expect(
            computeStorylineNavigation(
                [{ fromComicId: 3, toComicId: 8, featured: true }],
                5
            )
        ).toEqual({ first: 3, previous: 4, next: 6, last: 7 })
    })

    it('hides first/last when the current comic is already the boundary', () => {
        expect(
            computeStorylineNavigation(
                [{ fromComicId: 3, toComicId: 8, featured: true }],
                3
            )
        ).toEqual({ first: null, previous: null, next: 4, last: 7 })
        expect(
            computeStorylineNavigation(
                [{ fromComicId: 3, toComicId: 8, featured: true }],
                7
            )
        ).toEqual({ first: 3, previous: 6, next: null, last: null })
    })

    it('finds neighbors across multiple featured runs, skipping gaps', () => {
        const segments = [
            { fromComicId: 0, toComicId: 3, featured: true },
            { fromComicId: 3, toComicId: 10, featured: false },
            { fromComicId: 10, toComicId: 13, featured: true },
            { fromComicId: 13, toComicId: 20, featured: false },
            { fromComicId: 20, toComicId: 23, featured: true },
        ]

        expect(computeStorylineNavigation(segments, 15)).toEqual({
            first: 0,
            previous: 12,
            next: 20,
            last: 22,
        })
    })

    it('finds neighbors when the current comic sits inside a gap between runs', () => {
        const segments = [
            { fromComicId: 0, toComicId: 2, featured: true },
            { fromComicId: 2, toComicId: 6, featured: false },
            { fromComicId: 6, toComicId: 9, featured: true },
        ]

        expect(computeStorylineNavigation(segments, 4)).toEqual({
            first: 0,
            previous: 1,
            next: 6,
            last: 8,
        })
    })

    it('returns null previous/next when the current comic is before the first or after the last run', () => {
        const segments = [
            { fromComicId: 5, toComicId: 8, featured: true },
            { fromComicId: 8, toComicId: 10, featured: false },
            { fromComicId: 10, toComicId: 13, featured: true },
        ]

        expect(computeStorylineNavigation(segments, 1)).toEqual({
            first: 5,
            previous: null,
            next: 5,
            last: 12,
        })
        expect(computeStorylineNavigation(segments, 100)).toEqual({
            first: 5,
            previous: 12,
            next: null,
            last: 12,
        })
    })
})
