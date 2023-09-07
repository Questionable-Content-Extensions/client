/*
 * Copyright (C) 2016-2019 Alexander Krivács Schrøder <alexschrod@gmail.com>
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

/**
 * This will be false in test environments like storybook and unit testing,
 * which lets us avoid trying access GM.* in those cases.
 */
export const HAS_GREASEMONKEY = typeof GM !== 'undefined'

let scriptVersion
try {
    if (HAS_GREASEMONKEY) {
        scriptVersion = GM.info.script.version
    } else {
        scriptVersion = 'Unknown+development' as const
    }
} catch {
    scriptVersion = 'Unknown+development' as const
}

// Set this to true when testing a production build of a script
// against your local test server. The development builds will automatically
// pick development mode due to the version check below.
//
// NEVER CHECK THIS FILE IN WITH forceDevelopmentMode = true!
const forceDevelopmentMode = false
const developmentMode =
    forceDevelopmentMode || scriptVersion.indexOf('+development') !== -1

const siteUrl = 'https://questionablextensions.net/' as const
const developmentBaseUrl = 'http://localhost:3000/api/v2/' as const

function getWebserviceBaseUrl() {
    if (developmentMode) {
        return developmentBaseUrl
    } else {
        return `${siteUrl}api/v2/` as const
    }
}
const webserviceBaseUrl = getWebserviceBaseUrl()

const comicDataEndpoint = `comicdata/` as const
const itemDataEndpoint = `itemdata/` as const
const editLogEndpoint = `log/` as const

const constants = {
    settingsKey: 'settings' as const,

    scriptVersion,

    siteUrl,
    developmentBaseUrl,
    developmentMode,
    comicDataEndpoint,
    itemDataEndpoint,
    editLogEndpoint,

    // Comics after 3132 should have a tagline
    taglineThreshold: 3132 as const,

    /**
     * Don't use for anything; only here for the development mode indicator.
     * If you need a new endpoint, add it as a separate const below.
     */
    webserviceBaseUrl,

    excludedComicsEndpoint: `${comicDataEndpoint}excluded` as const,
    addItemToComicEndpoint: `${comicDataEndpoint}additem` as const,
    addItemsToComicEndpoint: `${comicDataEndpoint}additems` as const,
    removeItemFromComicEndpoint: `${comicDataEndpoint}removeitem` as const,

    itemImageEndpoint: `${itemDataEndpoint}image/` as const,
    itemFriendDataEndpoint: `${itemDataEndpoint}friends/` as const,
    itemLocationDataEndpoint: `${itemDataEndpoint}locations/` as const,

    comicExtensions: ['png' as const, 'gif' as const, 'jpg' as const] as const,

    comicdataLoadingEvent: 'comicdata-loading' as const,
    comicdataLoadedEvent: 'comicdata-loaded' as const,
    comicdataErrorEvent: 'comicdata-error' as const,

    itemdataLoadingEvent: 'itemdata-loading' as const,
    itemdataLoadedEvent: 'itemdata-loaded' as const,
    itemdataErrorEvent: 'itemdata-error' as const,

    itemsChangedEvent: 'items-changed' as const,

    maintenanceEvent: 'maintenance' as const,

    messages: {
        maintenance:
            'The Questionable Extensions server is currently undergoing maintenance. Normal operation should resume within a few minutes.' as const,
    },
} as const

export default constants
