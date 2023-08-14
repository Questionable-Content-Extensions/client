import { debug } from '~/utils'

let currentComic: number | null = null
let latestComic: number | null = null
let randomComic: number | null = null

function current(): number | null {
    return currentComic
}

function previous(): number | null {
    if (currentComic === null) {
        return null
    }

    return currentComic > 1 ? currentComic - 1 : currentComic
}

function next(): number | null {
    if (currentComic === null || latestComic === null) {
        return null
    }

    return currentComic < latestComic ? currentComic + 1 : currentComic
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
    notifySubscribers()
}

function setLatestComic(comic: number) {
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

function subscribe(handler: () => void) {
    comicServiceSubscribers.push(handler)
}

function unsubscribe(handler: () => void) {
    comicServiceSubscribers = comicServiceSubscribers.filter(
        (s) => handler !== s
    )
}

function notifySubscribers() {
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

const comicService = {
    current,
    previous,
    next,
    latest,
    random,
    setCurrentComic,
    setNext,
    setPrevious,
    setLatestComic,
    setLatest,
    setRandom,
    subscribe,
    unsubscribe,
}

export default comicService

// TODO: Filter based on excluded comics (guest or non-canon)
function nextRandomComic() {
    if (latestComic === null) {
        return null
    }
    let newRandomComic = currentComic
    while (newRandomComic === currentComic) {
        newRandomComic = Math.floor(Math.random() * (latestComic + 1))
    }
    return newRandomComic
}

// Handle popstate events to go back to previous comics that were
// added using pushState/replaceState above
window.addEventListener('popstate', (event) => {
    let state = event.state as { comic: number } | undefined
    if (state && state.comic) {
        setCurrentComic(state.comic, false)
    }
})

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
