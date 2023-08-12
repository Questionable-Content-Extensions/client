import { useEffect, useState } from 'react'

import settingsService from '@services/settingsService'

import { SettingValues } from '~/settings'

export type SettingsUpdater = (s: SettingValues) => void
export type UpdateSettings = (u: SettingsUpdater) => void

export default function useSettings(): [SettingValues, UpdateSettings] {
    let [settings, setSettings] = useState(settingsService.get().values)
    useEffect(() => {
        function handleSettingsChanged() {
            setSettings(settingsService.get().values)
        }
        settingsService.subscribeChanged(handleSettingsChanged)
        return () => {
            settingsService.unsubscribeChanged(handleSettingsChanged)
        }
    }, [])
    async function updateSettings(updater: SettingsUpdater) {
        const values = settingsService.get().values
        updater(values)
        // We need to make a whole new object here, or React won't be able
        // to tell that something actually changed. Yay flaky behavior!
        settingsService.get().values = { ...values }
        await settingsService.get().saveSettings()
        settingsService.notifySubscribers()
    }
    return [settings, updateSettings]
}
