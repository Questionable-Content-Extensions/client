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
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'

import './index.css'
import 'react-toastify/dist/ReactToastify.min.css'

import Comic from '@components/Comic/Comic'
import ComicDetailsPanel from '@components/ComicDetailsPanel/ComicDetailsPanel'
import ComicNavigation from '@components/ComicNavigation'
import ComicTitle from '@components/ComicTitle'
import DateComponent from '@components/Date/Date'
import DebugLoadErrorPanel from '@components/DebugLoadErrorPanel'
import EditorModePanel from '@components/EditorModePanel/EditorModePanel'
import News from '@components/News'
import Portals from '@components/Portals'
import { hydrateItemData } from '@hooks/useHydratedItemData'
import { ComicId } from '@models/ComicId'
import { HydratedItemNavigationData } from '@models/HydratedItemData'
import { ItemId } from '@models/ItemId'
import {
    comicApiSlice,
    nextComicSelector,
    previousComicSelector,
    toGetDataQueryArgs,
} from '@store/api/comicApiSlice'
import { itemApiSlice } from '@store/api/itemApiSlice'
import { setCurrentComic, setLatestComic } from '@store/comicSlice'
import { loadSettings } from '@store/settingsSlice'

import Settings from '~/settings'
import store, { AppDispatch, RootState } from '~/store/store'
import { awaitElement, debug, error, fetch, info, qcBug, setup } from '~/utils'

import { BODY_CONTAINER_ID, PORTAL_CONTAINER_ID } from './shared'

const QcStrictMode = React.StrictMode
// React.StrictMode causes errors in Chromium; set to some innocent element
// type instead when debugging in Chrome:
//const QcStrictMode = React.Fragment

const QC_EXT_CLASSNAME = 'qc-ext'
const NAVIGATION_CONTAINER_CLASSNAME = 'qc-ext-navigation-container'

async function main() {
    // HACK: Webpack CSS hack. See ./global.d.ts and ../build.js for more details.
    if (window.qcExtBuiltCss) {
        var style = document.createElement('style')
        style.innerHTML = window.qcExtBuiltCss
        document.head.appendChild(style)
    }

    await Settings.loadSettings()
    setup()
    store.dispatch(loadSettings())

    info('Running QC Extensions v' + GM.info.script.version)

    const currentComic = await initializeComic()
    if (!currentComic) {
        return
    }

    const latestComic = await getLatestComic(currentComic)
    if (!latestComic) {
        return
    }

    store.dispatch(setCurrentComic(currentComic))
    store.dispatch(setLatestComic(latestComic))

    // Handle popstate events to go back to previous comics that were
    // added using pushState/replaceState above
    window.addEventListener('popstate', (event) => {
        let state = event.state as
            | { comic: number; lockedToItem: ItemId | null }
            | undefined
        if (state && state.comic) {
            if (state.lockedToItem) {
                const storeState = store.getState()
                if (storeState.comic.lockedToItem === state.lockedToItem) {
                    store.dispatch(
                        setCurrentComic(state.comic, {
                            locked: true,
                            poppedState: true,
                        })
                    )
                    return
                }
            }
            store.dispatch(
                setCurrentComic(state.comic, {
                    locked: false,
                    poppedState: true,
                })
            )
        }
    })

    hijackShortcut()

    encaseBody()
    initializePortal()
    initializeComicNavigation()
    initializeDateAndNews()
    initializeExtraNavigation()
}

async function developmentMain() {
    await Settings.loadSettings()
    setup()

    const scriptUrl = 'http://localhost:8124/static/js/main.js'
    info(
        'Running QC Extensions in development mode. Fetching most recent script from ' +
            scriptUrl
    )

    fetch('http://localhost:8124/static/js/main.js')
        .then((response) => {
            info('Script is fetched. Handing control over.')

            // Ensure that when the fetched script runs, it doesn't keep trying to fetch and run itself.
            window.__QC_EXT_DEVELOPMENT_LOADED = true
            // eslint-disable-next-line no-eval
            eval(response.responseText)
        })
        .catch((response) => {
            if (response.status === 0) {
                error('Could not fetch script. Are you running `npm start`?')
                initializeDebugError()
            } else {
                error(
                    'Could not fetch script. See response error object for potential clues.',
                    response
                )
            }
        })
}

const scriptVersion = GM.info.script.version
if (
    scriptVersion.indexOf('+development') !== -1 &&
    !window.__QC_EXT_DEVELOPMENT_LOADED
) {
    developmentMain()
} else {
    main().catch((e) => {
        error(
            'There is a bug in the extension. Please visit ' +
                'https://github.com/Questionable-Content-Extensions/client/issues and create an issue ' +
                'describing the following error detail as well as its stack trace, if you can.'
        )
        setTimeout(
            () =>
                alert(
                    "Questionable Content Extensions encountered a bug. See your browser's Javascript console for more details."
                ),
            250
        )

        throw e
    })
}

// --- --- ---

