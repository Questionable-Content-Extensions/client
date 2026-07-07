import { initialize as mswInitialize, mswLoader } from 'msw-storybook-addon'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'

import '../src/index.css'
import './qc.css'
import 'react-toastify/dist/ReactToastify.css'

import type { Preview } from '@storybook/react-vite'
import { cleanup } from '@testing-library/react'

import Settings from '../src/Settings'
import { apiSlice } from '../src/store/apiSlice'
import { setSettings } from '../src/store/settingsSlice'
import store from '../src/store/store'
import { waitForPendingQueriesToSettle } from '../src/storybook/waitForPendingQueriesToSettle'
import { setup } from '../src/utils'

setup()

const unhandled: string[] = []

mswInitialize({
    serviceWorker: {
        url:
            process.env.NODE_ENV === 'production'
                ? '/client/storybook/mockServiceWorker.js'
                : '/mockServiceWorker.js',
    },
    onUnhandledRequest(req, _print) {
        const url = new URL(req.url)
        if (
            url.hostname !== 'localhost' ||
            (url.hostname === 'localhost' && url.pathname.startsWith('/src/'))
        ) {
            return
        }

        unhandled.push(`${req.method} ${req.url}`)
    },
})

store.dispatch(setSettings(Settings.DEFAULTS))

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
    },
    loaders: [mswLoader],
    decorators: [
        (Story) => (
            <Provider store={store}>
                <ToastContainer />
                <Story />
            </Provider>
        ),
    ],
    beforeEach: async () => {
        unhandled.length = 0

        // `resetApiState()` makes any still-subscribed component immediately
        // refetch (that's how RTK Query is documented to behave) - if the
        // *previous* story's tree were still mounted when this runs, that
        // refetch would go out through whatever MSW handlers are active at
        // that instant (the outgoing story's, since this story's `mswLoader`
        // handler swap hasn't happened yet if this ran in `afterEach`
        // instead). Doing it here, at the start of the *next* story - after
        // the test runner's own teardown of the previous one has definitely
        // happened - avoids that.
        await waitForPendingQueriesToSettle()
        cleanup()
        store.dispatch(apiSlice.util.resetApiState())
    },
    afterEach: async () => {
        if (unhandled.length > 0) {
            throw new Error(
                `Unhandled MSW request(s) detected during Storybook test run:\n\n- ${unhandled.join('\n- ')}\n\n` +
                    `This means one or more stories triggered a fetch to /api that had no matching MSW handler. ` +
                    `If you wish to mock an error response, please refer to this guide: https://mswjs.io/docs/recipes/mocking-error-responses\n` +
                    `And this guide: https://storybook.js.org/addons/msw-storybook-addon`
            )
        }
    },
}

export default preview
