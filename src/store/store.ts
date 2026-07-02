import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { apiSlice } from './apiSlice'
import comicEditorReducer from './comicEditorSlice'
import comicFilterReducer from './comicFilterSlice'
import comicReducer from './comicSlice'
import customLogger from './customLogger'
import dialogReducer from './dialogSlice'
import itemEditorReducer from './itemEditorSlice'
import { rtkQueryErrorLogger } from './rtkQueryErrorLogger'
import settingsReducer from './settingsSlice'

export function makeStore() {
    const store = configureStore({
        reducer: {
            comic: comicReducer,
            comicFilter: comicFilterReducer,
            dialog: dialogReducer,
            itemEditor: itemEditorReducer,
            comicEditor: comicEditorReducer,
            settings: settingsReducer,
            [apiSlice.reducerPath]: apiSlice.reducer,
        },
        middleware: (getDefaultMiddleware) => {
            const base = getDefaultMiddleware()
                .concat(apiSlice.middleware)
                .concat(rtkQueryErrorLogger)
            // redux-logger is dev-only noise under Vitest (every dispatch in
            // every Storybook test fires it), so skip it during test runs.
            return import.meta.env.MODE === 'test'
                ? base
                : base.concat(customLogger)
        },
    })

    setupListeners(store.dispatch)

    return store
}

const store = makeStore()
export default store

// TODO: Set up a way to reset all state.
// See <https://stackoverflow.com/a/73864197/161250> for inspiration.

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<ReturnType<typeof makeStore>['getState']>
export type AppDispatch = ReturnType<typeof makeStore>['dispatch']