async function initializeComic() {
    const comicImg = await awaitElement<HTMLImageElement>(
        'img[src*="/comics/"]'
    )
    if (!comicImg) {
        qcBug('Could not find comic image element')
        return
    }

    // Grab comic we're starting out on
    let comicLinkUrl = comicImg.src
    let comicLinkUrlSplit = comicLinkUrl.split('/')
    const comic = parseInt(
        comicLinkUrlSplit[comicLinkUrlSplit.length - 1].split('.')[0]
    )
    debug('Current comic:', comic)

    let comicContainer = document.createElement('div')
    comicContainer.classList.add(QC_EXT_CLASSNAME, 'qc-ext-comic-container')

    const comicImgParent = comicImg.parentNode as HTMLElement

    if (comicImgParent.tagName === 'A') {
        // The comic strip has an anchor parent. That's the one we need to replace.
        const comicImgParentParent = comicImgParent.parentNode as HTMLElement
        comicImgParentParent.replaceChild(comicContainer, comicImgParent)
    } else {
        // The comic strip has no anchor parent. Just replace the comic strip directly.
        comicImgParent.replaceChild(comicContainer, comicImg)
    }

    const root = createRoot(comicContainer)
    root.render(
        <QcStrictMode>
            <Provider store={store}>
                <Comic initialComic={comic} initialComicSrc={comicLinkUrl} />
            </Provider>
        </QcStrictMode>
    )

    return comic
}

async function getLatestComic(comic: number) {
    // Figure out what the latest comic # is based on the URL in the
    // "Latest/Last" navigation button.
    const latestComicAnchor = await awaitElement<HTMLAnchorElement>(
        '#comicnav > li:nth-of-type(4) > a'
    )
    if (!latestComicAnchor) {
        qcBug('Could not find latest comic navigation element')
        return
    }
    const latestComicUrl = latestComicAnchor.href
    debug('Latest comic URL:', latestComicUrl)

    let latestComic = parseInt(latestComicUrl.split('=')[1])
    if (isNaN(latestComic)) {
        latestComic = comic
    }

    debug('Latest comic parsed #:', latestComic)
    return latestComic
}

function encaseBody() {
    const bodyContainer = document.createElement('div')
    bodyContainer.id = BODY_CONTAINER_ID
    const body = document.getElementsByTagName('body')[0]
    const children = Array.from(body.children)
    for (const child of children) {
        bodyContainer.appendChild(child)
    }
    body.appendChild(bodyContainer)
}

function initializePortal() {
    const portalContainer = document.createElement('div')
    portalContainer.id = PORTAL_CONTAINER_ID
    const body = document.getElementsByTagName('body')[0]
    body.appendChild(portalContainer)
}

function initializeComicNavigation() {
    // Jeph violates an HTML rule by having the same ID on two elements. What this means for us is
    // that in order to get a hold of both of them, we need to first grab one; change its ID and
    // then grab the second one, both using the same id selector.

    const comicNav = document.querySelector<HTMLUListElement>('#comicnav')
    if (!comicNav) {
        qcBug('Could not find first comic navigation list element')
        return
    }
    comicNav.id = 'comicnav1'

    let comicNav2 = document.querySelector<HTMLUListElement>('#comicnav')
    if (!comicNav2) {
        qcBug('Could not find second comic navigation list element')
        return
    }

    const comicNavParent = comicNav.parentNode as ParentNode

    let comicNavContainer = document.createElement('div')
    comicNavContainer.classList.add(
        QC_EXT_CLASSNAME,
        NAVIGATION_CONTAINER_CLASSNAME
    )
    comicNavParent.replaceChild(comicNavContainer, comicNav)

    const root = createRoot(comicNavContainer)
    root.render(
        <QcStrictMode>
            <Provider store={store}>
                <ComicNavigation />
            </Provider>
        </QcStrictMode>
    )

    let comicNav2Parent = comicNav2.parentNode as HTMLElement

    // The second #comicnav is in a <div class="row">/<div id="row"> for some reason. Let's ditch it if present.
    comicNavContainer = document.createElement('div')
    comicNavContainer.classList.add(
        QC_EXT_CLASSNAME,
        NAVIGATION_CONTAINER_CLASSNAME
    )
    if (
        comicNav2Parent.tagName === 'DIV' &&
        (comicNav2Parent.classList.contains('row') ||
            comicNav2Parent.id === 'row')
    ) {
        // Remove all children of comicNav2Parent
        while (comicNav2Parent.firstChild) {
            comicNav2Parent.removeChild(comicNav2Parent.lastChild as ChildNode)
        }
        // Then insert our comicNavContainer in its place
        comicNav2Parent.parentNode?.replaceChild(
            comicNavContainer,
            comicNav2Parent
        )
    } else {
        comicNav2Parent.replaceChild(comicNavContainer, comicNav2)
    }

    const root2 = createRoot(comicNavContainer)
    root2.render(
        <QcStrictMode>
            <Provider store={store}>
                <ComicNavigation />
            </Provider>
        </QcStrictMode>
    )
}

