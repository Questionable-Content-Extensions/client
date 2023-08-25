import { FlagType } from '@models/FlagType'
import { PatchComicBody } from '@models/PatchComicBody'
import { PresentComic } from '@models/PresentComic'
import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit'

import { comicApiSlice } from './api/comicApiSlice'
import createAppAsyncThunk from './createAppAsyncThunk'
import { createDirtySelector } from './createDirtySelector'
import { RootState } from './store'

interface ComicEditorDataState {
    title: string
    tagline: string
    publishDate: string
    isAccuratePublishDate: boolean

    originalTitle: string
    originalTagline: string
    originalPublishDate: string
    originalIsAccuratePublishDate: boolean

    isGuestComic: boolean
    isNonCanon: boolean
    hasNoCast: boolean
    hasNoLocation: boolean
    hasNoStoryline: boolean
    hasNoTitle: boolean
    hasNoTagline: boolean

    originalIsGuestComic: boolean
    originalIsNonCanon: boolean
    originalHasNoCast: boolean
    originalHasNoLocation: boolean
    originalHasNoStoryline: boolean
    originalHasNoTitle: boolean
    originalHasNoTagline: boolean

    isSaving: boolean
}

const initialState: ComicEditorDataState = {
    title: '',
    tagline: '',
    publishDate: '',
    isAccuratePublishDate: false,

    originalTitle: '',
    originalTagline: '',
    originalPublishDate: '',
    originalIsAccuratePublishDate: false,

    isGuestComic: false,
    isNonCanon: false,
    hasNoCast: false,
    hasNoLocation: false,
    hasNoStoryline: false,
    hasNoTitle: false,
    hasNoTagline: false,

    originalIsGuestComic: false,
    originalIsNonCanon: false,
    originalHasNoCast: false,
    originalHasNoLocation: false,
    originalHasNoStoryline: false,
    originalHasNoTitle: false,
    originalHasNoTagline: false,

    isSaving: false,
}

export const saveChanges = createAppAsyncThunk(
    'comicEditor/saveChanges',
    async (_type, { dispatch, getState, rejectWithValue }) => {
        const state = getState()
        // Setting values should always be loaded by the time we get here
        const editModeToken = state.settings.values!.editModeToken

        let patchBody: PatchComicBody = {
            token: editModeToken,
        }

        if (isTitleDirtySelector(state)) {
            patchBody.title = state.comicEditor.title
        }
        if (isTaglineDirtySelector(state)) {
            patchBody.tagline = state.comicEditor.tagline
        }
        if (isPublishDateDataDirtySelector(state)) {
            patchBody.publishDate = {
                publishDate: state.comicEditor.publishDate,
                isAccuratePublishDate: state.comicEditor.isAccuratePublishDate,
            }
        }
        if (isIsGuestComicDirtySelector(state)) {
            patchBody.isGuestComic = state.comicEditor.isGuestComic
        }
        if (isIsNonCanonDirtySelector(state)) {
            patchBody.isNonCanon = state.comicEditor.isNonCanon
        }
        if (isHasNoCastDirtySelector(state)) {
            patchBody.hasNoCast = state.comicEditor.hasNoCast
        }
        if (isHasNoLocationDirtySelector(state)) {
            patchBody.hasNoLocation = state.comicEditor.hasNoLocation
        }
        if (isHasNoStorylineDirtySelector(state)) {
            patchBody.hasNoStoryline = state.comicEditor.hasNoStoryline
        }
        if (isHasNoTitleDirtySelector(state)) {
            patchBody.hasNoTitle = state.comicEditor.hasNoTitle
        }
        if (isHasNoTaglineDirtySelector(state)) {
            patchBody.hasNoTagline = state.comicEditor.hasNoTagline
        }

        const action = dispatch(
            comicApiSlice.endpoints.patchComic.initiate({
                comic: state.comic.current,
                body: patchBody,
            })
        )
        const result = await action
        action.reset()
        if ('error' in result) {
            return rejectWithValue(undefined)
        }
    }
)

