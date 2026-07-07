import { afterEach, describe, expect, it, vi } from 'vitest'

import { Filter, FilterType } from '@models/Filter'

import Settings from '~/Settings'

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

function mockGM(getValueImpl: (key: string, defaultValue: null) => unknown) {
    global.GM = {
        info: { script: { name: 'QCExt', version: '1.0.0' } },
        getValue: vi.fn(getValueImpl),
        setValue: vi.fn().mockResolvedValue(undefined),
        deleteValue: vi.fn().mockResolvedValue(undefined),
    } as unknown as typeof GM
}

async function buildStore() {
    const { makeStore } = await import('./store')
    const { setSettings } = await import('./settingsSlice')
    const { loadComicFilter } = await import('./comicFilterSlice')

    return { store: makeStore(), setSettings, loadComicFilter }
}

describe('comicFilterSlice.loadComicFilter', () => {
    afterEach(() => {
        // @ts-expect-error test cleanup of a global we defined ourselves
        delete global.GM
        vi.restoreAllMocks()
    })

    it('restores the persisted filter when remembering is enabled', async () => {
        mockGM(() => JSON.stringify({ filteredComics: [1, 2], filters: [] }))
        vi.resetModules()
        const { store, setSettings, loadComicFilter } = await buildStore()
        store.dispatch(
            setSettings({ ...Settings.DEFAULTS, rememberComicFilter: true })
        )

        await store.dispatch(loadComicFilter())

        expect(store.getState().comicFilter).toEqual({
            filteredComics: [1, 2],
            filters: [],
        })
    })

    it('does not touch the filter and clears storage when remembering is disabled', async () => {
        mockGM(() => JSON.stringify({ filteredComics: [1, 2], filters: [] }))
        vi.resetModules()
        const { store, setSettings, loadComicFilter } = await buildStore()
        store.dispatch(
            setSettings({ ...Settings.DEFAULTS, rememberComicFilter: false })
        )

        await store.dispatch(loadComicFilter())

        expect(store.getState().comicFilter).toEqual({
            filteredComics: [],
            filters: [],
        })
        expect(global.GM.deleteValue).toHaveBeenCalledWith('comicFilter')
        expect(global.GM.getValue).not.toHaveBeenCalled()
    })

    it('leaves the filter empty when nothing was previously persisted', async () => {
        mockGM(() => null)
        vi.resetModules()
        const { store, setSettings, loadComicFilter } = await buildStore()
        store.dispatch(
            setSettings({ ...Settings.DEFAULTS, rememberComicFilter: true })
        )

        await store.dispatch(loadComicFilter())

        expect(store.getState().comicFilter).toEqual({
            filteredComics: [],
            filters: [],
        })
    })
})
