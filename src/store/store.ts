import { createLogger } from 'redux-logger'

import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { apiSlice } from './apiSlice'
import comicEditorReducer from './comicEditorSlice'
import comicReducer from './comicSlice'
import dialogReducer from './dialogSlice'
import settingsReducer from './settingsSlice'

const consoleProxy = {
    get(target: any, prop: any, _receiver: any) {
        if (prop in target) {
            return target[prop]
        }
        if (prop in console) {
            return (console as any)[prop]
        }
        console.warn(`Property ${prop} does not exist on console`)
        return undefined
    },
}

const logger = createLogger({
    diff: true,
    collapsed: true,
    logger: new Proxy(
        {
            log: (...args: any[]) => {
                console.debug(...args)
            },
        },
        consoleProxy
    ),
})

const store = configureStore({
    reducer: {
        comic: comicReducer,
        dialog: dialogReducer,
        comicEditor: comicEditorReducer,
        settings: settingsReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware).concat(logger),
})

setupListeners(store.dispatch)

export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
