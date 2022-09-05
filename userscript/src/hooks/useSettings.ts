import { useEffect, useState } from 'react'
import settingsService from '../services/settingsService'
import Settings from '../settings'

type SettingsUpdater = (s: Settings) => void
type UpdateSettings = (u: SettingsUpdater) => void

export default function useSettings(): [Settings, UpdateSettings] {
    let [settings, setSettings] = useState(settingsService.get() as Settings)
    useEffect(() => {
        function handleSettingsChanged() {
            setSettings(settingsService.get() as Settings)
        }
        settingsService.subscribeChanged(handleSettingsChanged)
        return () => {
            settingsService.unsubscribeChanged(handleSettingsChanged)
        }
    }, [])
    async function updateSettings(updater: SettingsUpdater) {
        updater(settings)
        await settings.saveSettings()
        settingsService.notifySubscribers()
    }
    return [settings, updateSettings]
}
