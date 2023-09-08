// For whatever reason, Typescript can't find things from this file;
// at least not as far as vscode is concerned.
// I can't figure out why, though, so for now, this file will appear
// to have errors, even though it doesn't really.
//
import { StartOptions, rest, setupWorker } from 'msw'
import React from 'react'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'

import './qc.css'
import 'react-toastify/dist/ReactToastify.min.css'
import '~/index.css'

import { setSettings } from '@store/settingsSlice'
import store from '@store/store'

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
            <ToastContainer />
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
    const options: StartOptions = {
        onUnhandledRequest(req, print) {
            if (!req.url.href.startsWith('http://localhost:3000/api/')) {
                return
            }

            print.warning()
        },
    }
    if (process.env.NODE_ENV === 'production') {
        const pathname = window.location.pathname
        const pathbasename = pathname.substring(
            0,
            pathname.lastIndexOf('/') + 1
        )
        options.serviceWorker = {
            url: `${pathbasename}mockServiceWorker.js`,
        }
    }
    window.mswStart = worker.start(options)
    // Make the `worker` and `rest` references available globally,
    // so they can be accessed in stories.
    window.msw = { worker, rest }
}
