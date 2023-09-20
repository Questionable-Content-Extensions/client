import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { apiSlice } from './apiSlice'
import comicEditorReducer from './comicEditorSlice'
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
            dialog: dialogReducer,
            itemEditor: itemEditorReducer,
            comicEditor: comicEditorReducer,
            settings: settingsReducer,
            [apiSlice.reducerPath]: apiSlice.reducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware()
                .concat(apiSlice.middleware)
                .concat(customLogger)
                .concat(rtkQueryErrorLogger),
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
