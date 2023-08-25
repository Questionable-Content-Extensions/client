import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface DialogState {
    showGoToComicDialog: boolean
    showSettingsDialog: boolean
    showItemDetailsDialogFor: number | null
}

const initialState: DialogState = {
    showGoToComicDialog: false,
    showSettingsDialog: false,
    showItemDetailsDialogFor: null,
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
            { payload: showItemDetailsDialogFor }: PayloadAction<number | null>
        ) => {
            state.showItemDetailsDialogFor = showItemDetailsDialogFor
        },
    },
})

export default dialogSlice.reducer

export const {
    setShowGoToComicDialog,
    setShowSettingsDialog,
    setShowItemDetailsDialogFor,
} = dialogSlice.actions
