import { ComicId } from '@models/ComicId'
import { Filter } from '@models/Filter'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface ComicFilterState {
    filteredComics: ComicId[]
    filters: Filter[]
}

const initialState: ComicFilterState = {
    filteredComics: [],
    filters: [],
}

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
})

export const { setFilteredComics } = comicFilterSlice.actions

export default comicFilterSlice.reducer
