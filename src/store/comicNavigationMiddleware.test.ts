import { toast } from 'react-toastify'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { configureStore } from '@reduxjs/toolkit'

import Settings from '~/Settings'

import comicEditorReducer, { setTitle } from './comicEditorSlice'
import { comicNavigationMiddleware } from './comicNavigationMiddleware'
import comicReducer, { setCurrentComic, setLockedToItem } from './comicSlice'
import settingsReducer, { setSettings } from './settingsSlice'

vi.mock('react-toastify', () => ({
    toast: { info: vi.fn(), error: vi.fn() },
}))

function buildStore() {
    return configureStore({
        reducer: {
            comic: comicReducer,
            comicEditor: comicEditorReducer,
            settings: settingsReducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(comicNavigationMiddleware),
    })
}

describe('comicNavigationMiddleware', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('shows a toast when an unlocked navigation breaks an existing item lock', () => {
        const store = buildStore()
        store.dispatch(setLockedToItem(42))

        store.dispatch(setCurrentComic(5))

        expect(toast.info).toHaveBeenCalled()
    })

    it('does not show a toast when the navigation itself is locked', () => {
        const store = buildStore()
        store.dispatch(setLockedToItem(42))

        store.dispatch(setCurrentComic(5, { locked: true }))

        expect(toast.info).not.toHaveBeenCalled()
    })

    it('does not show a toast when there was no existing lock', () => {
        const store = buildStore()

        store.dispatch(setCurrentComic(5))

        expect(toast.info).not.toHaveBeenCalled()
    })

    it('blocks navigation when the comic editor is dirty and the user cancels the confirm', () => {
        const store = buildStore()
        store.dispatch(setSettings({ ...Settings.DEFAULTS, editMode: true }))
        store.dispatch(setTitle('unsaved title'))
        const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)

        store.dispatch(setCurrentComic(5))

        expect(confirmSpy).toHaveBeenCalled()
        expect(store.getState().comic.current).toBe(0)
    })

    it('allows navigation when the comic editor is dirty and the user confirms', () => {
        const store = buildStore()
        store.dispatch(setSettings({ ...Settings.DEFAULTS, editMode: true }))
        store.dispatch(setTitle('unsaved title'))
        vi.spyOn(window, 'confirm').mockReturnValue(true)

        store.dispatch(setCurrentComic(5))

        expect(store.getState().comic.current).toBe(5)
    })

    it('does not prompt when the comic editor is dirty but edit mode is off', () => {
        const store = buildStore()
        store.dispatch(setSettings({ ...Settings.DEFAULTS, editMode: false }))
        store.dispatch(setTitle('unsaved title'))
        const confirmSpy = vi.spyOn(window, 'confirm')

        store.dispatch(setCurrentComic(5))

        expect(confirmSpy).not.toHaveBeenCalled()
        expect(store.getState().comic.current).toBe(5)
    })

    it('does not prompt when the comic editor has no unsaved changes', () => {
        const store = buildStore()
        store.dispatch(setSettings({ ...Settings.DEFAULTS, editMode: true }))
        const confirmSpy = vi.spyOn(window, 'confirm')

        store.dispatch(setCurrentComic(5))

        expect(confirmSpy).not.toHaveBeenCalled()
        expect(store.getState().comic.current).toBe(5)
    })
})
