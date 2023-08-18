import { ComicList as ComicDataListing } from '@models/ComicList'
import { ItemNavigationData } from '@models/ItemNavigationData'

import constants from '~/constants'
import { Comic as ComicData } from '~/models/Comic'
import Settings from '~/settings'
import { debug, error, fetch, info, warn } from '~/utils'

import comicService from './comicService'

let currentComicData: ComicData | null = null
let currentlyLoadingComicData: number | null = null

comicService.subscribeCurrent(comicChanged)

async function comicChanged(refresh?: boolean) {
    let currentComic = comicService.current()
    let latestComic = comicService.latest()
    if (!currentComic || !latestComic) {
        warn(
            'comicDataService notified of comic change with `null` value. Ignoring.'
        )
        return
    }
    if (!refresh) {
        info(
            'Comic changed. Loading comic data for comic #' +
                comicService.current()
        )
    } else {
        info(
            'Refresh requested. Reloading comic data for comic #' +
                comicService.current()
        )
    }
    currentlyLoadingComicData = currentComic
    notifyLoadingSubscribers(currentComic)

    const settings = Settings.get()

    let comicDataUrl = constants.comicDataUrl + currentComic
    const urlParameters: {
        token?: string
        exclude?: 'guest' | 'non-canon'
        include?: 'all'
    } = {}
    if (settings.values.editMode && settings.values.editModeToken) {
        urlParameters.token = settings.values.editModeToken
    }
    if (settings.values.skipGuest) {
        urlParameters.exclude = 'guest'
    } else if (settings.values.skipNonCanon) {
        urlParameters.exclude = 'non-canon'
    }
    if (settings.values.showAllMembers || settings.values.editMode) {
        urlParameters.include = 'all'
    }
    const urlQuery = new URLSearchParams(urlParameters).toString()
    if (urlQuery) {
        comicDataUrl += '?' + urlQuery
    }

    debug('Next comicData URL is', comicDataUrl)
    let response
    try {
        response = await fetch(comicDataUrl)
    } catch (e) {
        // TODO: Handle connection error (i.e. server down)
        // (Should probably be done using error boundaries...)
        return
    }
    if (response.status === 503) {
        // TODO: Enter Maintenance mode
        warn('Maintenance', response.responseText)
        return
    } else if (response.status !== 200) {
        error(
            `Got error when loading the comic data for ${currentComic}:`,
            response.responseText
        )
        return
    }

    const comicData = JSON.parse(response.responseText) as ComicData
    if (comicData.hasData) {
        if (comicData.next === null) {
            comicData.next =
                currentComic + 1 > latestComic ? latestComic : currentComic + 1
        }
        if (comicData.previous === null) {
            comicData.previous = currentComic - 1 < 1 ? 1 : currentComic - 1
        }

        for (const item of comicData.items) {
            fixItem(item, currentComic)
        }

        if (settings.values.showAllMembers) {
            for (const item of comicData.allItems ?? []) {
                fixItem(item, currentComic)
            }
        }
    } else {
        if (settings.values.showAllMembers) {
            for (const item of comicData.allItems ?? []) {
                fixItem(item, currentComic)
            }
        }
    }

    // TODO: Handle errors in comic data loading

    if (comicData.hasData && comicData.title) {
        document.title = `#${comicData.comic}: ${comicData.title} — Questionable Content`
    } else {
        document.title = `#${comicData.comic} — Questionable Content`
    }

    comicService.updateComicData(comicData)
    currentComicData = comicData
    currentlyLoadingComicData = null
    notifyLoadedSubscribers(currentComicData)
}

async function addItemToComic(itemId: number) {
    const settings = Settings.get()

    if (!settings.values.editMode || !settings.values.editModeToken) {
        warn(
            'Called `addItemToComic` when edit mode disabled or without edit mode token. Ignoring request.'
        )
        return
    }

    const data: {
        token: string
        comicId: number
        itemId: number
        newItemName?: string
        newItemType?: string
    } = {
        token: settings.values.editModeToken,
        comicId: comicService.current()!,
        itemId: itemId,
    }

    await makePostRequest(constants.addItemToComicUrl, data)
    refresh()
}

async function removeItemFromComic(itemId: number) {
    const settings = Settings.get()

    if (!settings.values.editMode || !settings.values.editModeToken) {
        warn(
            'Called `removeItemFromComic` when edit mode disabled or without edit mode token. Ignoring request.'
        )
        return
    }

    const data: {
        token: string
        comicId: number
        itemId: number
        newItemName?: string
        newItemType?: string
    } = {
        token: settings.values.editModeToken,
        comicId: comicService.current()!,
        itemId: itemId,
    }

    await makePostRequest(constants.removeItemFromComicUrl, data)
    refresh()
}

async function updateComicTitle(newTitle: string) {
    const settings = Settings.get()

    if (!settings.values.editMode || !settings.values.editModeToken) {
        warn(
            'Called `updateComicTitle` when edit mode disabled or without edit mode token. Ignoring request.'
        )
        return
    }

    const data: {
        token: string
        comicId: number
        title: string
    } = {
        token: settings.values.editModeToken,
        comicId: comicService.current()!,
        title: newTitle,
    }

    await makePostRequest(constants.setComicTitleUrl, data)
    refresh()
}

