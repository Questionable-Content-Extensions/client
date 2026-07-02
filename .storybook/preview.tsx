import { initialize as mswInitialize, mswLoader } from 'msw-storybook-addon'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'

import '../src/index.css'
import './qc.css'
import 'react-toastify/dist/ReactToastify.css'

import type { Preview } from '@storybook/react-vite'

import Settings from '../src/Settings'
import { setSettings } from '../src/store/settingsSlice'
import store from '../src/store/store'
import { setup } from '../src/utils'

setup()

mswInitialize({
    onUnhandledRequest(req, print) {
        if (!req.url.startsWith('http://localhost:3000/api/')) {
            return
        }

        print.warning()
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
}

export default preview
