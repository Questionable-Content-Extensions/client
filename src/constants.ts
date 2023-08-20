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

let scriptVersion
try {
    if (typeof GM !== undefined) {
        scriptVersion = GM.info.script.version
    } else {
        scriptVersion = 'Unknown'
    }
} catch {
    scriptVersion = 'Unknown'
}

// Set this to true when working against your local test server.
// NEVER CHECK THIS FILE IN WITH forceDevelopmentMode = true!
const forceDevelopmentMode = false
const developmentMode =
    forceDevelopmentMode || scriptVersion.indexOf('+development') !== -1

const siteUrl = 'https://questionablextensions.net/' as const

function getWebserviceBaseUrl() {
    if (developmentMode) {
        return 'http://localhost:3000/api/v2/' as const
    } else {
        return `${siteUrl}api/v2/` as const
    }
}
const webserviceBaseUrl = getWebserviceBaseUrl()

const comicDataEndpoint = `comicdata/` as const
const itemDataUrl = `${webserviceBaseUrl}itemdata/` as const
const editLogUrl = `${webserviceBaseUrl}log` as const

const constants = {
    settingsKey: 'settings' as const,

    developmentMode,
    siteUrl,
    comicDataEndpoint,
    itemDataUrl,
    editLogUrl,

    // Comics after 3132 should have a tagline
    taglineThreshold: 3132 as const,

    /**
     * Don't use for anything; only here for the development mode indicator.
     * If you need a new endpoint, add it as a separate const below.
     */
    webserviceBaseUrl,

    excludedComicsEndpoint: `${comicDataEndpoint}excluded` as const,
    addItemToComicEndpoint: `${comicDataEndpoint}additem` as const,
    removeItemFromComicEndpoint: `${comicDataEndpoint}removeitem` as const,
    setComicTitleEndpoint: `${comicDataEndpoint}settitle` as const,
    setComicTaglineEndpoint: `${comicDataEndpoint}settagline` as const,
    setPublishDateEndpoint: `${comicDataEndpoint}setpublishdate` as const,
    setFlagEndpoint: `${comicDataEndpoint}setflag` as const,

    itemImageUrl: `${itemDataUrl}image/` as const,
    itemFriendDataUrl: `${itemDataUrl}friends/` as const,
    itemLocationDataUrl: `${itemDataUrl}locations/` as const,
    setItemDataPropertyUrl: `${itemDataUrl}setproperty` as const,

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