async function updateComicTagline(newTagline: string) {
    const settings = Settings.get()

    if (!settings.values.editMode || !settings.values.editModeToken) {
        warn(
            'Called `updateComicTagline` when edit mode disabled or without edit mode token. Ignoring request.'
        )
        return
    }

    const data: {
        token: string
        comicId: number
        tagline: string
    } = {
        token: settings.values.editModeToken,
        comicId: comicService.current()!,
        tagline: newTagline,
    }

    await makePostRequest(constants.setComicTaglineUrl, data)
    refresh()
}

async function updateComicPublishDate(
    newPublishDate: string,
    newIsAccuratePublishDate: boolean
) {
    const settings = Settings.get()

    if (!settings.values.editMode || !settings.values.editModeToken) {
        warn(
            'Called `updateComicPublishDate` when edit mode disabled or without edit mode token. Ignoring request.'
        )
        return
    }

    const data: {
        token: string
        comicId: number
        publishDate: string
        isAccuratePublishDate: boolean
    } = {
        token: settings.values.editModeToken,
        comicId: comicService.current()!,
        publishDate: newPublishDate,
        isAccuratePublishDate: newIsAccuratePublishDate,
    }

    await makePostRequest(constants.setPublishDateUrl, data)
    refresh()
}

async function updateComicFlag(comicFlag: ComicFlag, value: boolean) {
    const settings = Settings.get()

    if (!settings.values.editMode || !settings.values.editModeToken) {
        warn(
            'Called `updateComicFlag` when edit mode disabled or without edit mode token. Ignoring request.'
        )
        return
    }

    const data: {
        token: string
        comicId: number
        flagValue: boolean
    } = {
        token: settings.values.editModeToken,
        comicId: comicService.current()!,
        flagValue: value,
    }

    await makePostRequest(comicFlagToUpdateUrl(comicFlag), data)
    refresh()
}

async function makePostRequest(url: string, data: any) {
    let response
    try {
        response = await fetch(url, {
            data: JSON.stringify(data),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
        })
    } catch (e) {
        // TODO: Handle connection error (i.e. server down)
        // (Should probably be done using error boundaries...)
        return
    }
    if (response.status === 503) {
        // TODO: Enter Maintenance mode
        warn('Maintenance', response.responseText)
        return
    } else if (response.status !== 200) {
        error(
            `Got error when adding an item to the current comic:`,
            response.responseText
        )
        return
    }
}

function refresh() {
    comicChanged(true)
}

function current() {
    return currentComicData
}

function currentlyLoading() {
    return currentlyLoadingComicData
}

let comicDataLoadingSubscribers: ((comic: number) => void)[] = []

function subscribeLoading(handler: (comic: number) => void) {
    comicDataLoadingSubscribers.push(handler)
}

function unsubscribeLoading(handler: (comic: number) => void) {
    comicDataLoadingSubscribers = comicDataLoadingSubscribers.filter(
        (s) => handler !== s
    )
}

function notifyLoadingSubscribers(comic: number) {
    debug(
        'comicDataService notifying subscribers about loading new comicData',
        comic
    )
    for (const comicDataLoadingSubscriber of comicDataLoadingSubscribers) {
        comicDataLoadingSubscriber(comic)
    }
}

let comicDataLoadedSubscribers: ((comicData: ComicData) => void)[] = []

function subscribeLoaded(handler: (comicData: ComicData) => void) {
    comicDataLoadedSubscribers.push(handler)
}

function unsubscribeLoaded(handler: (comicData: ComicData) => void) {
    comicDataLoadedSubscribers = comicDataLoadedSubscribers.filter(
        (s) => handler !== s
    )
}

function notifyLoadedSubscribers(comicData: ComicData) {
    debug(
        'comicDataService notifying subscribers about new comicData',
        comicData
    )
    for (const comicDataLoadedSubscriber of comicDataLoadedSubscribers) {
        comicDataLoadedSubscriber(comicData)
    }
}

async function all() {
    const response = await fetch(constants.comicDataUrl)

    if (response.status === 503) {
        // TODO: Enter Maintenance mode
        warn('Maintenance', response.responseText)
        return
    } else if (response.status !== 200) {
        error(
            `Got error when loading the comic data for all comics:`,
            response.responseText
        )
        return
    }

    const comicData = JSON.parse(response.responseText) as ComicDataListing[]
    return comicData
}

const comicDataService = {
    refresh,
    current,
    currentlyLoading,
    subscribeLoading,
    unsubscribeLoading,
    subscribeLoaded,
    unsubscribeLoaded,
    all,

    addItemToComic,
    removeItemFromComic,
    updateComicTitle,
    updateComicTagline,
    updateComicFlag,
    updateComicPublishDate,
}
export default comicDataService

function fixItem(item: ItemNavigationData, currentComic: number) {
    // ...
    if (item.first === currentComic) {
        item.first = null
    }
    if (item.last === currentComic) {
        item.last = null
    }
}

type ComicFlag =
    | 'isGuestComic'
    | 'isNonCanon'
    | 'hasNoCast'
    | 'hasNoLocation'
    | 'hasNoStoryline'
    | 'hasNoTitle'
    | 'hasNoTagline'
function comicFlagToUpdateUrl(comicFlag: ComicFlag) {
    switch (comicFlag) {
        case 'isGuestComic':
            return constants.setGuestComicUrl
        case 'isNonCanon':
            return constants.setNonCanonUrl
        case 'hasNoCast':
            return constants.setNoCastUrl
        case 'hasNoLocation':
            return constants.setNoLocationUrl
        case 'hasNoStoryline':
            return constants.setNoStorylineUrl
        case 'hasNoTitle':
            return constants.setNoTitleUrl
        case 'hasNoTagline':
            return constants.setNoTaglineUrl
    }
}
