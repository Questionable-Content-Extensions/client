import { SettingValues, SettingsUpdaterFunction } from '~/settings'

import NumberSetting from '../NumberSetting/NumberSetting'
import SecretStringSetting from '../SecretStringSetting/SecretStringSetting'
import ToggleSetting from '../ToggleSetting/ToggleSetting'

export default function SettingsPanel({
    settings,
    updateSettings,
}: {
    settings: SettingValues
    updateSettings: (u: SettingsUpdaterFunction) => void
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
                    'next/previous comic of any character/storyline/location. When editor mode is enabled, this setting gets ' +
                    "treated like it's enabled, as an editor needs a list of all the cast to do their job effectively."
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
                setting="showTaglineAsTooltip"
                updateSettings={updateSettings}
                label="Show tagline as comic tooltip"
                description={
                    'When this setting is enabled and the currently shown comic strip has a tagline, its tagline will ' +
                    "become the comic strip's tooltip."
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
            <ToggleSetting
                settings={settings}
                setting="subDivideGotoComics"
                updateSettings={updateSettings}
                label="Sub-divide comic listing"
                description={
                    "In the 'Go to comic' dialog and other locations where " +
                    'comics are listed, when this setting is enabled, comics ' +
                    'get grouped by which set of 1000 and which set of 100 ' +
                    'they belong to. If the setting is disabled, the comics ' +
                    'are listed in one long list.'
                }
            />

            <h3 className="text-lg mt-6">Advanced settings</h3>
            <ToggleSetting
                settings={settings}
                setting="showDebugLogs"
                updateSettings={updateSettings}
                label="Enable debug logs in console"
                description={
                    'Print debugging information in the Javascript console. Useful for debugging. ' +
                    'If you discover a bug in the script, it is helpful if you include the log with this setting enabled in your bug report.'
                }
            />
            <ToggleSetting
                settings={settings}
                setting="editMode"
                updateSettings={updateSettings}
                label="Enable editor mode"
                description={
                    'Enables features for creating and changing the navigation data, such as adding cast members. Requires a valid editor token. ' +
                    'Feel free to turn on edit mode regardless if you are curious what it is like.'
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
