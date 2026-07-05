import { ComicId } from '@models/ComicId'
import { ItemId } from '@models/ItemId'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export type EditLogDialogTarget =
    { kind: 'closed' } | { kind: 'all' } | { kind: 'comic'; comicId: ComicId }

interface DialogState {
    showGoToComicDialog: boolean
    showSettingsDialog: boolean
    showItemDetailsDialogFor: number | null
    showCopyItemsDialogFor: number | null
    showEditLogDialogFor: EditLogDialogTarget
    showChangeLogDialog: boolean
    showAddAdvanceComicDialog: boolean
}

const initialState: DialogState = {
    showGoToComicDialog: false,
    showSettingsDialog: false,
    showItemDetailsDialogFor: null,
    showCopyItemsDialogFor: null,
    showEditLogDialogFor: { kind: 'closed' },
    showChangeLogDialog: false,
    showAddAdvanceComicDialog: false,
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
            { payload: showEditLogDialog }: PayloadAction<EditLogDialogTarget>
        ) => {
            state.showEditLogDialogFor = showEditLogDialog
        },
        setShowChangeLogDialog: (
            state,
            { payload: showChangeLogDialog }: PayloadAction<boolean>
        ) => {
            state.showChangeLogDialog = showChangeLogDialog
        },
        setShowAddAdvanceComicDialog: (
            state,
            { payload: showAddAdvanceComicDialog }: PayloadAction<boolean>
        ) => {
            state.showAddAdvanceComicDialog = showAddAdvanceComicDialog
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
    setShowChangeLogDialog,
    setShowAddAdvanceComicDialog,
} = dialogSlice.actions
