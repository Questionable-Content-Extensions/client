import React from 'react'
import { Provider } from 'react-redux'

import './qc.css'
import '~/index.css'

import store from '@store/store'

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

export const decorators = [
    (Story) => (
        <Provider store={store}>
            <Story />
        </Provider>
    ),
]
