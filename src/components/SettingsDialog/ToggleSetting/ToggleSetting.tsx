import ToggleButton from '@components/ToggleButton/ToggleButton'

import { SettingValues, SettingsUpdaterFunction } from '~/settings'
import { KeyOfType } from '~/tsUtils'

export default function ToggleSetting({
    settings,
    setting,
    updateSettings,
    label,
    description,
}: {
    settings: SettingValues
    setting: KeyOfType<SettingValues, boolean>
    updateSettings: (u: SettingsUpdaterFunction) => void
    label: string
    description: string
}) {
    return (
        <div className="pt-4 border-0 border-t border-solid border-gray-200">
            <ToggleButton
                label={label}
                checked={settings[setting]}
                onChange={(e) =>
                    updateSettings((s) => (s[setting] = e.target.checked))
                }
            />
            <p className="text-sm">{description}</p>
        </div>
    )
}
