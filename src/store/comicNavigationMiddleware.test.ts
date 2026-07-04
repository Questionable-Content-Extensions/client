import { toast } from 'react-toastify'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { configureStore } from '@reduxjs/toolkit'

import { comicNavigationMiddleware } from './comicNavigationMiddleware'
import comicReducer, { setCurrentComic, setLockedToItem } from './comicSlice'

vi.mock('react-toastify', () => ({
    toast: { info: vi.fn(), error: vi.fn() },
}))

function buildStore() {
    return configureStore({
        reducer: { comic: comicReducer },
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
})
