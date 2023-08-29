import { useState } from 'react'

import { SettingValues, SettingsUpdaterFunction } from '~/settings'
import { KeyOfType } from '~/tsUtils'

export default function SecretStringSetting({
    settings,
    setting,
    updateSettings,
    label,
    description,
}: {
    settings: SettingValues
    setting: KeyOfType<SettingValues, string>
    updateSettings: (u: SettingsUpdaterFunction) => void
    label: string
    description: string
}) {
    const [hidden, setHidden] = useState(!!settings[setting])
    const [value, setValue] = useState(settings[setting].toString())
    const [error, setError] = useState(false)
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setValue(value)
        if (
            value &&
            !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
                value
            )
        ) {
            setError(true)
            return
        }
        setError(false)
        updateSettings((u) => (u[setting] = e.target.value))
    }
    return (
        <div className="pt-4 border-0 border-t border-solid border-gray-200">
            <label className="flex items-center cursor-pointer">
                <div className="mr-3 text-gray-700 font-medium">{label}</div>
                <input
                    type={hidden ? 'password' : 'text'}
                    onChange={onChange}
                    value={value}
                    className={
                        'w-80 text-sm transition-filter duration-500 ' +
                        (error ? 'border border-solid border-red-600' : '')
                    }
                    style={{ fontFamily: 'monospace' }}
                    onFocus={() => {
                        if (hidden) {
                            setHidden(false)
                        }
                    }}
                />
                <button
                    className="ml-2 text-gray-600 border border-solid border-gray-400 rounded-full py-1 px-1.5"
                    onClick={() => setHidden((blur) => !blur)}
                    title={hidden ? 'Show token' : 'Hide token'}
                >
                    {hidden ? (
                        <i className="fa fa-eye" aria-hidden="true"></i>
                    ) : (
                        <i className="fa fa-eye-slash" aria-hidden="true"></i>
                    )}
                </button>
            </label>
            <p className="text-sm">{description}</p>
        </div>
    )
}
