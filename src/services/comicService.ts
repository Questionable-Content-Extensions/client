import { ComicList as ComicDataListing } from '@models/ComicList'

import constants from '~/constants'
import { Comic as ComicData } from '~/models/Comic'
import Settings from '~/settings'
import { debug, error, fetch, warn } from '~/utils'

let currentComic: number | null = null
let latestComic: number | null = null
let randomComic: number | null = null

let comicData: ComicData | null = null

function current(): number | null {
    return currentComic
}

function previous(): number | null {
    if (currentComic === null) {
        return null
    }
    if (comicData === null || !comicData.hasData) {
        return currentComic > 1 ? currentComic - 1 : currentComic
    } else {
        return comicData.previous
    }
}

function next(): number | null {
    if (currentComic === null || latestComic === null) {
        return null
    }
    if (comicData === null || !comicData.hasData) {
        return currentComic < latestComic ? currentComic + 1 : currentComic
    } else {
        return comicData.next
    }
}

function latest(): number | null {
    return latestComic
}

function setPrevious() {
    setCurrentComic(previous() as number)
}

function setNext() {
    setCurrentComic(next() as number)
}

function setLatest() {
    setCurrentComic(latestComic as number)
}

function setCurrentComic(comic: number, updateHistory: boolean = true) {
    if (updateHistory) {
        if (currentComic === null) {
            window.history.replaceState(
                { comic },
                '',
                '/view.php?comic=' + comic
            )
        } else {
            window.history.pushState({ comic }, '', '/view.php?comic=' + comic)
        }
    }
    currentComic = comic
    comicData = null
    notifyCurrentSubscribers()
}

function updateComicData(data: ComicData) {
    comicData = data
    notifyNavigationSubscribers()
}

function updateLatestComic(comic: number) {
    latestComic = comic
}

function random(): number | null {
    if (randomComic === null) {
        randomComic = nextRandomComic()
    }

    return randomComic
}

function setRandom() {
    setCurrentComic(randomComic as number)
}

let comicServiceSubscribers: (() => void)[] = []

function subscribeCurrent(handler: () => void) {
    comicServiceSubscribers.push(handler)
}

function unsubscribeCurrent(handler: () => void) {
    comicServiceSubscribers = comicServiceSubscribers.filter(
        (s) => handler !== s
    )
}

function notifyCurrentSubscribers() {
    // Make sure current comic hasn't suddenly become the same as the random comic.
    // If it has, we change the random one to something else.
    if (currentComic === randomComic) {
        randomComic = nextRandomComic()
    }

    debug(
        'comicService notifying subscribers about new currentComic',
        currentComic
    )
    for (const currentComicSubscriber of comicServiceSubscribers) {
        currentComicSubscriber()
    }
}

let comicServiceNavigationSubscribers: (() => void)[] = []

function subscribeNavigation(handler: () => void) {
    comicServiceNavigationSubscribers.push(handler)
}

function unsubscribeNavigation(handler: () => void) {
    comicServiceNavigationSubscribers =
        comicServiceNavigationSubscribers.filter((s) => handler !== s)
}

function notifyNavigationSubscribers() {
    debug(
        'comicService notifying subscribers about new randomComic',
        randomComic
    )
    for (const randomComicSubscriber of comicServiceNavigationSubscribers) {
        randomComicSubscriber()
    }
}

const comicService = {
    current,
    previous,
    next,
    latest,
    random,
    setCurrentComic,
    setNext,
    setPrevious,
    updateLatestComic,
    setLatest,
    setRandom,
    subscribeCurrent,
    unsubscribeCurrent,
    subscribeNavigation,
    unsubscribeNavigation,
    updateComicData,
}

export default comicService

function nextRandomComic() {
    if (latestComic === null) {
        return null
    }

    const settings = Settings.get()
    if (settings.values.skipGuest || settings.values.skipNonCanon) {
        fetchNextFilteredRandomComic()
    }

    let newRandomComic = currentComic
    while (newRandomComic === currentComic) {
        newRandomComic = Math.floor(Math.random() * (latestComic + 1))
    }
    return newRandomComic
}

async function fetchNextFilteredRandomComic() {
    const settings = Settings.get()

    let excludedComicsUrl = constants.excludedComicsUrl
    const urlParameters: { exclusion?: 'guest' | 'non-canon' } = {}
    if (settings.values.skipGuest) {
        urlParameters.exclusion = 'guest'
    } else if (settings.values.skipNonCanon) {
        urlParameters.exclusion = 'non-canon'
    }
    const urlQuery = new URLSearchParams(urlParameters).toString()
    if (urlQuery) {
        excludedComicsUrl += '?' + urlQuery
    }

    let response
    try {
        response = await fetch(excludedComicsUrl)
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
            `Got error when loading the excluded comic data:`,
            response.responseText
        )
        return
    }

    const excludedComics = (
        JSON.parse(response.responseText) as ComicDataListing[]
    ).map((c) => c.comic)

    let newRandomComic = currentComic
    while (
        newRandomComic === currentComic ||
        (newRandomComic && excludedComics.includes(newRandomComic))
    ) {
        newRandomComic = Math.floor(Math.random() * (latestComic! + 1))
    }
    randomComic = newRandomComic
    notifyNavigationSubscribers()
}

// Handle popstate events to go back to previous comics that were
// added using pushState/replaceState above
window.addEventListener('popstate', (event) => {
    let state = event.state as { comic: number } | undefined
    if (state && state.comic) {
        setCurrentComic(state.comic, false)
    }
})

try {
    if (typeof unsafeWindow !== undefined) {
        const shortcut = (unsafeWindow as any).shortcut

        console.debug('Removing Left')
        shortcut.remove('Left')
        console.debug('Removing Right')
        shortcut.remove('Right')

        const disable_in_input = createObjectIn<any>(unsafeWindow)
        disable_in_input.disable_in_input = true

        console.debug('Adding Left')
        shortcut.add(
            'Left',
            exportFunction(() => setPrevious(), unsafeWindow),
            disable_in_input
        )
        shortcut.add(
            'Alt+Left',
            exportFunction(() => setPrevious(), unsafeWindow)
        )

        console.debug('Adding Right')
        shortcut.add(
            'Right',
            exportFunction(() => setNext(), unsafeWindow),
            disable_in_input
        )
        shortcut.add(
            'Alt+Right',
            exportFunction(() => setNext(), unsafeWindow)
        )

        console.debug('Adding Q')
        shortcut.add(
            'Q',
            exportFunction(function () {
                // TODO
                // if (settings.values.editMode) {
                //     $('input[id^="addItem"]').focus()
                // }
            }, unsafeWindow),
            disable_in_input
        )
    }
} catch (ex) {
    if (ex !== 'ReferenceError: unsafeWindow is not defined') {
        console.error(ex)
    }
}
