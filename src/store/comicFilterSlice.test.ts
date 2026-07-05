import { describe, expect, it } from 'vitest'

import { Filter, FilterType } from '@models/Filter'

import comicFilterReducer, { setFilteredComics } from './comicFilterSlice'

describe('comicFilterSlice', () => {
    it('starts with no active filter', () => {
        expect(comicFilterReducer(undefined, { type: 'unknown' })).toEqual({
            filteredComics: [],
            filters: [],
        })
    })

    it('stores both the matching comics and the filters that produced them', () => {
        const filters: Filter[] = [
            { type: FilterType.IsGuestComic, value: true },
        ]
        const state = comicFilterReducer(
            undefined,
            setFilteredComics({ comics: [1, 5, 9], filters })
        )
        expect(state).toEqual({ filteredComics: [1, 5, 9], filters })
    })
})
