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
    orderMembersByLastAppearance: boolean
    useColors: boolean
    showItemRandomButton: boolean
    showItemChainButton: boolean

    skipNonCanon: boolean
    skipGuest: boolean

    rememberComicFilter: boolean

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [prop: string | symbol | number]: any
}

export default class Settings {
    static DEFAULTS: SettingValues = {
        showDebugLogs: false,
        scrollToTop: true,

        showAllMembers: false,
        orderMembersByLastAppearance: false,
        useColors: true,
        showItemRandomButton: false,
        showItemChainButton: false,

        skipNonCanon: false,
        skipGuest: false,

        rememberComicFilter: true,

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

        if (!loadingPromise) {
            loadingPromise = this.doLoadSettings().finally(() => {
                loadingPromise = null
            })
        }

        return loadingPromise
    }

    private static async doLoadSettings() {
        const settingsValue = await GM.getValue(
            constants.settingsKey,
            JSON.stringify(this.DEFAULTS)
        )

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
let loadingPromise: Promise<Settings> | null = null

export type SettingsUpdaterFunction = (s: SettingValues) => void
