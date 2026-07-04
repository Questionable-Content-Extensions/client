import { describe, expect, it } from 'vitest'

import { Filter, FilterType } from './Filter'
import { describeFilters } from './describeFilter'

describe('describeFilters', () => {
    it('returns an empty string when there are no filters', () => {
        expect(describeFilters([])).toBe('')
    })

    it('describes a single filter without a trailing conjunction', () => {
        const filters: Filter[] = [
            { type: FilterType.IsGuestComic, value: false },
        ]
        expect(describeFilters(filters)).toBe('Is not guest comic')
    })

    it('joins multiple filters with commas and a trailing "and"', () => {
        const filters: Filter[] = [
            {
                type: FilterType.Item,
                value: {
                    id: 1,
                    shortName: 'Foo',
                    name: 'Foo Fooson',
                    type: 'cast',
                    color: 'ffffff',
                    count: 1,
                    startComicId: null,
                    endComicId: null,
                },
            },
            {
                type: FilterType.Item,
                value: {
                    id: 2,
                    shortName: 'Bar',
                    name: 'Bar Barson',
                    type: 'location',
                    color: 'ffffff',
                    count: 1,
                    startComicId: null,
                    endComicId: null,
                },
            },
            { type: FilterType.Text, value: 'baz' },
            { type: FilterType.IsGuestComic, value: false },
        ]
        expect(describeFilters(filters)).toBe(
            "Contains cast Foo, contains location Bar, contains 'baz' in title/tagline and is not guest comic"
        )
    })
})