export const comicEditorSlice = createSlice({
    name: 'comicEditor',
    initialState,
    reducers: {
        reset: (state) => {
            state.title = initialState.title
            state.tagline = initialState.tagline
            state.publishDate = initialState.publishDate
            state.isAccuratePublishDate = initialState.isAccuratePublishDate

            state.originalTitle = initialState.originalTitle
            state.originalTagline = initialState.originalTagline
            state.originalPublishDate = initialState.originalPublishDate
            state.originalIsAccuratePublishDate =
                initialState.originalIsAccuratePublishDate

            state.isGuestComic = initialState.isGuestComic
            state.isNonCanon = initialState.isNonCanon
            state.hasNoCast = initialState.hasNoCast
            state.hasNoLocation = initialState.hasNoLocation
            state.hasNoStoryline = initialState.hasNoStoryline
            state.hasNoTitle = initialState.hasNoTitle
            state.hasNoTagline = initialState.hasNoTagline

            state.originalIsGuestComic = initialState.originalIsGuestComic
            state.originalIsNonCanon = initialState.originalIsNonCanon
            state.originalHasNoCast = initialState.originalHasNoCast
            state.originalHasNoLocation = initialState.originalHasNoLocation
            state.originalHasNoStoryline = initialState.originalHasNoStoryline
            state.originalHasNoTitle = initialState.originalHasNoTitle
            state.originalHasNoTagline = initialState.originalHasNoTagline
        },
        setFromComic: (state, action: PayloadAction<PresentComic>) => {
            const comic = action.payload
            state.title = comic.title ?? ''
            state.tagline = comic.tagline ?? ''
            state.publishDate = comic.publishDate ?? ''
            state.isAccuratePublishDate = comic.isAccuratePublishDate

            state.originalTitle = comic.title ?? ''
            state.originalTagline = comic.tagline ?? ''
            state.originalPublishDate = comic.publishDate ?? ''
            state.originalIsAccuratePublishDate = comic.isAccuratePublishDate

            state.isGuestComic = comic.isGuestComic
            state.isNonCanon = comic.isNonCanon
            state.hasNoCast = comic.hasNoCast
            state.hasNoLocation = comic.hasNoLocation
            state.hasNoStoryline = comic.hasNoStoryline
            state.hasNoTitle = comic.hasNoTitle
            state.hasNoTagline = comic.hasNoTagline

            state.originalIsGuestComic = comic.isGuestComic
            state.originalIsNonCanon = comic.isNonCanon
            state.originalHasNoCast = comic.hasNoCast
            state.originalHasNoLocation = comic.hasNoLocation
            state.originalHasNoStoryline = comic.hasNoStoryline
            state.originalHasNoTitle = comic.hasNoTitle
            state.originalHasNoTagline = comic.hasNoTagline
        },
        setTitle: (state, { payload: title }: PayloadAction<string>) => {
            state.title = title
        },
        setTagline: (state, { payload: tagline }: PayloadAction<string>) => {
            state.tagline = tagline
        },
        setPublishDate: (
            state,
            { payload: publishDate }: PayloadAction<string>
        ) => {
            state.publishDate = publishDate
        },
        setIsAccuratePublishDate: (
            state,
            { payload: isAccuratePublishDate }: PayloadAction<boolean>
        ) => {
            state.isAccuratePublishDate = isAccuratePublishDate
        },
        setFlag: {
            reducer: (
                state,
                {
                    payload: { flag, value },
                }: PayloadAction<{ flag: FlagType; value: boolean }>
            ) => {
                switch (flag) {
                    case 'isGuestComic':
                        state.isGuestComic = value
                        break
                    case 'isNonCanon':
                        state.isNonCanon = value
                        break
                    case 'hasNoCast':
                        state.hasNoCast = value
                        break
                    case 'hasNoLocation':
                        state.hasNoLocation = value
                        break
                    case 'hasNoStoryline':
                        state.hasNoStoryline = value
                        break
                    case 'hasNoTitle':
                        state.hasNoTitle = value
                        break
                    case 'hasNoTagline':
                        state.hasNoTagline = value
                        break
                }
            },
            prepare: (flag: FlagType, value: boolean) => {
                return { payload: { flag, value } }
            },
        },
    },
    extraReducers: (builder) => {
        builder.addCase(saveChanges.pending, (state, _action) => {
            state.isSaving = true
        })
        builder.addCase(saveChanges.fulfilled, (state, _action) => {
            state.isSaving = false

            state.originalTitle = state.title
            state.originalTagline = state.tagline
            state.originalPublishDate = state.publishDate
            state.originalIsAccuratePublishDate = state.isAccuratePublishDate

            state.originalIsGuestComic = state.isGuestComic
            state.originalIsNonCanon = state.isNonCanon
            state.originalHasNoCast = state.hasNoCast
            state.originalHasNoLocation = state.hasNoLocation
            state.originalHasNoStoryline = state.hasNoStoryline
            state.originalHasNoTitle = state.hasNoTitle
            state.originalHasNoTagline = state.hasNoTagline
        })
        builder.addCase(saveChanges.rejected, (state, _action) => {
            state.isSaving = false
        })
    },
})

