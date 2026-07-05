import { describe, expect, it } from 'vitest'

import computeFilteredComicsNavigation from './computeFilteredComicsNavigation'

describe('computeFilteredComicsNavigation', () => {
    it('returns all nulls when there are no filtered comics', () => {
        expect(computeFilteredComicsNavigation([], 10)).toEqual({
            first: null,
            previous: null,
            next: null,
            last: null,
        })
    })

    it('computes first/previous/next/last around the current comic', () => {
        expect(computeFilteredComicsNavigation([5, 10, 15, 20], 10)).toEqual({
            first: 5,
            previous: 5,
            next: 15,
            last: 20,
        })
    })

    it('hides first/last when the current comic is already the boundary', () => {
        expect(computeFilteredComicsNavigation([5, 10, 15], 5)).toEqual({
            first: null,
            previous: null,
            next: 10,
            last: 15,
        })
        expect(computeFilteredComicsNavigation([5, 10, 15], 15)).toEqual({
            first: 5,
            previous: 10,
            next: null,
            last: null,
        })
    })

    it('finds nearest neighbors when the current comic is not itself in the filtered set', () => {
        expect(computeFilteredComicsNavigation([5, 10, 20], 12)).toEqual({
            first: 5,
            previous: 10,
            next: 20,
            last: 20,
        })
    })
})
