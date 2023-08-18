import { createLogger } from 'redux-logger'

import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { qcExtApi } from './api'
import settingsReducer from './settingsSlice'

const logger = createLogger()

const store = configureStore({
    reducer: {
        settings: settingsReducer,
        [qcExtApi.reducerPath]: qcExtApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(logger).concat(qcExtApi.middleware),
})

setupListeners(store.dispatch)

export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
