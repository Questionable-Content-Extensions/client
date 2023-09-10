/*
 * Copyright (C) 2016-2022 Alexander Krivács Schrøder <alexschrod@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import constants from './constants'

export interface SettingValues {
    showDebugLogs: boolean
    scrollToTop: boolean

    showAllMembers: boolean
    useColors: boolean

    skipNonCanon: boolean
    skipGuest: boolean

    editMode: boolean
    editModeToken: string

    showIndicatorRibbon: boolean
    useCorrectTimeFormat: boolean
    comicLoadingIndicatorDelay: number

    subDivideGotoComics: boolean

    showTaglineAsTooltip: boolean

    /**
     * The last version seen by the change log dialog.
     * Used to know when we need to urge users to open it
     * when the script updates. */
    version: string | null

    /** deprecated; no longer in use */
    showCast: boolean
    /** deprecated; no longer in use */
    showStorylines: boolean
    /** deprecated; no longer in use */
    showLocations: boolean
    /** deprecated; no longer in use */
    showSmallRibbonByDefault: boolean
}

// This is a bit of a hack to make TypeScript happy when we do direct property
// transfer from defaults in `loadSettings()` below.
interface TransferSettings {
    [prop: string | symbol | number]: any
}

/**
 * Because we used a shim for GM4 temporarily, we should
 * load our shimmed settings when migrating, to give the
 * user a better UX.
 */
function loadFromGM4Shim(): string | null {
    const storagePrefix = GM.info.script.name.replace(/[^A-Z]*/g, '') + '-'
    function shimGetValue(aKey: string, aDefault?: string): string | null {
        const aValue = localStorage.getItem(storagePrefix + aKey)
        if (null === aValue && 'undefined' !== typeof aDefault) {
            return aDefault
        }
        return aValue
    }
    function shimDeleteValue(aKey: string): void {
        localStorage.removeItem(storagePrefix + aKey)
    }

    const shimSettings = shimGetValue(constants.settingsKey)
    if (shimSettings) {
        shimDeleteValue(constants.settingsKey)
    }
    return shimSettings
}

export class Settings {
    static DEFAULTS: SettingValues = {
        showDebugLogs: false,
        scrollToTop: true,

        showAllMembers: false,
        useColors: true,

        skipNonCanon: false,
        skipGuest: false,

        editMode: false,
        editModeToken: '',

        showIndicatorRibbon: true,
        useCorrectTimeFormat: true,
        comicLoadingIndicatorDelay: 2000,

        subDivideGotoComics: true,

        showTaglineAsTooltip: true,

        version: null,

        // DEPRECATED:

        showCast: true,
        showStorylines: true,
        showLocations: true,
        showSmallRibbonByDefault: false,
    }

    values: SettingValues

    constructor(values: SettingValues) {
        this.values = values
    }

    static async loadSettings() {
        if (instance) {
            return instance
        }

        const shimSettings = loadFromGM4Shim()
        const settingsValue = shimSettings
            ? shimSettings
            : ((await GM.getValue(
                  constants.settingsKey,
                  JSON.stringify(this.DEFAULTS)
              )) as string)

        const settings = JSON.parse(settingsValue) as SettingValues

        // This makes sure that when new settings are added, users will
        // automatically receive the default values for those new settings when
        // they update.
        for (const prop in this.DEFAULTS) {
            if (!(prop in settings)) {
                ;(settings as SettingValues & TransferSettings)[prop] = (
                    this.DEFAULTS as SettingValues & TransferSettings
                )[prop]
            }
        }

        instance = new Settings(settings)
        return instance
    }

    /*
     * Since `loadSettings()` is called before anything else in the user script
     * gets to run, we can assume `instance` is always non-null.
     */
    static get() {
        return instance as Settings
    }

    async saveSettings() {
        await GM.setValue(constants.settingsKey, JSON.stringify(this.values))
    }
}

let instance: Settings | null = null

export default Settings

export type SettingsUpdaterFunction = (s: SettingValues) => void
