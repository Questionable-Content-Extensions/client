import { ComicId } from '@models/ComicId'
import { Filter } from '@models/Filter'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import constants, { HAS_GREASEMONKEY } from '~/constants'

import createAppAsyncThunk from './createAppAsyncThunk'

interface ComicFilterState {
    filteredComics: ComicId[]
    filters: Filter[]
}

const initialState: ComicFilterState = {
    filteredComics: [],
    filters: [],
}

export const loadComicFilter = createAppAsyncThunk<
    ComicFilterState | null,
    void
>('comicFilter/load', async (_, { getState }) => {
    if (!HAS_GREASEMONKEY) {
        return null
    }

    if (!getState().settings.values?.rememberComicFilter) {
        await GM.deleteValue(constants.comicFilterKey)
        return null
    }

    const raw = await GM.getValue(constants.comicFilterKey, null)
    if (!raw) {
        return null
    }

    return JSON.parse(raw) as ComicFilterState
})

export const comicFilterSlice = createSlice({
    name: 'comicFilter',
    initialState,
    reducers: {
        setFilteredComics: (
            state,
            action: PayloadAction<{ comics: ComicId[]; filters: Filter[] }>
        ) => {
            state.filteredComics = action.payload.comics
            state.filters = action.payload.filters
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadComicFilter.fulfilled, (state, action) => {
            if (action.payload) {
                state.filteredComics = action.payload.filteredComics
                state.filters = action.payload.filters
            }
        })
    },
})

export const { setFilteredComics } = comicFilterSlice.actions

export default comicFilterSlice.reducer
