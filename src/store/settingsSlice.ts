import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import Settings, { SettingValues } from '~/settings'

interface SettingsState {
    values: SettingValues | null
    isLoading: boolean
    isSaving: boolean
}

const initialState: SettingsState = {
    values: null,
    isLoading: false,
    isSaving: false,
}

export const loadSettings = createAsyncThunk<SettingValues, void>(
    'settings/load',
    async () => (await Settings.loadSettings()).values
)

export const updateSettings = createAsyncThunk<SettingValues, SettingValues>(
    'settings/save',
    async (values) => {
        const settings = Settings.get()
        settings.values = values
        await settings.saveSettings()
        return settings.values
    }
)

export const settingSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(loadSettings.pending, (state) => {
            state.isLoading = true
        })
        builder.addCase(loadSettings.fulfilled, (state, action) => {
            state.values = action.payload
            state.isLoading = false
        })

        builder.addCase(updateSettings.pending, (state) => {
            state.isSaving = true
        })
        builder.addCase(updateSettings.fulfilled, (state, action) => {
            state.isSaving = false
            state.values = action.payload
        })
    },
})

export default settingSlice.reducer