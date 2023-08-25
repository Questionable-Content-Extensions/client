import { useState } from 'react'

import { SettingValues } from '~/settings'
import { KeyOfType } from '~/tsUtils'

import { SettingsUpdater } from '../SettingsPanel/SettingsPanel'

export default function NumberSetting({
    settings,
    setting,
    updateSettings,
    label,
    description,
    positiveOnly,
}: {
    settings: SettingValues
    setting: KeyOfType<SettingValues, number>
    updateSettings: (u: SettingsUpdater) => void
    label: string
    description: string
    positiveOnly?: boolean
}) {
    const [value, setValue] = useState(settings[setting].toString())
    const [error, setError] = useState(false)
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setValue(value)
        const parsed = Number.parseInt(value)
        if (Number.isNaN(parsed) || (positiveOnly && parsed < 0)) {
            setError(true)
            return
        }
        setError(false)
        updateSettings((u) => (u[setting] = parsed))
    }
    return (
        <div className="pt-4 border-0 border-t border-solid border-gray-200">
            <label className="flex items-center cursor-pointer">
                <div className="mr-3 text-gray-700 font-medium">{label}</div>
                <input
                    className={
                        error ? 'border border-solid border-red-600' : ''
                    }
                    type="number"
                    onChange={onChange}
                    value={value}
                />
            </label>
            <p className="text-sm">{description}</p>
        </div>
    )
}
