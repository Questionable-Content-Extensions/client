import { useState } from 'react'

import useSettings, { SettingsUpdater } from '@hooks/useSettings'
import ModalDialog from '@modals/ModalDialog'
import ToggleButton from '@widgets/ToggleButton'

import { SettingValues } from '~/settings'
import { KeyOfType } from '~/tsUtils'

export default function SettingsDialog({
    show: _show,
    onClose,
}: {
    show: boolean
    onClose: () => void
}) {
    const [settings, updateSettings] = useSettings()

    return (
        <ModalDialog
            onCloseClicked={onClose}
            header={
                <h5 className="m-0 text-xl font-medium leading-normal text-gray-800">
                    Settings
                </h5>
            }
            body={
                <div className="max-h-[50vh] overflow-y-scroll">
                    <SettingsPanel
                        settings={settings}
                        updateSettings={updateSettings}
                    />
                </div>
            }
            footer={
                <button
                    className="bg-qc-header hover:bg-qc-header-second focus:bg-qc-header-second text-white py-3 px-4 rounded-sm"
                    onClick={() => onClose()}
                >
                    Close
                </button>
            }
        />
    )
}

export function SettingsPanel({
    settings,
    updateSettings,
}: {
    settings: SettingValues
    updateSettings: (u: SettingsUpdater) => void
}) {
    return (
        <>
            <h3 className="text-lg">Navigation settings</h3>
            <ToggleSetting
                settings={settings}
                setting="scrollToTop"
                updateSettings={updateSettings}
                label="Scroll to top on navigate"
                description="Scrolls the page to the top on each navigation event."
            />
            <ToggleSetting
                settings={settings}
                setting="showAllMembers"
                updateSettings={updateSettings}
                label="Show all members"
                description={
                    'Show every cast member, storyline and location, even if they are not part of the current comic. ' +
                    'Makes no sense to enable for normal use, but can be useful if you always want to be able to find the ' +
                    'next/previous comic of any character/storyline/location.'
                }
            />
            <ToggleSetting
                settings={settings}
                setting="skipNonCanon"
                updateSettings={updateSettings}
                label="Skip non-canon strips"
                description={
                    'Skips strips that are not part of the canon. This includes guest strips, as well as ' +
                    'Yelling Bird, OMG Turkeys and other non-story comics.'
                }
            />
            <ToggleSetting
                settings={settings}
                setting="skipGuest"
                updateSettings={updateSettings}
                label="Skip guest strips"
                description={
                    'Skips strips that were not made/drawn by Jeph. This setting has no effect when "skip non-canon strips" ' +
                    'is enabled, as all guest strips are also non-canon.'
                }
            />

            <h3 className="text-lg mt-6">Display settings</h3>
            <ToggleSetting
                settings={settings}
                setting="useColors"
                updateSettings={updateSettings}
                label="Use colors"
                description={
                    'Each item can be given a color by the editors. (Most non-main items will probably be plain gray.) ' +
                    'With this setting enabled, those colors are shown in the navigation pane.'
                }
            />
            <ToggleSetting
                settings={settings}
                setting="showIndicatorRibbon"
                updateSettings={updateSettings}
                label="Show comic indicator ribbon"
                description={
                    'If a comic strip has been marked as being non-canon or a guest strip, display a ribbon with that ' +
                    'information over the top-right corner of the comic strip.'
                }
            />
            <ToggleSetting
                settings={settings}
                setting="showSmallRibbonByDefault"
                updateSettings={updateSettings}
                label="Show small indicator ribbon by default"
                description={
                    'The size of the ribbon can be changed by clicking on it. By default, it starts out in its large size, ' +
                    'but with this setting enabled, the ribbon will start out in its small size by default instead.'
                }
            />
            <ToggleSetting
                settings={settings}
                setting="useCorrectTimeFormat"
                updateSettings={updateSettings}
                label="Use 24h clock format"
                description={
                    'When showing when a comic was published (above the news section), use the 24-hour clock format.'
                }
            />
            <NumberSetting
                settings={settings}
                setting="comicLoadingIndicatorDelay"
                updateSettings={updateSettings}
                label="Comic loading indicator delay"
                description={
                    'How long to wait in milliseconds for the next comic to load before showing a loading indicator over the previous comic.'
                }
                positiveOnly
            />

            <h3 className="text-lg mt-6">Advanced settings</h3>
            <ToggleSetting
                settings={settings}
                setting="showDebugLogs"
                updateSettings={updateSettings}
                label="Enable debug logs in console"
                description={
                    'Print debugging information in the Javascript console. Useful for debugging. Changing the setting requires a page refresh to take effect.'
                }
            />
            <ToggleSetting
                settings={settings}
                setting="editMode"
                updateSettings={updateSettings}
                label="Enable editor mode"
                description={
                    'Enables features for creating and changing the navigation data, such as adding cast members. Requires a valid editor token. ' +
                    'Feel free to turn on edit mode regardless if you are curious what it is like. ' +
                    'You simply will not be able to save any changes you make.'
                }
            />
            {/* If you are supposed to have one, you do. */}
            <SecretStringSetting
                settings={settings}
                setting="editModeToken"
                updateSettings={updateSettings}
                label="Editor token"
                description={
                    'Your editor token goes here. If you are supposed to have one, you do.'
                }
            />

            <h3 className="text-lg mt-6">Appreciate my efforts?</h3>
            <div className="pt-4 pb-4 border-0 border-t border-solid border-gray-200">
                {/* eslint-disable-next-line react/jsx-no-target-blank */}
                <a
                    href="https://ko-fi.com/ilyvion"
                    target="_blank"
                    rel="noopener"
                >
                    <img
                        height="36"
                        style={{ border: '0px', height: '36px' }}
                        src="https://cdn.ko-fi.com/cdn/kofi2.png?v=3"
                        alt="Buy Me a Coffee at ko-fi.com"
                    />
                </a>
            </div>
        </>
    )
}

function ToggleSetting({
    settings,
    setting,
    updateSettings,
    label,
    description,
}: {
    settings: SettingValues
    setting: KeyOfType<SettingValues, boolean>
    updateSettings: (u: SettingsUpdater) => void
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

function NumberSetting({
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

function SecretStringSetting({
    settings,
    setting,
    updateSettings,
    label,
    description,
}: {
    settings: SettingValues
    setting: KeyOfType<SettingValues, string>
    updateSettings: (u: SettingsUpdater) => void
    label: string
    description: string
}) {
    const [blur, setBlur] = useState(!!settings[setting])
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
                    type="text"
                    onChange={onChange}
                    value={value}
                    className={
                        'w-80 text-sm transition-filter duration-500 ' +
                        (blur ? 'blur ' : 'blur-none ') +
                        (error ? 'border border-solid border-red-600' : '')
                    }
                    style={{ fontFamily: 'monospace' }}
                    readOnly={blur}
                    title={
                        blur
                            ? 'Activate focus to remove blur effect for editing'
                            : ''
                    }
                    onFocus={() => {
                        if (blur) {
                            setBlur(false)
                        }
                    }}
                />
                <button
                    className="ml-2 text-gray-600 border border-solid border-gray-400 rounded-full py-1 px-1.5"
                    onClick={() => setBlur((blur) => !blur)}
                    title={blur ? 'Remove privacy blur' : 'Apply privacy blur'}
                >
                    {blur ? (
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