function initializeDateAndNews() {
    const news = document.querySelector<HTMLDivElement>('#news, #newspost')
    if (!news) {
        qcBug('Could not find news element')
        return
    }
    const newsData = news.innerHTML
    const newsParent = news.parentNode as ParentNode
    const newsPrevious = news.previousElementSibling as Element

    if (!newsPrevious.classList.contains(NAVIGATION_CONTAINER_CLASSNAME)) {
        newsParent.removeChild(newsPrevious)
    }

    const dateContainer = document.createElement('div')
    dateContainer.classList.add(QC_EXT_CLASSNAME, 'qc-ext-date-container')
    newsParent.insertBefore(dateContainer, news)

    const root = createRoot(dateContainer)
    root.render(
        <QcStrictMode>
            <Provider store={store}>
                <DateComponent />
            </Provider>
        </QcStrictMode>
    )

    const newsContainer = document.createElement('div')
    newsContainer.classList.add(QC_EXT_CLASSNAME, 'qc-ext-news-container')
    newsParent.replaceChild(newsContainer, news)

    const root2 = createRoot(newsContainer)
    root2.render(
        <QcStrictMode>
            <Provider store={store}>
                <News initialNews={newsData} />
            </Provider>
        </QcStrictMode>
    )
}

function initializeExtraNavigation() {
    const container = document.querySelector<HTMLDivElement>('#container')
    if (!container) {
        qcBug('Could not find container element')
        return
    }

    const extraContainer = document.createElement('div')
    extraContainer.classList.add(
        'qc-ext',
        'qc-ext-extra-navigation-container',
        'top-0',
        'z-10'
    )
    container.insertAdjacentElement('beforebegin', extraContainer)

    const root = createRoot(extraContainer)
    root.render(
        <QcStrictMode>
            <Provider store={store}>
                <ComicTitle />
                <Portals />
                <ComicDetailsPanel />
                <EditorModePanel />
                <ToastContainer />
            </Provider>
        </QcStrictMode>
    )
}

function initializeDebugError() {
    const container = document.querySelector<HTMLDivElement>('#container')
    if (!container) {
        qcBug('Could not find container element')
        return
    }

    const extraContainer = document.createElement('div')
    extraContainer.classList.add(
        'qc-ext',
        'qc-ext-extra-navigation-container',
        'top-0',
        'z-10'
    )
    container.insertAdjacentElement('beforebegin', extraContainer)

    const root = createRoot(extraContainer)
    root.render(
        <QcStrictMode>
            <Provider store={store}>
                <DebugLoadErrorPanel />
            </Provider>
        </QcStrictMode>
    )
}

function hijackShortcut() {
    async function goToLocked(
        dispatch: AppDispatch,
        state: RootState,
        itemSelector: (i: HydratedItemNavigationData) => ComicId | null
    ) {
        const itemQuery = dispatch(itemApiSlice.endpoints.allItems.initiate())
        const comicQuery = dispatch(
            comicApiSlice.endpoints.getComicData.initiate(
                toGetDataQueryArgs(state.comic.current, state.settings.values!)
            )
        )

        const [items, comic] = await Promise.all([itemQuery, comicQuery])

        itemQuery.unsubscribe()
        comicQuery.unsubscribe()

        if (!comic.data || !items.data) {
            error(
                "Can't navigate because either item query or comic query failed"
            )
            toast.error(
                "Can't navigate because either item query or comic query failed"
            )
            return
        }

        const [hydratedComicItemData] = hydrateItemData(comic.data, items.data)
        if (!hydratedComicItemData) {
            error(
                "Can't navigate because there was an error hydrating item data. " +
                    "This should be resolved by clicking the 'Refresh' button."
            )
            toast.error(
                "Can't navigate because there was an error hydrating item data. " +
                    "This should be resolved by clicking the 'Refresh' button."
            )
            return
        }

        const lockedItem = hydratedComicItemData.find(
            (i) => i.id === state.comic.lockedToItem
        )!
        const destination = itemSelector(lockedItem)
        if (destination) {
            dispatch(setCurrentComic(destination, { locked: true }))
        }
    }

    const setPrevious = () =>
        store.dispatch((dispatch, getState) => {
            const state = getState()
            if (state.comic.lockedToItem !== null) {
                goToLocked(dispatch, state, (i) => i.previous)
            } else {
                let previous = previousComicSelector(state)
                dispatch(setCurrentComic(previous))
            }
        })
    const setNext = () =>
        store.dispatch((dispatch, getState) => {
            const state = getState()
            if (state.comic.lockedToItem !== null) {
                goToLocked(dispatch, state, (i) => i.next)
            } else {
                let next = nextComicSelector(state)
                dispatch(setCurrentComic(next))
            }
        })

    const focusFilter = () =>
        store.dispatch((_dispatch, getState) => {
            const state = getState()
            if (state.settings.values!.editMode) {
                document.getElementById('qcext-allitems-filter')?.focus()
            }
        })

    try {
        if (typeof unsafeWindow !== undefined) {
            const shortcut = (unsafeWindow as any).shortcut

            shortcut.remove('Left')
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
                exportFunction(() => focusFilter(), unsafeWindow),
                disable_in_input
            )
        }
    } catch (ex) {
        if (ex !== 'ReferenceError: unsafeWindow is not defined') {
            console.error(ex)
        }
    }
}
