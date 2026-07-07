import { afterEach, describe, expect, it, vi } from 'vitest'

import { FilterType } from '@models/Filter'
import { configureStore } from '@reduxjs/toolkit'

import Settings from '~/Settings'

function mockGM() {
    global.GM = {
        info: { script: { name: 'QCExt', version: '1.0.0' } },
        getValue: vi.fn(),
        setValue: vi.fn().mockResolvedValue(undefined),
        deleteValue: vi.fn().mockResolvedValue(undefined),
    } as unknown as typeof GM
}

async function buildStore() {
    const { comicFilterPersistenceMiddleware } =
        await import('./comicFilterPersistenceMiddleware')
    const { default: comicFilterReducer } = await import('./comicFilterSlice')
    const { default: settingsReducer } = await import('./settingsSlice')
    const { setFilteredComics } = await import('./comicFilterSlice')
    const { setSettings, updateSettings } = await import('./settingsSlice')

    const store = configureStore({
        reducer: {
            comicFilter: comicFilterReducer,
            settings: settingsReducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(comicFilterPersistenceMiddleware),
    })

    return { store, setFilteredComics, setSettings, updateSettings }
}

describe('comicFilterPersistenceMiddleware', () => {
    afterEach(() => {
        // @ts-expect-error test cleanup of a global we defined ourselves
        delete global.GM
        vi.restoreAllMocks()
    })

    it('persists the filter when it changes and remembering is enabled', async () => {
        mockGM()
        vi.resetModules()
        const { store, setFilteredComics, setSettings } = await buildStore()
        store.dispatch(
            setSettings({ ...Settings.DEFAULTS, rememberComicFilter: true })
        )

        store.dispatch(
            setFilteredComics({
                comics: [1, 2],
                filters: [{ type: FilterType.IsGuestComic, value: true }],
            })
        )

        expect(global.GM.setValue).toHaveBeenCalledWith(
            'comicFilter',
            JSON.stringify(store.getState().comicFilter)
        )
    })

    it('does not persist the filter when remembering is disabled', async () => {
        mockGM()
        vi.resetModules()
        const { store, setFilteredComics, setSettings } = await buildStore()
        store.dispatch(
            setSettings({ ...Settings.DEFAULTS, rememberComicFilter: false })
        )

        store.dispatch(setFilteredComics({ comics: [1, 2], filters: [] }))

        expect(global.GM.setValue).not.toHaveBeenCalled()
    })

    it('clears the persisted filter when remembering is turned off', async () => {
        mockGM()
        vi.resetModules()
        const { store, updateSettings } = await buildStore()
        const payload = { ...Settings.DEFAULTS, rememberComicFilter: false }

        // Dispatch the thunk's `fulfilled` action directly rather than the
        // thunk itself, since the thunk reaches into the `Settings`
        // singleton (which isn't initialized here) to persist to GM storage.
        store.dispatch(updateSettings.fulfilled(payload, 'test', payload))

        expect(global.GM.deleteValue).toHaveBeenCalledWith('comicFilter')
    })

    it('does not clear the persisted filter when remembering stays on', async () => {
        mockGM()
        vi.resetModules()
        const { store, updateSettings } = await buildStore()
        const payload = { ...Settings.DEFAULTS, rememberComicFilter: true }

        store.dispatch(updateSettings.fulfilled(payload, 'test', payload))

        expect(global.GM.deleteValue).not.toHaveBeenCalled()
    })
})
