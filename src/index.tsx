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
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import './index.css'

import Comic from '@components/Comic'
import ComicNavigation from '@components/ComicNavigation'
import DateComponent from '@components/Date'
import EditorModeExtraWidget from '@components/EditorModeExtraWidget'
import News from '@components/News'
import QcExtMainWidget from '@components/QcExtMainWidget/QcExtMainWidget'
import '@services/comicDataService'
import comicService from '@services/comicService'
import { loadSettings } from '@store/settingsSlice'

import Settings from '~/settings'
import store from '~/store/store'
import { awaitElement, debug, error, fetch, info, qcBug, setup } from '~/utils'

import { BODY_CONTAINER_ID, PORTAL_CONTAINER_ID } from './shared'

const QcStrictMode = React.StrictMode
// React.StrictMode causes errors in Chromium; set to some innocent element
// type instead when debugging in Chrome:
//const QcStrictMode = React.Fragment

// TODO: Project-wide issue: Handle errors on network, non-200 HTTP statuses, etc.

const QC_EXT_CLASSNAME = 'qc-ext'
const NAVIGATION_CONTAINER_CLASSNAME = 'qc-ext-navigation-container'

async function main() {
    const settings = await Settings.loadSettings()
    setup(settings.values.showDebugLogs)

    info('Running QC Extensions v' + GM.info.script.version)

    const comic = await initializeComic()
    if (!comic) {
        return
    }

    const latestComic = await getLatestComic(comic)
    if (!latestComic) {
        return
    }

    store.dispatch(loadSettings())

    encaseBody()
    initializePortal()
    initializeComicNavigation()
    initializeDateAndNews()
    initializeExtraNavigation()

    // TODO: Initialize "message seat"

    comicService.updateLatestComic(latestComic)
    comicService.setCurrentComic(comic)
}

async function developmentMain() {
    const settings = await Settings.loadSettings()
    setup(settings.values.showDebugLogs)

    const scriptUrl = 'http://localhost:8124/static/js/main.js'
    info(
        'Running QC Extensions in development mode. Fetching most recent script from ' +
            scriptUrl
    )

    fetch('http://localhost:8124/static/js/main.js')
        .then((response) => {
            info('Script is fetched. Handing control over.')

            // Ensure that when the fetched script runs, it doesn't keep trying to fetch and run itself.
            ;(window as any).__QC_EXT_DEVELOPMENT_LOADED = true
            // eslint-disable-next-line no-eval
            eval(response.responseText)
        })
        .catch((response) => {
            if (response.status === 0) {
                error('Could not fetch script. Are you running `npm start`?')
            } else {
                error(
                    'Could not fetch script. See response error object for potential clues.'
                )
            }
        })
}

const scriptVersion = GM.info.script.version
if (
    scriptVersion.indexOf('+development') !== -1 &&
    !(window as any).__QC_EXT_DEVELOPMENT_LOADED
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

    ReactDOM.render(
        <QcStrictMode>
            <Provider store={store}>
                <Comic initialComic={comic} initialComicSrc={comicLinkUrl} />
            </Provider>
        </QcStrictMode>,
        comicContainer
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
    ReactDOM.render(
        <QcStrictMode>
            <Provider store={store}>
                <ComicNavigation />
            </Provider>
        </QcStrictMode>,
        comicNavContainer
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

    ReactDOM.render(
        <QcStrictMode>
            <Provider store={store}>
                <ComicNavigation />
            </Provider>
        </QcStrictMode>,
        comicNavContainer
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
    ReactDOM.render(
        <QcStrictMode>
            <Provider store={store}>
                <DateComponent />
            </Provider>
        </QcStrictMode>,
        dateContainer
    )

    const newsContainer = document.createElement('div')
    newsContainer.classList.add(QC_EXT_CLASSNAME, 'qc-ext-news-container')
    newsParent.replaceChild(newsContainer, news)
    ReactDOM.render(
        <QcStrictMode>
            <Provider store={store}>
                <News initialNews={newsData} />
            </Provider>
        </QcStrictMode>,
        newsContainer
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
    ReactDOM.render(
        <QcStrictMode>
            <Provider store={store}>
                <QcExtMainWidget />
                <EditorModeExtraWidget />
            </Provider>
        </QcStrictMode>,
        extraContainer
    )
}