export const {
    reset,
    setFromComic,
    setTitle,
    setTagline,
    setPublishDate,
    setIsAccuratePublishDate,
    setFlag,
} = comicEditorSlice.actions

export default comicEditorSlice.reducer

export const isTitleDirtySelector = createDirtySelector(
    (state: RootState) => state.comicEditor.title,
    (state: RootState) => state.comicEditor.originalTitle
)

export const isTaglineDirtySelector = createDirtySelector(
    (state: RootState) => state.comicEditor.tagline,
    (state: RootState) => state.comicEditor.originalTagline
)

export const isPublishDateDirtySelector = createDirtySelector(
    (state: RootState) => state.comicEditor.publishDate,
    (state: RootState) => state.comicEditor.originalPublishDate
)

export const isIsAccuratePublishDateDirtySelector = createDirtySelector(
    (state: RootState) => state.comicEditor.isAccuratePublishDate,
    (state: RootState) => state.comicEditor.originalIsAccuratePublishDate
)

export const isPublishDateDataDirtySelector = createSelector(
    (state: RootState) => isPublishDateDirtySelector(state),
    (state: RootState) => isIsAccuratePublishDateDirtySelector(state),
    (isPublishDateDirty, isIsAccuratePublishDateDirty) =>
        isPublishDateDirty || isIsAccuratePublishDateDirty
)

export const isIsGuestComicDirtySelector = createDirtySelector(
    (state: RootState) => state.comicEditor.isGuestComic,
    (state: RootState) => state.comicEditor.originalIsGuestComic
)

export const isIsNonCanonDirtySelector = createDirtySelector(
    (state: RootState) => state.comicEditor.isNonCanon,
    (state: RootState) => state.comicEditor.originalIsNonCanon
)

export const isHasNoCastDirtySelector = createDirtySelector(
    (state: RootState) => state.comicEditor.hasNoCast,
    (state: RootState) => state.comicEditor.originalHasNoCast
)

export const isHasNoLocationDirtySelector = createDirtySelector(
    (state: RootState) => state.comicEditor.hasNoLocation,
    (state: RootState) => state.comicEditor.originalHasNoLocation
)

export const isHasNoStorylineDirtySelector = createDirtySelector(
    (state: RootState) => state.comicEditor.hasNoStoryline,
    (state: RootState) => state.comicEditor.originalHasNoStoryline
)

export const isHasNoTitleDirtySelector = createDirtySelector(
    (state: RootState) => state.comicEditor.hasNoTitle,
    (state: RootState) => state.comicEditor.originalHasNoTitle
)

export const isHasNoTaglineDirtySelector = createDirtySelector(
    (state: RootState) => state.comicEditor.hasNoTagline,
    (state: RootState) => state.comicEditor.originalHasNoTagline
)

export const isFlagStateDirty = createSelector(
    [
        (state: RootState) => isIsGuestComicDirtySelector(state),
        (state: RootState) => isIsNonCanonDirtySelector(state),
        (state: RootState) => isHasNoCastDirtySelector(state),
        (state: RootState) => isHasNoLocationDirtySelector(state),
        (state: RootState) => isHasNoStorylineDirtySelector(state),
        (state: RootState) => isHasNoTitleDirtySelector(state),
        (state: RootState) => isHasNoTaglineDirtySelector(state),
    ],
    (
        isGuestComicDirty,
        isNonCanonDirty,
        isHasNoCastDirty,
        isHasNoLocationDirty,
        isHasNoStorylineDirty,
        isHasNoTitleDirty,
        isHasNoTaglineDirty
    ) =>
        isGuestComicDirty ||
        isNonCanonDirty ||
        isHasNoCastDirty ||
        isHasNoLocationDirty ||
        isHasNoStorylineDirty ||
        isHasNoTitleDirty ||
        isHasNoTaglineDirty
)

export const isStateDirtySelector = createSelector(
    [
        (state: RootState) => isTitleDirtySelector(state),
        (state: RootState) => isTaglineDirtySelector(state),
        (state: RootState) => isPublishDateDataDirtySelector(state),
        (state: RootState) => isFlagStateDirty(state),
    ],
    (
        isTitleDirty,
        isTaglineDirty,
        isPublishDateDataDirty,
        isFlagStateDirty
    ) => {
        return (
            isTitleDirty ||
            isTaglineDirty ||
            isPublishDateDataDirty ||
            isFlagStateDirty
        )
    }
)
