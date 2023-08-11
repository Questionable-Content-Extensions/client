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

import './index.css'

import Comic from './components/Comic'
import ComicNavigation from './components/ComicNavigation'
import DateComponent from './components/Date'
import News from './components/News'
import QcExtMainWidget from './components/QcExtMainWidget/QcExtMainWidget'
import './services/comicDataService'
import comicService from './services/comicService'
import settingsService from './services/settingsService'
import Settings from './settings'
import { awaitElement, debug, error, fetch, info, qcBug, setup } from './utils'

// TODO: Project-wide issue: Handle errors on network, non-200 HTTP statuses, etc.

async function main() {
    const settings = await Settings.loadSettings()
    // TODO: Remove this line once we have a settings dialog:
    settings.values.showDebugLogs = true
    settingsService.initialize(settings)
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

    initializePortal()
    initializeComicNavigation()
    initializeDateAndNews()
    initializeExtraNavigation()

    // TODO: Initialize "message seat"

    comicService.setLatestComic(latestComic)
    comicService.setCurrentComic(comic)
}

async function developmentMain() {
    const settings = await Settings.loadSettings()
    // TODO: Remove this line once we have a settings dialog:
    settings.values.showDebugLogs = true
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
    comicContainer.classList.add('qc-ext', 'qc-ext-comic-container')

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
        <React.StrictMode>
            <Comic initialComic={comic} initialComicSrc={comicLinkUrl} />
        </React.StrictMode>,
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

function initializePortal() {
    const portalContainer = document.createElement('div')
    portalContainer.id = 'qc-ext-portal-container'
    const body = document.getElementsByTagName('body')[0]
    body.insertAdjacentElement('afterbegin', portalContainer)
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
    comicNavContainer.classList.add('qc-ext', 'qc-ext-navigation-container')
    comicNavParent.replaceChild(comicNavContainer, comicNav)
    ReactDOM.render(
        <React.StrictMode>
            <ComicNavigation />
        </React.StrictMode>,
        comicNavContainer
    )

    let comicNav2Parent = comicNav2.parentNode as HTMLElement

    // The front page places the second #comicnav in a <div class="row"> for some reason. Let's ditch it.
    comicNavContainer = document.createElement('div')
    comicNavContainer.classList.add('qc-ext', 'qc-ext-navigation-container')
    if (
        comicNav2Parent.tagName === 'DIV' &&
        comicNav2Parent.classList.contains('row')
    ) {
        while (comicNav2Parent.firstChild) {
            comicNav2Parent.removeChild(comicNav2Parent.lastChild as ChildNode)
        }
        comicNav2Parent.parentNode?.replaceChild(
            comicNavContainer,
            comicNav2Parent
        )
    } else {
        comicNav2Parent.replaceChild(comicNavContainer, comicNav2)
    }

    ReactDOM.render(
        <React.StrictMode>
            <ComicNavigation />
        </React.StrictMode>,
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

    if (!newsPrevious.classList.contains('qc-ext-navigation-container')) {
        newsParent.removeChild(newsPrevious)
    }

    const dateContainer = document.createElement('div')
    dateContainer.classList.add('qc-ext', 'qc-ext-date-container')
    newsParent.insertBefore(dateContainer, news)
    ReactDOM.render(
        <React.StrictMode>
            <DateComponent />
        </React.StrictMode>,
        dateContainer
    )

    const newsContainer = document.createElement('div')
    newsContainer.classList.add('qc-ext', 'qc-ext-news-container')
    newsParent.replaceChild(newsContainer, news)
    ReactDOM.render(
        <React.StrictMode>
            <News initialNews={newsData} />
        </React.StrictMode>,
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
        'sticky',
        'top-0',
        'z-10',
        'xl:static'
    )
    container.insertAdjacentElement('beforebegin', extraContainer)
    ReactDOM.render(
        <React.StrictMode>
            <QcExtMainWidget />
        </React.StrictMode>,
        extraContainer
    )
}
