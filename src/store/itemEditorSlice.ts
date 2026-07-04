import { Item } from '@models/Item'
import { ItemType } from '@models/ItemType'
import { PatchItemBody } from '@models/PatchItemBody'
import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit'

import { itemApiSlice } from './api/itemApiSlice'
import createAppAsyncThunk from './createAppAsyncThunk'
import { createDirtySelector } from './createDirtySelector'
import { RootState } from './store'

interface ItemEditorDataSlice {
    id: number

    name: string
    shortName: string
    color: string
    type: ItemType
    startComicId: number
    endComicId: number | null

    originalName: string
    originalShortName: string
    originalColor: string
    originalType: ItemType
    originalStartComicId: number
    originalEndComicId: number | null

    isSaving: boolean
}

const initialState: ItemEditorDataSlice = {
    id: 0,

    name: '',
    shortName: '',
    color: '',
    type: 'cast',
    startComicId: 0,
    endComicId: null,

    originalName: '',
    originalShortName: '',
    originalColor: '',
    originalType: 'cast',
    originalStartComicId: 0,
    originalEndComicId: null,

    isSaving: false,
}

export const saveChanges = createAppAsyncThunk(
    'itemEditor/saveChanges',
    async (item, { dispatch, getState, rejectWithValue }) => {
        const state = getState()

        const patchBody: PatchItemBody = {}

        if (isNameDirtySelector(state)) {
            patchBody.name = state.itemEditor.name
        }
        if (isShortNameDirtySelector(state)) {
            patchBody.shortName = state.itemEditor.shortName
        }
        if (isColorDirtySelector(state)) {
            patchBody.color = state.itemEditor.color
        }
        if (isTypeDirtySelector(state)) {
            patchBody.type = state.itemEditor.type
        }
        if (isStartComicIdDirtySelector(state)) {
            patchBody.startComicId = state.itemEditor.startComicId
        }
        if (isEndComicIdDirtySelector(state)) {
            patchBody.endComicId = state.itemEditor.endComicId
        }

        const action = dispatch(
            itemApiSlice.endpoints.patchItem.initiate({
                item: state.itemEditor.id,
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

export const itemEditorSlice = createSlice({
    name: 'itemEditor',
    initialState,
    reducers: {
        reset: (state) => {
            state.id = initialState.id

            state.name = initialState.name
            state.shortName = initialState.shortName
            state.color = initialState.color
            state.type = initialState.type
            state.startComicId = initialState.startComicId
            state.endComicId = initialState.endComicId

            state.originalName = initialState.originalName
            state.originalShortName = initialState.originalShortName
            state.originalColor = initialState.originalColor
            state.originalType = initialState.type
            state.originalStartComicId = initialState.originalStartComicId
            state.originalEndComicId = initialState.originalEndComicId
        },
        setFromItem: (state, action: PayloadAction<Item>) => {
            const item = action.payload

            state.id = item.id

            state.name = item.name
            state.shortName = item.shortName
            state.color = item.color
            state.type = item.type
            state.startComicId = item.startComicId ?? initialState.startComicId
            state.endComicId = item.endComicId ?? initialState.endComicId

            state.originalName = item.name
            state.originalShortName = item.shortName
            state.originalColor = item.color
            state.originalType = item.type
            state.originalStartComicId = state.startComicId
            state.originalEndComicId = state.endComicId
        },
        setName: (state, { payload: name }: PayloadAction<string>) => {
            state.name = name
        },
        setShortName: (
            state,
            { payload: shortName }: PayloadAction<string>
        ) => {
            state.shortName = shortName
        },
        setColor: (state, { payload: color }: PayloadAction<string>) => {
            state.color = color
        },
        setType: (state, { payload: type }: PayloadAction<ItemType>) => {
            state.type = type
        },
        setStartComicId: (
            state,
            { payload: startComicId }: PayloadAction<number>
        ) => {
            state.startComicId = startComicId
        },
        setEndComicId: (
            state,
            { payload: endComicId }: PayloadAction<number | null>
        ) => {
            state.endComicId = endComicId
        },
    },
    extraReducers: (builder) => {
        builder.addCase(saveChanges.pending, (state, _action) => {
            state.isSaving = true
        })
        builder.addCase(saveChanges.fulfilled, (state, _action) => {
            state.isSaving = false

            state.originalName = state.name
            state.originalShortName = state.shortName
            state.originalColor = state.color
            state.originalType = state.type
            state.originalStartComicId = state.startComicId
            state.originalEndComicId = state.endComicId
        })
        builder.addCase(saveChanges.rejected, (state, _action) => {
            state.isSaving = false
        })
    },
})

export const {
    reset,
    setFromItem,
    setName,
    setShortName,
    setColor,
    setType,
    setStartComicId,
    setEndComicId,
} = itemEditorSlice.actions

export default itemEditorSlice.reducer

export const isNameDirtySelector = createDirtySelector(
    (state: RootState) => state.itemEditor.name,
    (state: RootState) => state.itemEditor.originalName
)

export const isShortNameDirtySelector = createDirtySelector(
    (state: RootState) => state.itemEditor.shortName,
    (state: RootState) => state.itemEditor.originalShortName
)

export const isColorDirtySelector = createDirtySelector(
    (state: RootState) => state.itemEditor.color,
    (state: RootState) => state.itemEditor.originalColor
)

export const isTypeDirtySelector = createDirtySelector(
    (state: RootState) => state.itemEditor.type,
    (state: RootState) => state.itemEditor.originalType
)

export const isStartComicIdDirtySelector = createDirtySelector(
    (state: RootState) => state.itemEditor.startComicId,
    (state: RootState) => state.itemEditor.originalStartComicId
)

export const isEndComicIdDirtySelector = createDirtySelector(
    (state: RootState) => state.itemEditor.endComicId,
    (state: RootState) => state.itemEditor.originalEndComicId
)

export const isStateDirtySelector = createSelector(
    [
        (state: RootState) => isNameDirtySelector(state),
        (state: RootState) => isShortNameDirtySelector(state),
        (state: RootState) => isColorDirtySelector(state),
        (state: RootState) => isTypeDirtySelector(state),
        (state: RootState) => isStartComicIdDirtySelector(state),
        (state: RootState) => isEndComicIdDirtySelector(state),
    ],
    (
        isNameDirty,
        isShortNameDirty,
        isColorDirty,
        isTypeDirty,
        isStartComicIdDirty,
        isEndComicIdDirty
    ) => {
        return (
            isNameDirty ||
            isShortNameDirty ||
            isColorDirty ||
            isTypeDirty ||
            isStartComicIdDirty ||
            isEndComicIdDirty
        )
    }
)
