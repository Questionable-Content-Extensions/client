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

export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
