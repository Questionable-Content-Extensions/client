import { ComicId } from '@models/ComicId'
import { ItemId } from '@models/ItemId'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface DialogState {
    showGoToComicDialog: boolean
    showSettingsDialog: boolean
    showItemDetailsDialogFor: number | null
    showCopyItemsDialogFor: number | null
    showEditLogDialogFor: ComicId | boolean
}

const initialState: DialogState = {
    showGoToComicDialog: false,
    showSettingsDialog: false,
    showItemDetailsDialogFor: null,
    showCopyItemsDialogFor: null,
    showEditLogDialogFor: false,
}

export const dialogSlice = createSlice({
    name: 'dialog',
    initialState,
    reducers: {
        setShowGoToComicDialog: (
            state,
            { payload: showGoToComicDialog }: PayloadAction<boolean>
        ) => {
            state.showGoToComicDialog = showGoToComicDialog
        },
        setShowSettingsDialog: (
            state,
            { payload: showSettingsDialog }: PayloadAction<boolean>
        ) => {
            state.showSettingsDialog = showSettingsDialog
        },
        setShowItemDetailsDialogFor: (
            state,
            { payload: showItemDetailsDialogFor }: PayloadAction<ItemId | null>
        ) => {
            state.showItemDetailsDialogFor = showItemDetailsDialogFor
        },
        setShowCopyItemsDialog: (
            state,
            { payload: showCopyItemsDialog }: PayloadAction<ComicId | null>
        ) => {
            state.showCopyItemsDialogFor = showCopyItemsDialog
        },
        setShowEditLogDialog: (
            state,
            { payload: showEditLogDialog }: PayloadAction<ComicId | boolean>
        ) => {
            state.showEditLogDialogFor = showEditLogDialog
        },
    },
})

export default dialogSlice.reducer

export const {
    setShowGoToComicDialog,
    setShowSettingsDialog,
    setShowItemDetailsDialogFor,
    setShowCopyItemsDialog,
    setShowEditLogDialog,
} = dialogSlice.actions
