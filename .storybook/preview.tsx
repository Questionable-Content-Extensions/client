// For whatever reason, Typescript can't find things from this file;
// at least not as far as vscode is concerned.
// I can't figure out why, though, so for now, this file will appear
// to have errors, even though it doesn't really.
//
import { rest, setupWorker } from 'msw'
import React from 'react'
import { Provider } from 'react-redux'

import './qc.css'
import '~/index.css'

import { Comic } from '@models/Comic'
import { PresentComic } from '@models/PresentComic'
import { setSettings } from '@store/settingsSlice'
import store from '@store/store'

import { ALL_ITEMS, COMIC_DATA_666 } from '~/mocks'
import Settings from '~/settings'
import { setup } from '~/utils'

setup(true)

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
}

store.dispatch(setSettings(Settings.DEFAULTS))

export const decorators = [
    (Story) => (
        <Provider store={store}>
            <Story />
        </Provider>
    ),
]

// Storybook executes this module in both bootstrap phase (Node)
// and a story's runtime (browser). However, we cannot call `setupWorker`
// in Node environment, so we need to check if we're in a browser.
if (typeof global.process === 'undefined') {
    // Create the mockServiceWorker (msw).
    const worker = setupWorker()
    // Start the service worker.
    worker.start({
        onUnhandledRequest(req, print) {
            if (!req.url.href.startsWith('http://localhost:3000/api/')) {
                return
            }

            print.warning()
        },
    })
    // Make the `worker` and `rest` references available globally,
    // so they can be accessed in stories.
    window.msw = { worker, rest }

    // #region Add some default/always there msw handlers:
    worker.use(
        rest.get('http://localhost:3000/api/v2/itemdata/', (req, res, ctx) => {
            const all = [...ALL_ITEMS]
            const name =
                'This is a mocked API response and will only be accurate for comic 666'
            all.push({
                id: -1,
                name,
                shortName: name,
                count: 0,
                type: 'storyline',
                color: 'ffaabb',
            })
            return res(ctx.json(all))
        })
    )
    worker.use(
        rest.get(
            'http://localhost:3000/api/v2/comicdata/:comicId',
            (req, res, ctx) => {
                const { comicId } = req.params
                if (comicId === '666') {
                    return res(
                        ctx.delay(1000 + Math.random() * 1000),
                        ctx.json(COMIC_DATA_666)
                    )
                } else {
                    const comic: Comic = {
                        ...COMIC_DATA_666,
                        items: [
                            ...(COMIC_DATA_666 as PresentComic).items,
                            {
                                id: -1,
                                first: 0,
                                last: 0,
                                next: 0,
                                previous: 0,
                            },
                        ],
                    } as any
                    // We pretend this takes 1-2 seconds so we get to
                    // observe the loading UX
                    return res(
                        ctx.delay(1000 + Math.random() * 1000),
                        ctx.json(comic)
                    )
                }
            }
        )
    )
    //#endregion
}
